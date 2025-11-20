import { useState, useEffect } from 'react';
import { login, fetchOpportunities } from './services/Api';
import { processDashboardData } from './utils/Utils'; 
import HeatmapWidget from './components/HeatmapWidget';
import BarChartWidget from './components/BarChartWidget';
import DonutChartWidget from './components/DonutChartWidget';
import KpiCard from './components/KpiCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import mockData from './mockdata.json';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!email || !password) {
        setError('Email and password are required.');
        return;
      }
      const tokenResp = await login(email, password);
      if (typeof tokenResp === 'string' && tokenResp.length > 0) {
        setToken(tokenResp);
      } else {
        setError('Login succeeded but no token returned. Using dev mode.');
        setToken('mock-token-123');
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setToken('mock-token-123');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Data when Token is present
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (token === 'mock-token-123') {
          const dashboardData = processDashboardData(mockData);
          setData(dashboardData);
          return;
        }
        const rawData = await fetchOpportunities(token);
        const dashboardData = processDashboardData(rawData);
        setData(dashboardData);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          setError('Session expired or invalid token. Using mock data.');
          setToken('mock-token-123');
          const dashboardData = processDashboardData(mockData);
          setData(dashboardData);
          return;
        }
        const dashboardData = processDashboardData(mockData);
        setData(dashboardData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // --- RENDER: Login Screen ---
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dashboard-dark p-4">
        <Card className="w-full max-w-md bg-dashboard-card border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-center text-dashboard-accent">CRM Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-dashboard-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-dashboard-accent"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-dashboard-accent hover:bg-orange-700 text-white">
                {loading ? 'Logging in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return <div className="min-h-screen bg-dashboard-dark flex items-center justify-center text-white">Loading Dashboard...</div>;
  }

  // --- RENDER: Dashboard ---
  return (
    <div className="min-h-screen bg-dashboard-dark p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Opportunity Heatmap</h1>
            <p className="text-sm text-dashboard-text mt-1">Visual breakdown of opportunities by time, source, stage, and score.</p>
          </div>
          <Button variant="outline" onClick={() => setToken(null)} className="border-zinc-700 text-zinc-400 hover:text-white">Logout</Button>
        </div>

        {/* 1. KPI Row [cite: 23-26] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard title="Total Opportunities" value={data.kpi.total} />
          <KpiCard title="Avg Score" value={data.kpi.avgScore} />
          <KpiCard title="Conversion Rate" value={`${data.kpi.conversionRate}%`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <HeatmapWidget data={data.heatmap} />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="h-64">
              <BarChartWidget data={data.sources} title="Opportunities by Source" />
            </div>
            <div className="h-64">
              <BarChartWidget data={data.stages} title="Opportunities by Stage" showPercentage={true} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <BarChartWidget data={data.categories} title="Opportunities by Category" />
          </div>
          <div className="lg:col-span-3">
            <BarChartWidget data={data.stagesCounts} title="Opportunities by Stage" />
          </div>
          <div className="lg:col-span-2">
            <DonutChartWidget data={data.scoreDistribution} title="Opportunity Score Distribution" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;