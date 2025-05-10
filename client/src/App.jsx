import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function App() {
  const [skiAreas, setSkiAreas] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleFetchSkiAreas = async () => {
    try {
      const res = await fetch('/api/ski-areas?region=Montana');
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
      <h1 className="text-3xl font-bold mb-6 text-center">Slope Search 🏔️</h1>
      <Button onClick={handleFetchSkiAreas} className="mb-6">Load Ski Areas</Button>

      {skiAreas.map((skiArea, index) => {
        const degrees = skiArea.maxAverageRunPitch
          ? Math.atan(skiArea.maxAverageRunPitch) * (180 / Math.PI)
          : null;

        const colors = [
          { label: 'Green', color: 'bg-green-500', count: skiArea.greenCount },
          { label: 'Blue', color: 'bg-blue-500', count: skiArea.blueCount },
          { label: 'Black', color: 'bg-black', count: skiArea.blackCount },
          { label: 'Red', color: 'bg-red-500', count: skiArea.redCount },
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