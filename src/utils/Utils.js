export const processDashboardData = (data) => {
  if (!data || !Array.isArray(data)) return null;

  return {
    kpi: calculateKPIs(data),
    heatmap: generateHeatmapData(data),
    sources: groupByField(data, 'source') || groupByField(data, 'type'),
    categories: groupByField(data, 'type'),
    stages: calculateStatusPercentages(data),
    stagesCounts: groupByField(data, 'status'),
    scoreDistribution: calculateScoreDistribution(data),
  };
};

// 1. KPI Logic
const calculateKPIs = (data) => {
  const total = data.length;
  
  const totalScore = data.reduce((sum, item) => sum + deriveScore(item), 0);
  
  return {
    total,
    avgScore: total > 0 ? Math.round(totalScore / total) : 0,
    
    conversionRate: total > 0 
      ? Math.round((data.filter(i => ['closed','won','qualified'].includes(i.status)).length / total) * 100) 
      : 0
};
};

// 2. Heatmap Logic (Day x Hour)
const generateHeatmapData = (data) => {
  // Initialize 7 days x 24 hours grid
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const grid = days.map(day => ({
    day,
    hours: Array(24).fill(0)
  }));

  data.forEach(item => {
    // CORRECTION: Confirmed 'createdAt' exists in your JSON.
    if (!item.createdAt) return;
    
    const date = new Date(item.createdAt);
    
    // Adjust getDay() (0=Sun) to match our array (0=Mon)
    let dayIndex = date.getDay() - 1; 
    if (dayIndex === -1) dayIndex = 6; // Move Sunday to end

    const hour = date.getHours();
    
    if (grid[dayIndex]) {
        grid[dayIndex].hours[hour]++;
    }
  });

  return grid;
};

// 3. General Grouping Helper
const groupByField = (data, field) => {
  const counts = data.reduce((acc, item) => {
    const key = item[field] || 'Unknown'; 
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Return array format for Recharts
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const calculateStatusPercentages = (data) => {
  const total = data.length;
  if (total === 0) return [];

  const counts = data.reduce((acc, item) => {
    const statusLabel = item.status || 'Unknown';
    acc[statusLabel] = (acc[statusLabel] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({
    name, // This will be "qualified", etc.
    value,
    percentage: Math.round((value / total) * 100)
  })).sort((a, b) => b.value - a.value);
};

const deriveScore = (item) => {
  const map = {
    new: 30,
    contact: 40,
    prospecting: 55,
    qualified: 70,
    closed: 90,
  };
  return map[item.status] ?? 50;
};

const calculateScoreDistribution = (data) => {
  const buckets = [
    { name: '0-25', value: 0 },
    { name: '26-50', value: 0 },
    { name: '51-75', value: 0 },
    { name: '76-100', value: 0 },
  ];

  data.forEach((item) => {
    const score = deriveScore(item);
    if (score <= 25) buckets[0].value++;
    else if (score <= 50) buckets[1].value++;
    else if (score <= 75) buckets[2].value++;
    else buckets[3].value++;
  });

  return buckets;
};