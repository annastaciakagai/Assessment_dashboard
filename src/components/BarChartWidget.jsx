import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const BarChartWidget = ({ data, title, showPercentage = false }) => {
  return (
    <Card className="bg-dashboard-card border-zinc-800 text-white h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              axisLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#181b21', borderColor: '#3f3f46' }}
            />
            <Bar dataKey={showPercentage ? "percentage" : "value"} radius={[0, 4, 4, 0]} barSize={20}>
               {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#ea580c" />
               ))}
               {showPercentage ? (
                 <LabelList dataKey="percentage" position="right" formatter={(v) => `${v}%`} fill="#9ca3af" />
               ) : (
                 <LabelList dataKey="value" position="right" fill="#9ca3af" />
               )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartWidget;