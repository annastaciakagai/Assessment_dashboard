import { useState, useEffect } from 'react';
import { login, fetchOpportunities } from './services/Api';
import { processDashboardData } from './utils/Utils'; 
import HeatmapWidget from './components/HeatmapWidget';
import BarChartWidget from './components/BarChartWidget';
import DonutChartWidget from './components/DonutChartWidget';
import KpiCard from './components/KpiCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          const resp = await fetch('/mockdata.json');
          const json = await resp.json();
          setData(processDashboardData(json));
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
          const resp = await fetch('/mockdata.json');
          const json = await resp.json();
          setData(processDashboardData(json));
          return;
        }
        try {
          const resp = await fetch('/mockdata.json');
          const json = await resp.json();
          setData(processDashboardData(json));
        } catch (e) {
          setError('Mock data not found. Add public/mockdata.local.json', e);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // --- RENDER: Login Screen ---
  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-dashboard-dark p-6">
        <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(600px 300px at 20% 20%, rgba(234,88,12,0.08), transparent), radial-gradient(600px 300px at 80% 80%, rgba(234,88,12,0.06), transparent)"}} />
        <Card className="w-full max-w-md bg-dashboard-card border-zinc-800 text-white shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-dashboard-accent/20 flex items-center justify-center">
              <Lock className="h-5 w-5 text-dashboard-accent" />
            </div>
            <CardTitle className="text-dashboard-accent">CRM Login</CardTitle>
            <p className="text-xs text-dashboard-text">Sign in to continue to your dashboard.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 h-10 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-dashboard-accent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 h-10 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-dashboard-accent"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <div className="rounded-md bg-red-500/10 border border-red-500/30 p-2 text-xs text-red-400">{error}</div>}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" className="h-3 w-3 rounded border-zinc-700 bg-zinc-900" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="text-dashboard-accent hover:underline">Forgot password?</a>
              </div>
              <Button type="submit" className="w-full bg-dashboard-accent hover:bg-orange-700 text-white h-10">{loading ? 'Logging in...' : 'Sign In'}</Button>
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
          <div className="flex items-start gap-2">
            <div className="grid grid-cols-3 gap-4 w-[420px]">
              <KpiCard compact title="Total" value={data.kpi.total} />
              <KpiCard compact title="Avg score" value={data.kpi.avgScore} />
              <KpiCard compact title="Conversion" value={`${data.kpi.conversionRate}%`} />
            </div>
            <Button variant="outline" onClick={() => setToken(null)} className="border-zinc-700 text-zinc-400 hover:text-white">Logout</Button>
          </div>
        </div>

        {/* Main charts */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <HeatmapWidget data={data.heatmap} />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="h-80">
              <BarChartWidget data={data.sources} title="Opportunities by Source" />
            </div>
            <div className="h-70">
              <BarChartWidget data={data.stages} title="Opportunities by Stage" showPercentage={true} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <BarChartWidget data={data.categories} title="Opportunities by Category" />
          </div>
          {/* <div className="lg:col-span-3">
            <BarChartWidget data={data.stagesCounts} title="Opportunities by Stage" />
          </div> */}
          <div className="lg:col-span-5">
            <DonutChartWidget data={data.scoreDistribution} title="Opportunity Score Distribution" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
