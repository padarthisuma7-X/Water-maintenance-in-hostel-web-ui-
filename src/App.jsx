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
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

/**
 * Smart Hostel Water Manager
 * A mobile-first infrastructure tool for hostel water management.
 * Features:
 * - Real-time tank simulation
 * - Admin dashboard with pump controls
 * - Student status view (Abstracted)
 * - Anomaly & Leak detection alerts
 */

const App = () => {
  // --- CORE SYSTEM STATE ---
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [tankLevel, setTankLevel] = useState(72.4);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [autoCutoff, setAutoCutoff] = useState(true);
  const [nightLimit, setNightLimit] = useState(true);
  const [timeLimit, setTimeLimit] = useState(false);
  
  // --- UI STATE ---
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeNode, setActiveNode] = useState('Hostel-WL-01');
  const [unit, setUnit] = useState('Liters');
  const [threshold, setThreshold] = useState(20);
  const [notifications, setNotifications] = useState(true);

  // --- MOCK DATA ---
  const trendData = [
    { name: '12 AM', level: 40 }, { name: '4 AM', level: 35 },
    { name: '8 AM', level: 55 }, { name: '12 PM', level: 45 },
    { name: '4 PM', level: 75 }, { name: '8 PM', level: 60 },
    { name: 'NOW', level: Math.round(tankLevel) },
  ];

  // --- SIMULATION ENGINE ---
  useEffect(() => {
    const simulation = setInterval(() => {
      setTankLevel(prev => {
        const hour = new Date().getHours();
        
        // Safety Logic: Turn off pump if Night Limit (11PM-5AM) is active
        if (nightLimit && (hour >= 23 || hour < 5) && isPumpOn) {
          setIsPumpOn(false);
          return prev;
        }

        // Logic: Consumption vs Inflow
        let change = -0.08; // Base depletion rate
        if (isPumpOn) change += 0.65; // High-speed refill
        
        let next = prev + change;
        
        // Auto Cut-off Logic (Avoid overflow)
        if (autoCutoff && next >= 98 && isPumpOn) { 
          setIsPumpOn(false); 
          return 98.0; 
        }
        
        return Math.max(0, Math.min(100, next));
      });
    }, 1000);
    return () => clearInterval(simulation);
  }, [isPumpOn, autoCutoff, nightLimit]);

  // --- SUB-COMPONENTS ---

  const Dashboard = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 hide-scrollbar">
      {/* Primary Gauge Card */}
      <div className="bg-[#1a222d] rounded-[2.5rem] p-6 border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-800" strokeWidth="3" />
              <circle 
                cx="18" cy="18" r="16" fill="none" 
                className={`${tankLevel > threshold ? 'stroke-blue-500' : 'stroke-red-500'} transition-all duration-1000 ease-in-out`} 
                strokeWidth="3" 
                strokeDasharray={`${tankLevel}, 100`} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="flex flex-col items-center">
                <span className="text-white text-3xl font-black leading-none">{Math.round(tankLevel)}%</span>
                <span className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">CAPACITY</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 inline-flex items-center gap-1 ${tankLevel > threshold ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400 animate-pulse'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${tankLevel > threshold ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {tankLevel > threshold ? 'Stable Supply' : 'Critical Level'}
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Volume</p>
            <h2 className="text-white text-4xl font-black tracking-tighter">
                {unit === 'Liters' ? (Math.round(tankLevel * 200)) : Math.round(tankLevel)}
                <span className="text-slate-600 text-lg ml-1 font-bold">{unit === 'Liters' ? 'L' : '%'}</span>
            </h2>
          </div>
        </div>

        {/* Mini Trend Graph */}
        <div className="h-20 w-full mb-6 opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="level" stroke="#3b82f6" fill="url(#colorLevel)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-800/50 pt-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl"><Clock size={16} className="text-orange-400" /></div>
            <div>
              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-wider">Est. Runout</p>
              <p className="text-white text-sm font-black">~{(tankLevel * 0.15).toFixed(1)} Hrs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl"><TrendingDown size={16} className="text-blue-400" /></div>
            <div>
              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-wider">Consumption</p>
              <p className="text-white text-sm font-black">Moderate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Control */}
      <div className="space-y-3">
        <button 
          onClick={() => setIsPumpOn(!isPumpOn)}
          className={`group w-full p-6 rounded-[2rem] border transition-all active:scale-95 flex items-center justify-between ${isPumpOn ? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-[#1a222d] border-slate-800 hover:border-slate-700'}`}
        >
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl transition-colors ${isPumpOn ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
              <Zap size={24} className={isPumpOn ? 'text-white' : 'text-slate-500'} />
            </div>
            <div className="text-left">
              <p className="text-base font-black text-white leading-tight">MAIN PUMP: {isPumpOn ? 'ACTIVE' : 'READY'}</p>
              <p className={`text-[10px] mt-0.5 font-bold uppercase tracking-widest ${isPumpOn ? 'text-white/70' : 'text-slate-500'}`}>
                {isPumpOn ? 'Refilling at 0.65%/s' : 'Tap to initialize refill'}
              </p>
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 border-white/20 ${isPumpOn ? 'bg-white animate-ping' : 'bg-slate-700'}`} />
        </button>

        {/* Feature Switches */}
        <div className="bg-[#1a222d] p-5 rounded-[2rem] border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-800/50">
              <ShieldCheck size={20} className="text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white leading-tight">Smart Cut-off</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Auto-safety @ 98%</p>
            </div>
          </div>
          <button 
            onClick={() => setAutoCutoff(!autoCutoff)}
            className={`w-14 h-7 rounded-full relative transition-all duration-300 ${autoCutoff ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-lg transition-all duration-300 ${autoCutoff ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );

  const AlertCenter = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-end px-2 mb-2">
        <h2 className="text-white font-black text-2xl tracking-tighter">Incident Reports</h2>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">LIVE LOG</span>
      </div>

      <div className="bg-red-500/10 border border-red-500/30 rounded-[2rem] p-5 flex gap-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
        <div className="p-3 bg-red-500/20 rounded-2xl h-fit self-start"><AlertTriangle className="text-red-500" size={24} /></div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <p className="text-red-500 font-black text-[10px] uppercase tracking-widest">Critical Overflow</p>
            <span className="text-slate-500 font-mono text-[9px]">01:30 AM</span>
          </div>
          <p className="text-white text-sm font-semibold leading-relaxed">North Block Overhead Tank: Level hit 100%. Automatic safety shut-off engaged to prevent wastage.</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-[2rem] p-5 flex gap-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
        <div className="p-3 bg-amber-500/20 rounded-2xl h-fit self-start"><Activity className="text-amber-500" size={24} /></div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Anomaly Detection</p>
            <span className="text-slate-500 font-mono text-[9px]">04:12 AM</span>
          </div>
          <p className="text-white text-sm font-semibold leading-relaxed">Continuous outflow detected in South Block during curfew hours. Potential tap leak or pipe burst.</p>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-[2rem] p-5 flex gap-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
        <div className="p-3 bg-blue-500/20 rounded-2xl h-fit self-start"><FileText className="text-blue-500" size={24} /></div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest">Maintenance Ticket</p>
            <span className="text-slate-500 font-mono text-[9px]">SYSTEM GEN</span>
          </div>
          <p className="text-white text-sm font-semibold leading-relaxed">Pump B scheduled for filter cleaning. Efficiency dropped by 8% over the last 3 days.</p>
        </div>
      </div>
    </div>
  );

  const PumpLogic = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
      <div className="px-2">
        <h2 className="text-white font-black text-2xl tracking-tighter">Automation Rules</h2>
        <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wider">Infrastructure Logic v1.2</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1a222d] p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-blue-500/10"><Moon size={24} className="text-blue-400" /></div>
            <div>
              <p className="text-white font-black text-base leading-tight uppercase tracking-tighter">Night Lockout</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">11 PM - 5 AM curfew</p>
            </div>
          </div>
          <button 
            onClick={() => setNightLimit(!nightLimit)}
            className={`w-14 h-7 rounded-full relative transition-all duration-300 ${nightLimit ? 'bg-blue-500' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 ${nightLimit ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="bg-[#1a222d] p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-emerald-500/10"><Timer size={24} className="text-emerald-400" /></div>
            <div>
              <p className="text-white font-black text-base leading-tight uppercase tracking-tighter">Continuous Limit</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">30 MIN Max Runtime</p>
            </div>
          </div>
          <button 
            onClick={() => setTimeLimit(!timeLimit)}
            className={`w-14 h-7 rounded-full relative transition-all duration-300 ${timeLimit ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 ${timeLimit ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="bg-slate-800/20 p-6 rounded-[2rem] border border-dashed border-slate-700/50 flex flex-col items-center justify-center text-center">
            <Sliders size={32} className="text-slate-700 mb-2" />
            <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">Drag to add custom automation rule</p>
        </div>
      </div>
    </div>
  );

  const StudentView = () => (
    <div className={`flex-1 ${tankLevel > threshold ? 'bg-[#10b981]' : tankLevel > 10 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'} flex flex-col items-center justify-center p-8 space-y-12 transition-colors duration-1000 h-full overflow-hidden`}>
      <div className="bg-white/95 p-16 rounded-[5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative group active:scale-95 transition-transform">
        <Droplet size={120} className={`${tankLevel > threshold ? 'text-emerald-500' : tankLevel > 10 ? 'text-amber-500' : 'text-red-500'} fill-current`} />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9rem] select-none">
            {tankLevel > threshold ? '😊' : tankLevel > 10 ? '😐' : '☹️'}
        </div>
      </div>
      
      <div className="text-center text-white space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            WATER:<br/>
            {tankLevel > threshold ? 'GOOD' : tankLevel > 10 ? 'FAIR' : 'LOW'}
        </h1>
        <div className="space-y-2">
            <p className="text-xl font-black opacity-80 uppercase tracking-widest">{activeNode}</p>
            <div className="bg-black/20 backdrop-blur-md px-6 py-2 rounded-full inline-block text-xs font-black uppercase tracking-widest">
                {tankLevel > threshold ? 'Normal consumption allowed' : tankLevel > 10 ? 'Limited usage advised' : 'Emergency shortage expected'}
            </div>
        </div>
      </div>

      <button onClick={() => setActiveTab('dashboard')} className="absolute top-10 left-8 p-5 bg-black/20 hover:bg-black/30 rounded-3xl text-white backdrop-blur-xl active:scale-90 transition-all border border-white/10 shadow-xl">
        <ChevronLeft size={28} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center font-sans overflow-hidden select-none">
      {/* Container simulating a mobile phone frame */}
      <div className="w-full max-w-md h-screen flex flex-col bg-[#121820] relative shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x border-white/5">
        
        {activeTab !== 'student' && (
          <header className="p-4 pt-10 relative z-40 bg-[#121820]">
            <div className="flex justify-between items-center mb-6 px-2">
              <button onClick={() => setShowMenu(true)} className="text-slate-400 p-3 bg-slate-800/40 hover:bg-slate-800 rounded-2xl active:scale-90 transition-all border border-white/5">
                <Menu size={20}/>
              </button>
              <div className="flex flex-col items-center">
                <h1 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">{activeNode}</h1>
                <div className="flex gap-1 mt-1">
                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                </div>
              </div>
              <button onClick={() => setShowSettings(true)} className="text-slate-400 p-3 bg-slate-800/40 hover:bg-slate-800 rounded-2xl active:scale-90 transition-all border border-white/5">
                <Settings size={20}/>
              </button>
            </div>
            
            {/* Custom Tab Bar */}
            <div className="flex gap-1 bg-[#1a222d] p-1.5 rounded-[1.5rem] border border-slate-800/80 shadow-inner">
              {['dashboard', 'alerts', 'logic', 'student'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  {tab.replace('dashboard', 'Dash').replace('alerts', 'Alerts').replace('logic', 'Logic').replace('student', 'Student')}
                </button>
              ))}
            </div>
          </header>
        )}

        {/* View Routing */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'alerts' && <AlertCenter />}
            {activeTab === 'logic' && <PumpLogic />}
            {activeTab === 'student' && <StudentView />}
        </div>

        {/* --- OVERLAYS --- */}

        {/* Settings Panel */}
        <div className={`absolute inset-0 z-[100] transition-all duration-500 pointer-events-none ${showSettings ? 'pointer-events-auto' : ''}`}>
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${showSettings ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowSettings(false)} />
            <div className={`absolute bottom-0 inset-x-0 bg-[#1a222d] rounded-t-[3.5rem] p-10 space-y-8 transition-transform duration-500 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] ${showSettings ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-white font-black text-2xl tracking-tight">Preferences</h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Configuration v2.4</p>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="text-slate-400 p-3 bg-slate-800/50 rounded-full hover:bg-slate-800 transition-colors">
                        <X size={24}/>
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div className="bg-slate-800/30 p-5 rounded-3xl flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl"><Database size={20} className="text-blue-400" /></div>
                            <span className="text-white text-sm font-black uppercase tracking-wider">Metrics Unit</span>
                        </div>
                        <select 
                            value={unit} 
                            onChange={(e) => setUnit(e.target.value)}
                            className="bg-slate-800 text-white text-xs font-black rounded-xl px-4 py-2 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option>Liters</option>
                            <option>Percentage</option>
                        </select>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-3xl space-y-4 border border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 rounded-2xl"><AlertTriangle size={20} className="text-red-400" /></div>
                                <span className="text-white text-sm font-black uppercase tracking-wider">Alert Threshold</span>
                            </div>
                            <span className="text-red-400 font-mono font-black text-sm">{threshold}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" max="40" 
                            value={threshold} 
                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-3xl flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl"><Volume2 size={20} className="text-emerald-400" /></div>
                            <span className="text-white text-sm font-black uppercase tracking-wider">Push Alerts</span>
                        </div>
                        <button 
                            onClick={() => setNotifications(!notifications)}
                            className={`w-14 h-7 rounded-full relative transition-all duration-300 ${notifications ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 ${notifications ? 'translate-x-8' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Node Side Menu */}
        <div className={`absolute inset-0 z-[110] transition-all duration-300 ${showMenu ? 'visible' : 'invisible'}`}>
          <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${showMenu ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMenu(false)} />
          <div className={`absolute inset-y-0 left-0 w-[85%] bg-[#1a222d] transition-transform duration-500 ease-out shadow-2xl p-10 flex flex-col ${showMenu ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic">SH</div>
                 <h2 className="text-white font-black text-xl tracking-tighter">SmartHostel</h2>
              </div>
              <button onClick={() => setShowMenu(false)} className="text-slate-500 p-2 hover:bg-slate-800 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-2">Managed Units</p>
            <div className="space-y-3 flex-1">
               {['Hostel-WL-01', 'Hostel-WL-02', 'Staff-QT-A', 'Canteen-S1'].map(node => (
                 <button 
                  key={node}
                  onClick={() => { setActiveNode(node); setShowMenu(false); }}
                  className={`w-full p-5 rounded-[2rem] flex items-center justify-between transition-all group ${activeNode === node ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800'}`}
                 >
                   <div className="flex items-center gap-4">
                        <Smartphone size={18} className={activeNode === node ? 'text-white' : 'text-slate-600'} />
                        <span className="font-black text-xs uppercase tracking-widest">{node}</span>
                   </div>
                   {activeNode === node ? <CheckCircle2 size={18} /> : <ChevronRight size={18} className="opacity-20 group-hover:opacity-100" />}
                 </button>
               ))}
            </div>

            <div className="mt-auto pt-10 flex flex-col gap-2">
                <button className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors py-2 px-2">
                    <Smartphone size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Connect New Node</span>
                </button>
                <div className="h-[1px] bg-slate-800 w-full my-4" />
                <p className="text-slate-700 text-[8px] font-bold uppercase tracking-[0.3em] text-center">Infrastructure OS v4.2.1</p>
            </div>
          </div>
        </div>

        {/* Footer info (Desktop/Admin only) */}
        {activeTab !== 'student' && (
          <div className="absolute bottom-6 left-0 right-0 px-10 flex justify-between items-center opacity-40 pointer-events-none select-none z-10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Secure Cloud Sync</span>
            </div>
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Encrypted</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;


