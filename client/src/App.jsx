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
            {expandedIndex === index && (
              <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                <p><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>Green: {skiArea.greenCount ?? 0}</p>
                <p><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>Blue: {skiArea.blueCount ?? 0}</p>
                <p><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>Red: {skiArea.redCount ?? 0}</p>
                <p><span className="inline-block w-3 h-3 rounded-full bg-black mr-2"></span>Black: {skiArea.blackCount ?? 0}</p>
                <p><span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>Orange: {skiArea.orangeCount ?? 0}</p>
                <p><span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>Grey: {skiArea.greyCount ?? 0}</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default App