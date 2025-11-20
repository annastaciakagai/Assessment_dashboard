import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KpiCard = ({ title, value, subtext, compact = false }) => (
  <Card className={`bg-dashboard-card border-zinc-800 text-white ${compact ? 'px-3 py-2' : ''}`}>
    <CardHeader className={`${compact ? 'p-3 pb-1' : 'pb-2'}`}>
      <CardTitle className={`${compact ? 'text-xs font-medium text-dashboard-text uppercase tracking-wider' : 'text-sm font-medium text-dashboard-text uppercase tracking-wider'}`}>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className={`${compact ? 'p-3 pt-0' : ''}`}>
      <div className={`${compact ? 'text-3xl' : 'text-2xl'} font-bold text-white`}>{value}</div>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </CardContent>
  </Card>
);

export default KpiCard;