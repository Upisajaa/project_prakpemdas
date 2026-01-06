
import React, { useState, useEffect } from 'react';
import { SensorData, PlantProfile } from './types';
import Dashboard from './components/Dashboard';
import HistoryView from './components/HistoryView';
import PlantSetup from './components/PlantSetup';
import AIAdvisor from './components/AIAdvisor';

const MOCK_PLANT: PlantProfile = {
  id: 'p1',
  name: 'Monstera Deliciosa',
  species: 'Monstera',
  idealTemp: [18, 30],
  idealHumidity: [60, 80],
  idealSoilMoisture: [40, 70],
  image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'ai' | 'setup'>('dashboard');
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [manualPump, setManualPump] = useState(false);
  const [manualLight, setManualLight] = useState(false);

  useEffect(() => {
    const generateData = () => {
      setCurrentData(prev => {
        const soilMoisture = prev ? (prev.pumpStatus ? Math.min(100, prev.soilMoisture + 5) : Math.max(0, prev.soilMoisture - 0.5)) : 45;
        const temperature = 24 + Math.random() * 5;
        const humidity = 65 + Math.random() * 10;
        
        // Auto Logic Simulation
        const autoPump = isAutoMode ? (soilMoisture < MOCK_PLANT.idealSoilMoisture[0]) : manualPump;
        const autoLight = isAutoMode ? (new Date().getHours() > 18 || new Date().getHours() < 6) : manualLight;

        const newData: SensorData = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          temperature,
          humidity,
          soilMoisture,
          pumpStatus: autoPump,
          lightStatus: autoLight,
          isAutoMode,
          plantId: 'p1'
        };
        
        setHistory(h => [newData, ...h].slice(0, 50));
        return newData;
      });
    };

    generateData();
    const interval = setInterval(generateData, 5000); // Update faster for demo (5s)
    return () => clearInterval(interval);
  }, [isAutoMode, manualPump, manualLight]);

  const togglePump = () => {
    if (!isAutoMode) setManualPump(!manualPump);
  };

  const toggleLight = () => {
    if (!isAutoMode) setManualLight(!manualLight);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <nav className="w-full md:w-64 bg-emerald-900 text-white flex md:flex-col shadow-xl z-10">
        <div className="p-6 text-2xl font-bold flex items-center gap-3">
          <i className="fas fa-leaf text-emerald-300"></i>
          <span>FloraGuard</span>
        </div>
        
        <div className="flex-1 flex md:flex-col overflow-x-auto md:overflow-y-auto">
          {[
            { id: 'dashboard', icon: 'fa-gauge', label: 'Dashboard' },
            { id: 'history', icon: 'fa-chart-line', label: 'History' },
            { id: 'ai', icon: 'fa-robot', label: 'AI Advisor' },
            { id: 'setup', icon: 'fa-cog', label: 'Pi Setup' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-4 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-emerald-700 border-l-4 border-emerald-300' : 'hover:bg-emerald-700/50'
              }`}
            >
              <i className={`fas ${tab.icon} w-5`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Smart Control</h1>
            <p className="text-slate-500">Node: Raspberry Pi 4 - Active Telemetry</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">
              <span className="text-xs font-bold text-slate-400 uppercase">Auto Mode</span>
              <button 
                onClick={() => setIsAutoMode(!isAutoMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isAutoMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoMode ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">Online</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <Dashboard 
            data={currentData} 
            plant={MOCK_PLANT} 
            onTogglePump={togglePump}
            onToggleLight={toggleLight}
          />
        )}
        {activeTab === 'history' && <HistoryView history={history} />}
        {activeTab === 'ai' && <AIAdvisor latestData={currentData} plant={MOCK_PLANT} />}
        {activeTab === 'setup' && <PlantSetup />}
      </main>
    </div>
  );
};

export default App;
