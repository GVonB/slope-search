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
  // List of regions to populate dropdown for ski areas
  const [skiAreaRegions, setSkiAreaRegions] = useState([]);
  // List of regions to populate dropdown for runs
  const [runRegions, setRunRegions] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  // Handling favorites list
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  // TODO: rename a lot of the ski are specific states to show that
  const [resultLimit, setResultLimit] = useState('100');
  const [runResultLimit, setRunResultLimit] = useState('100');
  const [minBlackCount, setMinBlackCount] = useState('');
  const [minBlueCount, setMinBlueCount] = useState('');
  const [minGreenCount, setMinGreenCount] = useState('');
  const [minRedCount, setMinRedCount] = useState('');
  const [minGreyCount, setMinGreyCount] = useState('');
  const [minOrangeCount, setMinOrangeCount] = useState('');
  const [runCountry, setRunCountry] = useState('');
  const [runRegion, setRunRegion] = useState('');
  const [runDifficulty, setRunDifficulty] = useState('');
  const [runColor, setRunColor] = useState('');
  const [minInclinedLength, setMinInclinedLength] = useState('');
  const [minAveragePitch, setMinAveragePitch] = useState('');
  const [runs, setRuns] = useState([]);
  const [skiAreaNames, setSkiAreaNames] = useState([]);
  const [selectedSkiAreaId, setSelectedSkiAreaId] = useState('');
  // Separate selected ski area for the runs dropdown
  const [runSelectedSkiAreaId, setRunSelectedSkiAreaId] = useState('');
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
  // Use effect for getting regions based on the selected country (ski areas)
  useEffect(() => {
    if (selectedCountry) {
      fetch(`/api/regions?country=${encodeURIComponent(selectedCountry)}`)
        .then(res => res.json())
        .then(data => setSkiAreaRegions(data))
        .catch(err => console.error("Error fetching regions", err));
    } else {
      setSkiAreaRegions([]);
      setRegion('');
    }
  }, [selectedCountry]);

  // Use effect for getting regions based on the selected run country (runs)
  useEffect(() => {
    if (runCountry) {
      const fetchRegions = async () => {
        try {
          const res = await fetch(`/api/regions?country=${encodeURIComponent(runCountry)}`);
          const data = await res.json();
          setRunRegions(data);
        } catch (err) {
          console.error("Error fetching regions", err);
        }
      };
      fetchRegions();
    } else {
      setRunRegions([]);
      setRunRegion('');
    }
  }, [runCountry]);

  useEffect(() => {
    const fetchSkiAreaNames = async () => {
      try {
        const query = new URLSearchParams();
        if (runCountry) query.append('country', runCountry);
        if (runRegion) query.append('region', runRegion);

        const res = await fetch(`/api/ski-areas/names?${query.toString()}`);
        const data = await res.json();
        setSkiAreaNames(data);
      } catch (err) {
        console.error('Error fetching ski area names', err);
        setSkiAreaNames([]);
      }
    };

    if (runCountry) {
      fetchSkiAreaNames();
    } else {
      setSkiAreaNames([]);
      setSelectedSkiAreaId('');
    }
  }, [runCountry, runRegion]);

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

  const skiAreaOrderByOptions = [
    { label: 'Vertical', value: 'VerticalM' },
    { label: 'Max Average Pitch', value: 'maxAverageRunPitch' },
    { label: 'Run Count', value: 'runCount' },
    { label: 'Downhill Distance', value: 'DownhillDistanceKm' },
    { label: 'Lift Count', value: 'LiftCount' },
    { label: 'Max Elevation', value: 'MaxElevationM' },
  ];

  const runOrderByOptions = [
    { label: 'Inclined Length', value: 'InclinedLengthM' },
    { label: 'Average Pitch', value: 'AveragePitch' },
    { label: 'Max Pitch', value: 'MaxPitch' },
    { label: 'Descent', value: 'DescentM' },
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

  const handleFetchRuns = async () => {
    const query = new URLSearchParams();
    if (runCountry) query.append('country', runCountry);
    if (runRegion) query.append('region', runRegion);
    if (runDifficulty) query.append('difficulty', runDifficulty);
    if (runColor) query.append('color', runColor);
    if (minInclinedLength) query.append('minInclinedLength', minInclinedLength);
    if (minAveragePitch) query.append('minAveragePitch', minAveragePitch);
    if (runSelectedSkiAreaId) query.append('skiAreaId', runSelectedSkiAreaId);
    if (orderBy) query.append('orderBy', orderBy);
    if (sortOrder) query.append('sortOrder', sortOrder);
    if (runResultLimit !== 'ALL') {
      query.append('limit', runResultLimit);
    }

    const res = await fetch(`/api/runs?${query.toString()}`);
    const data = await res.json();
    setRuns(data);
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

        {viewMode === 'areas' && (
          <>
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
              {skiAreaRegions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {region || "All Regions"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setRegion("")}>All Regions</DropdownMenuItem>
                    {skiAreaRegions.map(r => (
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
                    {skiAreaOrderByOptions.find(o => o.value === orderBy)?.label || "Sort By"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {skiAreaOrderByOptions.map((option) => (
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
                placeholder="Min Greens"
                value={minGreenCount}
                onChange={(e) => setMinGreenCount(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Min Blues"
                value={minBlueCount}
                onChange={(e) => setMinBlueCount(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Min Blacks"
                value={minBlackCount}
                onChange={(e) => setMinBlackCount(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Min Reds"
                value={minRedCount}
                onChange={(e) => setMinRedCount(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Min Greys"
                value={minGreyCount}
                onChange={(e) => setMinGreyCount(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Min Oranges"
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
                Search Ski Areas
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
            
            {skiAreas.length > 0 ? (
                skiAreas.map((skiArea, index) => {
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
              })
            ) : (
              <p className="text-center text-gray-500 mt-4">No ski areas found. Adjust filters and try again.</p>
            )}
          </>
        )}

        {/* TODO: Reusing a lot of code */}
        {viewMode === 'runs' && (
          <>
            <div className="flex flex-wrap mb-4 gap-2">
              {/* Country Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {runCountry || "All Countries"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setRunCountry("")}>
                    All Countries
                  </DropdownMenuItem>
                  {countries.map((country) => (
                    <DropdownMenuItem
                      key={country}
                      onSelect={() => setRunCountry(country)}
                    >
                      {country}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Region Dropdown */}
              {runCountry && runRegions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {runRegion || "All Regions"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setRunRegion("")}>All Regions</DropdownMenuItem>
                    {runRegions.map(r => (
                      <DropdownMenuItem key={r} onSelect={() => setRunRegion(r)}>
                        {r}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Dynamically populated ski area dropdown*/}
              {skiAreaNames.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {skiAreaNames.find(a => a.id === runSelectedSkiAreaId)?.name || "All Ski Areas"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setRunSelectedSkiAreaId("")}>All Ski Areas</DropdownMenuItem>
                    {skiAreaNames.map(a => (
                      <DropdownMenuItem key={a.id} onSelect={() => setRunSelectedSkiAreaId(a.id)}>
                        {a.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Sort By Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {runOrderByOptions.find(o => o.value === orderBy)?.label || "Sort By"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {runOrderByOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => {
                        setOrderBy(option.value);
                      }}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Order Dropdown */}
              {/*TODO: Custom run sort options */}
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
                    {limitOptions.find(o => o.value === runResultLimit)?.label || "Result Limit"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {limitOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setRunResultLimit(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* New row of run-specific filters */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input
                type="number"
                placeholder="Min Avg Pitch (°)"
                value={minAveragePitch}
                onChange={(e) => setMinAveragePitch(e.target.value)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Min Length (m)"
                value={minInclinedLength}
                onChange={(e) => setMinInclinedLength(e.target.value)}
                className="w-full"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {runColor ? `Color: ${runColor}` : "Select Color"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setRunColor("")}>All Colors</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setRunColor("green")}>Green</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setRunColor("blue")}>Blue</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setRunColor("red")}>Red</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setRunColor("black")}>Black</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setRunColor("grey")}>Grey</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setRunColor("orange")}>Orange</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button
                className="w-full"
                onClick={() => {
                  handleFetchRuns();
                }}
              >
                Search Runs
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  setRunCountry('');
                  setRunRegion('');
                  setRunDifficulty('');
                  setRunColor('');
                  setMinInclinedLength('');
                  setMinAveragePitch('');
                  setRunSelectedSkiAreaId('');
                  setOrderBy('');
                  setSortOrder('DESC');
                  setRunResultLimit('100');
                }}
              >
                Clear Filters
              </Button>
            </div>
            {runs.length > 0 ? (
              runs.map((run, index) => {
                const avgPitchDeg = run.averagePitch != null
                  ? (Math.atan(run.averagePitch) * 180 / Math.PI).toFixed(1)
                  : null;
                const maxPitchDeg = run.maxPitch != null
                  ? (Math.atan(run.maxPitch) * 180 / Math.PI).toFixed(1)
                  : null;

                // TODO: Reuse colors between areas and runs
                const colorMap = {
                  green: 'bg-green-500',
                  blue: 'bg-blue-500',
                  red: 'bg-red-500',
                  black: 'bg-black',
                  grey: 'bg-gray-500',
                  orange: 'bg-orange-500',
                };
                  
                return (
                  <Card
                    key={run.runId}
                    onClick={() => toggleExpand(index)}
                    className="mb-4 p-4 max-w-full md:max-w-5xl mx-auto bg-gray-100 cursor-pointer"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h2 className="text-xl font-bold">{run.primaryRunName || 'Unnamed Run'}</h2>
                        <p className="text-sm text-gray-600">{run.country}, {run.region}</p>
                        <p className="text-sm text-gray-600">{run.skiAreaName || '—'}</p>
                      </div>
                      <div className="text-center">
                        <p className="flex items-center justify-center">
                          {run.color && (
                            <span
                              className={`inline-block w-3 h-3 rounded-full mr-2 ${colorMap[run.color] || 'bg-gray-400'}`}
                            ></span>
                          )}
                          Color: {run.color ? run.color.charAt(0).toUpperCase() + run.color.slice(1) : '—'}
                        </p>
                        <p>Difficulty: {run.difficulty ? run.difficulty.charAt(0).toUpperCase() + run.difficulty.slice(1) : '—'}</p>
                        <p>Lit: {run.lit ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="text-right">
                        <p>Length: {run.inclinedLengthM != null ? Math.round(run.inclinedLengthM) : '—'} m</p>
                        <p>Avg Pitch: {avgPitchDeg ?? '—'}%</p>
                        <p>Max Pitch: {maxPitchDeg ?? '—'}%</p>
                      </div>
                    </div>

                    {/* Full-width single color bar */}
                    <div className="mt-2 h-4 rounded w-full overflow-hidden bg-gray-300">
                      {run.color && (
                        <div
                          className={`${colorMap[run.color] || 'bg-gray-400'} h-full`}
                          style={{ width: '100%' }}
                          title={run.color}
                        />
                      )}
                    </div>

                    {expandedIndex === index && (
                      <div className="mt-2 text-sm">
                        <h3 className="font-semibold mb-2">Additional Information</h3>
                        <p>Min Elevation: {run.minElevationM ?? '—'} m</p>
                        <p>Max Elevation: {run.maxElevationM ?? '—'} m</p>
                        <p>Convention: {run.difficultyConvention ?? '—'}</p>
                        <p>
                          Map: <a href={run.openSkiMap} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View on OpenSkiMap</a>
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })
            ) : (
              <p className="text-center text-gray-500 mt-4">No runs loaded. Adjust filters and try again.</p>
            )}
          </>
        )}
    </div>
  );
}

export default App;