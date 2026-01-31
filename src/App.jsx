import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  AlertTriangle, 
  Settings, 
  Zap, 
  Menu,
  ChevronLeft,
  Bell,
  Clock,
  TrendingDown,
  ShieldCheck,
  Activity,
  X,
  CheckCircle2,
  Moon,
  Timer,
  FileText,
  Sliders,
  Volume2,
  Database,
  Smartphone
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const App = () => {
  // --- CORE STATE ---
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [tankLevel, setTankLevel] = useState(72.4);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [autoCutoff, setAutoCutoff] = useState(true);
  const [nightLimit, setNightLimit] = useState(true);
  const [timeLimit, setTimeLimit] = useState(false);
  
  // --- UI OVERLAYS STATE ---
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeNode, setActiveNode] = useState('Hostel-WL-01');

  // --- SETTINGS STATE ---
  const [unit, setUnit] = useState('Liters');
  const [threshold, setThreshold] = useState(20);
  const [notifications, setNotifications] = useState(true);

  // --- MOCK DATA ---
  const trendData = [
    { name: '12 AM', level: 40 }, { name: '4 AM', level: 35 },
    { name: '8 AM', level: 55 }, { name: '12 PM', level: 45 },
    { name: '4 PM', level: 75 }, { name: '8 PM', level: 60 },
  ];

  // --- SIMULATION LOGIC ---
  useEffect(() => {
    const simulation = setInterval(() => {
      setTankLevel(prev => {
        const h = new Date().getHours();
        
        // Safety: Turn off pump if Night Limit is active
        if (nightLimit && (h >= 23 || h < 5) && isPumpOn) {
          setIsPumpOn(false);
          return prev;
        }

        let change = -0.05; // Natural depletion
        if (isPumpOn) change += 0.55; // Filling speed
        
        let next = prev + change;
        
        // Auto Cut-off Logic
        if (autoCutoff && next >= 95 && isPumpOn) { 
          setIsPumpOn(false); 
          return 95.0; 
        }
        
        return Math.max(0, Math.min(100, next));
      });
    }, 1000);
    return () => clearInterval(simulation);
  }, [isPumpOn, autoCutoff, nightLimit]);

  // --- VIEWS ---
  const Dashboard = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
      {/* Main Gauge Card */}
      <div className="bg-[#1a222d] rounded-[2.5rem] p-6 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-800" strokeWidth="3" />
              <circle 
                cx="18" cy="18" r="16" fill="none" 
                className="stroke-blue-500 transition-all duration-1000" 
                strokeWidth="3" 
                strokeDasharray={`${tankLevel}, 100`} 
                strokeLinecap="round" 
              />
            </svg>
            <span className="text-white text-3xl font-black">{Math.round(tankLevel)}%</span>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-2 inline-block ${tankLevel > threshold ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
              {tankLevel > threshold ? 'Normal' : 'Critical'}
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Current Volume</p>
            <h2 className="text-white text-4xl font-black">{Math.round(tankLevel * 10)} {unit === 'Liters' ? 'L' : '%'}</h2>
          </div>
        </div>

        <div className="h-24 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <Area type="monotone" dataKey="level" stroke="#3b82f6" fill="#3b82f633" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-orange-400" />
            <div>
              <p className="text-slate-500 text-[8px] font-bold uppercase">Est. Depletion</p>
              <p className="text-white text-sm font-bold">12.1 Hrs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingDown size={16} className="text-blue-400" />
            <div>
              <p className="text-slate-500 text-[8px] font-bold uppercase">Demand Level</p>
              <p className="text-white text-sm font-bold">Moderate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="space-y-3">
        <button 
          onClick={() => setIsPumpOn(!isPumpOn)}
          className={`w-full p-5 rounded-3xl border flex items-center justify-between transition-all active:scale-95 ${isPumpOn ? 'bg-blue-600 border-blue-400' : 'bg-[#1a222d] border-slate-800'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isPumpOn ? 'bg-white/20' : 'bg-slate-800'}`}>
              <Zap size={20} className={isPumpOn ? 'text-white' : 'text-slate-500'} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">PUMP IS {isPumpOn ? 'RUNNING' : 'OFFLINE'}</p>
              <p className={`text-[10px] ${isPumpOn ? 'text-white/70' : 'text-slate-500'}`}>Tap to {isPumpOn ? 'Stop' : 'Start'} Manual Refill</p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isPumpOn ? 'bg-white animate-pulse' : 'bg-slate-700'}`} />
        </button>

        <div className="bg-[#1a222d] p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-slate-800">
              <ShieldCheck size={20} className="text-slate-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Smart Cut-off</p>
              <p className="text-[10px] text-slate-500">Safety stop at 95% capacity</p>
            </div>
          </div>
          <button 
            onClick={() => setAutoCutoff(!autoCutoff)}
            className={`w-12 h-6 rounded-full relative transition-all ${autoCutoff ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${autoCutoff ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );

  const AlertCenter = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 animate-in slide-in-from-right duration-300">
      <h2 className="text-white font-black text-xl px-2">Alerts & Anomalies</h2>
      <div className="bg-red-600/20 border border-red-500/50 rounded-3xl p-5 flex gap-4">
        <AlertTriangle className="text-red-500 shrink-0" size={24} />
        <div>
          <p className="text-red-500 font-bold text-xs uppercase">Overflow Alert</p>
          <p className="text-white text-sm mt-1">North Block Tank: Auto shut-off engaged.</p>
        </div>
      </div>
      <div className="bg-orange-500/20 border border-orange-500/50 rounded-3xl p-5 flex gap-4">
        <Activity className="text-orange-500 shrink-0" size={24} />
        <div>
          <p className="text-orange-500 font-bold text-xs uppercase">Anomaly Detected</p>
          <p className="text-white text-sm mt-1">Sudden drop in South Block. Possible leak.</p>
        </div>
      </div>
    </div>
  );

  const PumpLogic = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
      <h2 className="text-white font-black text-xl px-2">Pump Control Logic</h2>
      <div className="space-y-4">
        <div className="bg-[#1a222d] p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Moon size={20} className="text-blue-400" />
            <div>
              <p className="text-white font-bold text-sm">Night Limit</p>
              <p className="text-slate-500 text-[10px]">11 PM - 5 AM</p>
            </div>
          </div>
          <button 
            onClick={() => setNightLimit(!nightLimit)}
            className={`w-12 h-6 rounded-full relative transition-all ${nightLimit ? 'bg-blue-500' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${nightLimit ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="bg-[#1a222d] p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Timer size={20} className="text-emerald-400" />
            <div>
              <p className="text-white font-bold text-sm">Time-Based Limit</p>
              <p className="text-slate-500 text-[10px]">Max continuous: 30 min</p>
            </div>
          </div>
          <button 
            onClick={() => setTimeLimit(!timeLimit)}
            className={`w-12 h-6 rounded-full relative transition-all ${timeLimit ? 'bg-blue-500' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${timeLimit ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );

  const StudentView = () => (
    <div className={`flex-1 ${tankLevel > threshold ? 'bg-[#10b981]' : tankLevel > 10 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'} flex flex-col items-center justify-center p-8 space-y-12 transition-colors duration-1000 relative h-full`}>
      <div className="bg-white/95 p-12 rounded-[4rem] shadow-2xl relative">
        <Droplet size={140} className={`${tankLevel > threshold ? 'text-emerald-500' : tankLevel > 10 ? 'text-amber-500' : 'text-red-500'} fill-current`} />
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-8xl">{tankLevel > threshold ? '😊' : tankLevel > 10 ? '😐' : '☹️'}</div>
      </div>
      <div className="text-center text-white space-y-4">
        <h1 className="text-5xl font-black uppercase leading-tight">Water Status:<br/>{tankLevel > threshold ? 'Sufficient' : tankLevel > 10 ? 'Limited' : 'Critical'}</h1>
        <p className="text-xl font-bold opacity-90 max-w-xs mx-auto">Update for {activeNode}</p>
      </div>
      <button onClick={() => setActiveTab('dashboard')} className="absolute top-8 left-8 p-4 bg-black/20 rounded-2xl text-white backdrop-blur-md active:scale-90"><ChevronLeft size={24} /></button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex justify-center font-sans overflow-hidden">
      <div className="w-full max-w-md h-screen flex flex-col bg-[#121820] relative shadow-2xl">
        {activeTab !== 'student' && (
          <header className="p-4 pt-10">
            <div className="flex justify-between items-center mb-6 px-2">
              <button onClick={() => setShowMenu(true)} className="text-slate-400 p-2 bg-slate-800/40 rounded-xl active:scale-90 transition-transform"><Menu size={20}/></button>
              <h1 className="text-white font-black uppercase text-xs tracking-[0.2em]">{activeNode}</h1>
              <button onClick={() => setShowSettings(true)} className="text-slate-400 p-2 bg-slate-800/40 rounded-xl active:scale-90 transition-transform"><Settings size={20}/></button>
            </div>
            <div className="flex gap-2 bg-[#1a222d] p-1 rounded-2xl border border-slate-800">
              {['dashboard', 'alerts', 'logic', 'student'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  {tab.replace('dashboard', 'Dash').replace('alerts', 'Alerts').replace('logic', 'Logic').replace('student', 'View')}
                </button>
              ))}
            </div>
          </header>
        )}

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'alerts' && <AlertCenter />}
        {activeTab === 'logic' && <PumpLogic />}
        {activeTab === 'student' && <StudentView />}

        {/* --- SETTINGS SLIDE-UP OVERLAY --- */}
        <div className={`absolute inset-0 z-[150] transition-all duration-500 ${showSettings ? 'visible' : 'invisible'}`}>
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${showSettings ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowSettings(false)} />
            <div className={`absolute bottom-0 inset-x-0 bg-[#1a222d] rounded-t-[3rem] p-8 space-y-6 transition-transform duration-500 ${showSettings ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-white font-black text-xl">System Settings</h2>
                    <button onClick={() => setShowSettings(false)} className="text-slate-500 p-2 bg-slate-800/50 rounded-full"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-slate-800/30 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Database size={18} className="text-blue-400" />
                            <span className="text-white text-sm font-bold">Display Unit</span>
                        </div>
                        <select 
                            value={unit} 
                            onChange={(e) => setUnit(e.target.value)}
                            className="bg-slate-800 text-white text-xs font-bold rounded-lg px-2 py-1 outline-none"
                        >
                            <option>Liters</option>
                            <option>Percentage</option>
                        </select>
                    </div>

                    <div className="bg-slate-800/30 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertTriangle size={18} className="text-red-400" />
                                <span className="text-white text-sm font-bold">Critical Threshold</span>
                            </div>
                            <span className="text-white text-xs font-black">{threshold}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" max="40" 
                            value={threshold} 
                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    <div className="bg-slate-800/30 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Volume2 size={18} className="text-emerald-400" />
                            <span className="text-white text-sm font-bold">Alert Notifications</span>
                        </div>
                        <button 
                            onClick={() => setNotifications(!notifications)}
                            className={`w-10 h-5 rounded-full relative transition-all ${notifications ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
                
                <div className="pt-4 text-center">
                    <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">v2.4.1 Build 2024</p>
                </div>
            </div>
        </div>

        {/* --- NODE MENU --- */}
        <div className={`absolute inset-0 z-[100] ${showMenu ? 'visible' : 'invisible'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMenu(false)} />
          <div className={`absolute inset-y-0 left-0 w-3/4 bg-[#1a222d] transition-transform duration-300 ${showMenu ? 'translate-x-0' : '-translate-x-full'} p-8`}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-white font-black text-xl">Active Nodes</h2>
              <button onClick={() => setShowMenu(false)} className="text-slate-500"><X /></button>
            </div>
            <div className="space-y-4">
               {['Hostel-WL-01', 'Hostel-WL-02', 'Staff-QT-A'].map(node => (
                 <button 
                  key={node}
                  onClick={() => { setActiveNode(node); setShowMenu(false); }}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between ${activeNode === node ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                 >
                   <span className="font-bold text-xs uppercase">{node}</span>
                   {activeNode === node && <CheckCircle2 size={16} />}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {activeTab !== 'student' && (
          <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-between items-center opacity-50 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">System Online</span>
            </div>
            <span className="text-[9px] font-black text-white uppercase tracking-widest">AES-256 encrypted</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;


