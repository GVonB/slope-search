-- Load SkiArea table
LOAD DATA LOCAL INFILE '/data/clean_ski_area.csv'
INTO TABLE SkiArea
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(SkiAreaID, Country, Region, DownhillDistanceKm, VerticalM, MinElevationM, MaxElevationM, LiftCount, RunConvention, OpenSkiMap, Geometry, Latitude, Longitude);

-- Load SkiAreaWebsite table
LOAD DATA LOCAL INFILE '/data/clean_ski_area_website.csv'
INTO TABLE SkiAreaWebsite
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(SkiAreaID, WebsiteURL);

-- Load SkiAreaName table
LOAD DATA LOCAL INFILE '/data/clean_ski_area_name.csv'
INTO TABLE SkiAreaName
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(SkiAreaID, Name);

-- Load Run table
LOAD DATA LOCAL INFILE '/data/clean_run.csv'
INTO TABLE Run
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(RunID, Country, Region, Difficulty, Color, Lit, InclinedLengthM, DescentM, AveragePitch, MaxPitch, MinElevationM, MaxElevationM, DifficultyConvention, OpenSkiMap, Geometry, Latitude, Longitude);

-- Load RunName table
LOAD DATA LOCAL INFILE '/data/clean_run_name.csv'
INTO TABLE RunName
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(RunID, Name);

-- Load SkiAreaRun table
LOAD DATA LOCAL INFILE '/data/clean_ski_area_run.csv'
INTO TABLE SkiAreaRun
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(RunID, SkiAreaID);