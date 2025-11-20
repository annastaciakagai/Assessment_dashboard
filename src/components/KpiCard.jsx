import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KpiCard = ({ title, value, subtext }) => (
  <Card className="bg-dashboard-card border-zinc-800 text-white">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-dashboard-text uppercase tracking-wider">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </CardContent>
  </Card>
);

export default KpiCard;