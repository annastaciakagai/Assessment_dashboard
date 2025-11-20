import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HeatmapWidget = ({ data }) => {
  // Helper to determine color intensity based on count
  const getColor = (count) => {
    if (count === 0) return 'bg-zinc-800'; // Empty
    if (count < 3) return 'bg-orange-900'; // Low
    if (count < 6) return 'bg-orange-700'; // Medium
    return 'bg-orange-500';                // High 
  };

  return (
    <Card className="bg-dashboard-card border-zinc-800 text-white">
      <CardHeader>
        <CardTitle>Opportunities by Hour</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
           {/* Render Rows (Hours could be condensed, but here is a simple view) */}
           {/* For simplicity, we transpose: Columns = Days, Rows = Hours */}
           <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-400">
              {data.map(d => <div key={d.day} className="text-center">{d.day}</div>)}
           </div>
           
           {/* Grid Body: 24 rows is too tall, let's group into 6 blocks of 4 hours like the image implies */}
           <div className="grid grid-cols-7 gap-1 h-64">
              {data.map((dayData) => (
                <div key={dayData.day} className="flex flex-col gap-1 h-full">
                  {dayData.hours.map((count, hIndex) => (
                    <div 
                      key={hIndex} 
                      className={`flex-1 rounded-sm ${getColor(count)} hover:opacity-80 transition-opacity`}
                      title={`${dayData.day} @ ${hIndex}:00 - ${count} opps`}
                    />
                  ))}
                </div>
              ))}
           </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapWidget;