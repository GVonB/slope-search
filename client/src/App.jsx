import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

function App() {
  // ---USE STATES---
  const [skiAreas, setSkiAreas] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [minVertical, setMinVertical] = useState('');
  // If this sounds confusing, it's not. Take all runs at a ski area, average their pitch.
  // This gives us the "steepest" run, now set a minimum steepness to query.
  const [minMaxAveragePitch, setMinMaxAveragePitch] = useState('');
  const [minRunCount, setMinRunCount] = useState('');
  const [minDownhillDistanceKm, setMinDownhillDistanceKm] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  // Single selected region in dropdown
  const [region, setRegion] = useState('');
  // List of regions to populate dropdown
  const [regions, setRegions] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  // Handling favorites list
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [resultLimit, setResultLimit] = useState('100');
  const [minBlackCount, setMinBlackCount] = useState('');
  const [minBlueCount, setMinBlueCount] = useState('');
  const [minGreenCount, setMinGreenCount] = useState('');
  const [minRedCount, setMinRedCount] = useState('');
  const [minGreyCount, setMinGreyCount] = useState('');
  const [minOrangeCount, setMinOrangeCount] = useState('');
  // Handles mode switch
  const [viewMode, setViewMode] = useState('areas'); // 'areas' or 'runs'
  // ---END USE STATES

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        const data = await res.json();
        setUserId(data.userId);

        // Fetch favorites immediately for accurate button states
        const favRes = await fetch(`api/favorites/${data.userId}`);
        const favData = await favRes.json();
        setFavoriteIds(new Set(favData.map(f => f.skiAreaId)));
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  // Use effect for getting regions based on the selected country
  useEffect(() => {
    if (selectedCountry) {
      fetch(`/api/regions?country=${encodeURIComponent(selectedCountry)}`)
        .then(res => res.json())
        .then(data => setRegions(data))
        .catch(err => console.error("Error fetching regions", err));
    } else {
      setRegions([]);
      setRegion('');
    }
  }, [selectedCountry]);
  // Only countries that exist in the db are used for options here.
  const countries = [
    'Albania', 'Andorra', 'Antarctica', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
    'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China', 'Croatia', 'Cyprus',
    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',
    'Germany', 'Greece', 'Greenland', 'Hungary', 'Iceland', 'India', 'Iran',
    'Israel', 'Italy', 'Japan', 'Kazakhstan', 'Korea', 'Kosovo', 'Kyrgyzstan',
    'Latvia', 'Lebanon', 'Lesotho', 'Liechtenstein', 'Lithuania', 'Mexico',
    'Mongolia', 'Montenegro', 'Morocco', 'Netherlands', 'New Zealand',
    'North Korea', 'North Macedonia', 'Norway', 'Pakistan', 'Poland',
    'Portugal', 'Republic of Ireland', 'Romania', 'Russia', 'Serbia',
    'Slovakia', 'Slovenia', 'South Africa', 'Spain', 'Sweden', 'Switzerland',
    'Taiwan', 'Tajikistan', 'Turkey', 'Ukraine', 'United Kingdom',
    'United States', 'Uzbekistan'
  ];

  const orderByOptions = [
    { label: 'Vertical', value: 'VerticalM' },
    { label: 'Max Average Pitch', value: 'maxAverageRunPitch' },
    { label: 'Run Count', value: 'runCount' },
    { label: 'Downhill Distance', value: 'DownhillDistanceKm' },
    { label: 'Lift Count', value: 'LiftCount' },
    { label: 'Max Elevation', value: 'MaxElevationM' },
  ];

  const sortOptions = [
    { label: 'Descending', value: 'DESC' },
    { label: 'Ascending', value: 'ASC' },
  ];

  const limitOptions = [
    { label: '5 Results', value: '5' },
    { label: '10 Results', value: '10' },
    { label: '25 Results', value: '25' },
    { label: '100 Results', value: '100' },
    { label: 'All Results', value: 'ALL' },
  ];
  
  const handleFetchSkiAreas = async (forceFavoritesOnly = favoritesOnly) => {
    try {
      // For now, if showing favorites, filtering doesn't apply.
      // I think I need additional backend structure to really handle
      // filtering + favorites at the same time in an efficient structure.
      if (forceFavoritesOnly && userId) {
        const favRes = await fetch(`/api/favorites/${userId}`);
        const favoriteData = await favRes.json();
        setSkiAreas(favoriteData);
        return;
      }

      // If favorites isn't toggled, build an api call from filters
      const query = new URLSearchParams();
      if (selectedCountry) query.append('country', selectedCountry);
      if (minVertical) query.append('minVertical', minVertical);
      if (minMaxAveragePitch) {
        const slopeRatio = Math.tan((minMaxAveragePitch * Math.PI) / 180);
        query.append('minMaxPitch', slopeRatio);
      }
      if (minRunCount) query.append('minRunCount', minRunCount);
      if (region) query.append('region', region);
      if (minDownhillDistanceKm) query.append('minDownhillDistanceKm', minDownhillDistanceKm);
      if (orderBy) query.append('orderBy', orderBy);
      if (sortOrder) query.append('sortOrder', sortOrder);
      if (minBlackCount) query.append('minBlackCount', minBlackCount);
      if (minBlueCount) query.append('minBlueCount', minBlueCount);
      if (minGreenCount) query.append('minGreenCount', minGreenCount);
      if (minRedCount) query.append('minRedCount', minRedCount);
      if (minGreyCount) query.append('minGreyCount', minGreyCount);
      if (minOrangeCount) query.append('minOrangeCount', minOrangeCount);
      if (resultLimit !== 'ALL') {
        query.append('limit', resultLimit);
      }
      const res = await fetch(`/api/ski-areas?${query.toString()}`);
      const data = await res.json();
      setSkiAreas(data);
    } catch (error) {
      console.error('Error fetching ski areas:', error);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex justify-end items-center">
        {userId ? (
          <Button disabled variant="secondary">
            Logged in as: {username}
          </Button>
        ) : (
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Enter username"
              className="w-46"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
          </div>
        )}
      </div>
      <h1 className="text-6xl font-bold mb-6 text-center">Slope Search 🏔️</h1>
      <div className="mb-8 flex gap-2 justify-center">
        <Button className="w-46" variant={viewMode === 'areas' ? "default" : "outline"} onClick={() => setViewMode('areas')}>
          Ski Areas
        </Button>
        <Button className="w-46" variant={viewMode === 'runs' ? "default" : "outline"} onClick={() => setViewMode('runs')}>
          Ski Runs
        </Button>
        </div>
        <div className="flex flex-wrap mb-4 gap-2">
          {/* Country Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedCountry || "All Countries"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSelectedCountry("")}>
                All Countries
              </DropdownMenuItem>
              {countries.map((country) => (
                <DropdownMenuItem
                  key={country}
                  onSelect={() => setSelectedCountry(country)}
                >
                  {country}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Region Dropdown */}
          {regions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {region || "All Regions"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setRegion("")}>All Regions</DropdownMenuItem>
                {regions.map(r => (
                  <DropdownMenuItem key={r} onSelect={() => setRegion(r)}>
                    {r}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Sort By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {orderByOptions.find(o => o.value === orderBy)?.label || "Sort By"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {orderByOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setOrderBy(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Order Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {sortOptions.find(o => o.value === sortOrder)?.label || "Sort Order"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSortOrder("DESC")}>
                Descending
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortOrder("ASC")}>
                Ascending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {limitOptions.find(o => o.value === resultLimit)?.label || "Result Limit"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {limitOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setResultLimit(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap justify-between gap-2 mb-4">
          {/* Inputs row*/}
          <Input
            type="number"
            placeholder="Min Vertical (m)"
            value={minVertical}
            onChange={(e) => setMinVertical(e.target.value)}
            className="w-46"
          />
          <Input
            type="number"
            placeholder="Min Max Avg Pitch (°)"
            value={minMaxAveragePitch}
            onChange={(e) => setMinMaxAveragePitch(e.target.value)}
            className="w-46"
          />
          <Input
            type="number"
            placeholder="Min Run Count"
            value={minRunCount}
            onChange={(e) => setMinRunCount(e.target.value)}
            className="w-46"
          />
          <Input
            type="number"
            placeholder="Min Downhill Dist (km)"
            value={minDownhillDistanceKm}
            onChange={(e) => setMinDownhillDistanceKm(e.target.value)}
            className="w-46"
          />
        </div>
        <div className="grid grid-cols-6 gap-4 mb-4">
          <Input
            type="number"
            placeholder="Min Green Runs"
            value={minGreenCount}
            onChange={(e) => setMinGreenCount(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min Blue Runs"
            value={minBlueCount}
            onChange={(e) => setMinBlueCount(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min Black Runs"
            value={minBlackCount}
            onChange={(e) => setMinBlackCount(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min Red Runs"
            value={minRedCount}
            onChange={(e) => setMinRedCount(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min Grey Runs"
            value={minGreyCount}
            onChange={(e) => setMinGreyCount(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min Orange Runs"
            value={minOrangeCount}
            onChange={(e) => setMinOrangeCount(e.target.value)}
          />
        </div>
        {/* This ternary operator changes columns from 2 to 3 if logged in*/}
        <div className={`grid ${userId ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-4`}>
          <Button
            className="w-full"
            onClick={() => {
              setFavoritesOnly(false);
              handleFetchSkiAreas(false);
            }}
          >
            Load Ski Areas
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => {
              setSelectedCountry('');
              setOrderBy('');
              setSortOrder('DESC');
              setMinVertical('');
              setMinMaxAveragePitch('');
              setMinRunCount('');
              setMinDownhillDistanceKm('');
            }}
          >
            Clear Filters
          </Button>
          {/* Only show the "show favorites" button if "logged in"*/}
          {userId && (
            <Button
              variant={favoritesOnly ? "default" : "outline"}
              onClick={async () => {
                const newValue = !favoritesOnly;
                setFavoritesOnly(newValue);
                handleFetchSkiAreas(newValue);
              }}
            >
              {favoritesOnly ? "Back to Filters" : "Show Favorites"}
            </Button>
          )}
        </div>

      {skiAreas.map((skiArea, index) => {
        const degrees = skiArea.maxAverageRunPitch
          ? Math.atan(skiArea.maxAverageRunPitch) * (180 / Math.PI)
          : null;

        const colors = [
          { label: 'Green', color: 'bg-green-500', count: skiArea.greenCount },
          { label: 'Blue', color: 'bg-blue-500', count: skiArea.blueCount },
          { label: 'Red', color: 'bg-red-500', count: skiArea.redCount },
          { label: 'Black', color: 'bg-black', count: skiArea.blackCount },
          { label: 'Grey', color: 'bg-gray-500', count: skiArea.greyCount },
          { label: 'Orange', color: 'bg-orange-500', count: skiArea.orangeCount },
        ];

        return (
          <Card key={skiArea.skiAreaId} onClick={() => toggleExpand(index)} className="mb-4 p-4 max-w-full md:max-w-5xl mx-auto bg-gray-100 cursor-pointer">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h2 className="text-xl font-bold">{skiArea.primaryName}</h2>
                <p className="text-sm text-gray-600">{skiArea.country}, {skiArea.region}</p>
              </div>
              <div className="text-center">
                <p>Vertical: {skiArea.verticalM ?? '—'} m</p>
                <p>Lifts: {skiArea.liftCount ?? '—'}</p>
                <p>Runs: {skiArea.runCount ?? '—'}</p>
                <p>Downhill: {skiArea.downhillDistanceKm ?? '—'} km</p>
              </div>
              <div className="text-right">
                <p>Max Pitch: {degrees !== null ? `${degrees.toFixed(1)}°` : '—'}</p>
                <p>Convention: {skiArea.runConvention ?? '—'}</p>
                <div className="mt-4">
                {userId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const isFavorited = favoriteIds.has(skiArea.skiAreaId);

                      try {
                        const endpoint = isFavorited
                          ? '/api/favorites/remove'
                          : '/api/favorites/add';

                        await fetch(endpoint, {
                          method: isFavorited ? 'DELETE' : 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userId,
                            skiAreaId: skiArea.skiAreaId,
                          }),
                        });

                        const updated = new Set(favoriteIds);
                        if (isFavorited) {
                          updated.delete(skiArea.skiAreaId);
                        } else {
                          updated.add(skiArea.skiAreaId);
                        }
                        setFavoriteIds(updated);

                        if (favoritesOnly) {
                          handleFetchSkiAreas(true);
                        }
                      } catch (err) {
                        console.error('Failed to update favorite:', err);
                        alert('Error updating favorite');
                      }
                    }}
                  >
                    {favoriteIds.has(skiArea.skiAreaId)
                      ? '💔 Remove Favorite'
                      : '❤️ Add to Favorites'}
                  </Button>
                )}
                </div>
              </div>
            </div>

            {/* Full-width stacked progress bar (always visible) */}
            <div className="mt-2 flex w-full h-4 rounded overflow-hidden bg-gray-300">
              {colors.map((c) => {
                const percent = skiArea.runCount ? (c.count / skiArea.runCount) * 100 : 0;
                return (
                  <div
                    key={c.label}
                    className={`${c.color} h-full`}
                    style={{ width: `${percent}%` }}
                    title={`${c.label}: ${c.count ?? 0} runs (${percent.toFixed(1)}%)`}
                  />
                );
              })}
            </div>

            {/* 2-row, 3-column color grid (always visible) */}
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              {colors.map((c) => (
                <p key={c.label} className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${c.color}`}></span>
                  {c.label}: {c.count ?? 0}
                </p>
              ))}
            </div>
            {expandedIndex === index && (
              <div className="mt-4 text-sm">
                <h3 className="font-semibold mb-2">Additional Information</h3>
                <p>Min Elevation: {skiArea.minElevationM ?? '—'} m</p>
                <p>Max Elevation: {skiArea.maxElevationM ?? '—'} m</p>
                <p>Latitude: {skiArea.latitude ?? '—'}</p>
                <p>Longitude: {skiArea.longitude ?? '—'}</p>
                <p>
                  Map: <a href={skiArea.openSkiMap} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View on OpenSkiMap</a>
                </p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default App;