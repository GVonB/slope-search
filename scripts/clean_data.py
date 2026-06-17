#!/usr/bin/env python3
"""Clean raw OpenSkiMap exports into the seed files the backend loads on startup.

Reads notebook/data/{ski_areas,runs}.csv (downloaded from openskimap.org) and writes
gzipped NDJSON to server/seed/. Each output line is a JSON array of column values in
the same order createTables.sql / seed.js expect; SQL NULLs are JSON null.

Rerun this only when the source data changes, then commit server/seed/*.ndjson.gz.

    python scripts/clean_data.py
"""
import gzip
import json
import math
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "notebook" / "data"
OUT = ROOT / "server" / "seed"


def write_ndjson(df, name, columns):
    """Write df[columns] as gzipped NDJSON rows (JSON arrays), NaN/NaT -> null."""
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.ndjson.gz"
    rows = 0
    with gzip.open(path, "wt", encoding="utf-8") as f:
        for record in df[columns].itertuples(index=False, name=None):
            cleaned = [None if (isinstance(v, float) and math.isnan(v)) else v for v in record]
            f.write(json.dumps(cleaned, ensure_ascii=False))
            f.write("\n")
            rows += 1
    print(f"  {path.relative_to(ROOT)}: {rows} rows")


def main():
    # OpenSkiMap exports these single-value fields with plural headers; normalize
    # to the singular names the rest of this script and the schema expect.
    rename_plural = {"countries": "country", "regions": "region", "localities": "locality"}
    ski_areas = pd.read_csv(RAW / "ski_areas.csv", low_memory=False).rename(columns=rename_plural)
    runs = pd.read_csv(RAW / "runs.csv", low_memory=False).rename(columns=rename_plural)

    # --- Ski areas: keep operating downhill areas with a name ---
    sa = ski_areas.dropna(subset=["name"])
    sa = sa[sa["status"] == "operating"]
    sa = sa[sa["has_downhill"] == "yes"]
    sa = sa[[
        "id", "name", "country", "region", "downhill_distance_km", "vertical_m",
        "min_elevation_m", "max_elevation_m", "lift_count", "run_convention",
        "openskimap", "geometry", "lat", "lng", "websites",
    ]].rename(columns={
        "id": "SkiAreaID", "name": "Name", "country": "Country", "region": "Region",
        "downhill_distance_km": "DownhillDistanceKm", "vertical_m": "VerticalM",
        "min_elevation_m": "MinElevationM", "max_elevation_m": "MaxElevationM",
        "lift_count": "LiftCount", "run_convention": "RunConvention",
        "openskimap": "OpenSkiMap", "geometry": "Geometry", "lat": "Latitude",
        "lng": "Longitude",
    })

    # Manual fixes for a few source records missing a country...
    sa.loc[sa["SkiAreaID"] == "30ac6c66766d9cc722caff3b7d0acd06f6fd8aca", "Country"] = "China"
    sa.loc[sa["SkiAreaID"] == "3b7e50223a55ba6d0ffbe3b7ab0760f273f88978", "Country"] = "China"
    sa.loc[sa["SkiAreaID"] == "65691fdd8c27897a784532f1823d16de47f5fdbd", "Country"] = "Antarctica"
    # ...then drop any still-uncountried areas (Country is NOT NULL and core to the app).
    # Done before building the name/website/junction tables so they don't reference dropped IDs.
    sa = sa.dropna(subset=["Country"])

    # Multi-value websites -> SkiAreaWebsite (space separated)
    websites = sa[["SkiAreaID", "websites"]].dropna()
    websites = websites.assign(WebsiteURL=websites["websites"].str.split(" ")).explode("WebsiteURL")
    websites = websites[["SkiAreaID", "WebsiteURL"]]
    sa = sa.drop(columns=["websites"])

    # Multi-value names -> SkiAreaName (comma separated)
    names = sa[["SkiAreaID", "Name"]].dropna()
    names = names.assign(Name=names["Name"].str.split(",")).explode("Name")
    names["Name"] = names["Name"].str.strip()
    sa = sa.drop(columns=["Name"])

    # --- Runs: keep named runs attached to a ski area, with a country (NOT NULL) ---
    rc = runs.dropna(subset=["name"]).dropna(subset=["ski_area_ids"])
    rc = rc[[
        "id", "country", "region", "difficulty", "color", "lit",
        "inclined_length_m", "descent_m", "average_pitch_%", "max_pitch_%",
        "min_elevation_m", "max_elevation_m", "difficulty_convention",
        "openskimap", "geometry", "lat", "lng", "name",
    ]].rename(columns={
        "id": "RunID", "country": "Country", "region": "Region",
        "difficulty": "Difficulty", "color": "Color", "lit": "Lit",
        "inclined_length_m": "InclinedLengthM", "descent_m": "DescentM",
        "average_pitch_%": "AveragePitch", "max_pitch_%": "MaxPitch",
        "min_elevation_m": "MinElevationM", "max_elevation_m": "MaxElevationM",
        "difficulty_convention": "DifficultyConvention", "openskimap": "OpenSkiMap",
        "geometry": "Geometry", "lat": "Latitude", "lng": "Longitude",
    })
    rc = rc.dropna(subset=["Country"])  # Run.Country is NOT NULL
    rc["Lit"] = rc["Lit"].map({"yes": 1, "no": 0})  # else NaN -> null

    # Multi-value run names -> RunName (comma separated)
    run_names = rc[["RunID", "name"]].dropna()
    run_names = run_names.assign(Name=run_names["name"].str.split(",")).explode("Name")
    run_names["Name"] = run_names["Name"].str.strip()
    run_names = run_names[["RunID", "Name"]]
    rc = rc.drop(columns=["name"])

    # SkiAreaRun junction (semicolon separated ids), deduped, FK-filtered
    sar = runs[["id", "ski_area_ids"]].dropna()
    sar = sar.assign(SkiAreaID=sar["ski_area_ids"].str.split(";")).explode("SkiAreaID")
    sar = sar.rename(columns={"id": "RunID"})
    sar["SkiAreaID"] = sar["SkiAreaID"].str.strip()
    sar = sar[["RunID", "SkiAreaID"]].drop_duplicates(subset=["RunID", "SkiAreaID"])
    valid_runs, valid_areas = set(rc["RunID"]), set(sa["SkiAreaID"])
    sar = sar[sar["RunID"].isin(valid_runs) & sar["SkiAreaID"].isin(valid_areas)]

    print("Writing seed files:")
    write_ndjson(sa, "ski_area", [
        "SkiAreaID", "Country", "Region", "DownhillDistanceKm", "VerticalM",
        "MinElevationM", "MaxElevationM", "LiftCount", "RunConvention", "OpenSkiMap",
        "Geometry", "Latitude", "Longitude",
    ])
    write_ndjson(websites, "ski_area_website", ["SkiAreaID", "WebsiteURL"])
    write_ndjson(names, "ski_area_name", ["SkiAreaID", "Name"])
    write_ndjson(rc, "run", [
        "RunID", "Country", "Region", "Difficulty", "Color", "Lit", "InclinedLengthM",
        "DescentM", "AveragePitch", "MaxPitch", "MinElevationM", "MaxElevationM",
        "DifficultyConvention", "OpenSkiMap", "Geometry", "Latitude", "Longitude",
    ])
    write_ndjson(run_names, "run_name", ["RunID", "Name"])
    write_ndjson(sar, "ski_area_run", ["RunID", "SkiAreaID"])
    print("Done.")


if __name__ == "__main__":
    main()
