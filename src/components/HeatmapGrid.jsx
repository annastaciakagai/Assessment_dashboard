export default function HeatmapGrid({ byHour }) {
  // byHour: array length 24
  return (
    <div className="grid grid-cols-6 gap-1">
      {byHour.map((v, i) => {
        // normalize value to 0-100 for intensity
        const intensity = Math.min(100, Math.round((v / (Math.max(...byHour) || 1)) * 100));
        // tailwind inline styling for background opacity
        const style = { backgroundColor: `rgba(255,99,71,${0.1 + intensity/120})` };
        return (
          <div key={i} className="p-2 rounded" style={style}>
            <div className="text-xs">{i}:00</div>
            <div className="font-bold">{v}</div>
          </div>
        );
      })}
    </div>
  );
}
