import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplet, 
  AlertTriangle, 
  Settings, 
  Zap, 
  Menu,
  ChevronRight,
  Bell,
  Info,
  Clock,
  TrendingDown,
  ChevronLeft,
  ShieldCheck,
  History,
  Activity,
  X,
  User,
  Database,
  Radio,
  Sliders,
  LogOut,
  Building,
  CheckCircle2,
  RefreshCcw,
  Waves
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const App = () => {
  // --- CORE STATE ---
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [tankLevel, setTankLevel] = useState(72.4);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [autoCutoff, setAutoCutoff] = useState(true);
  
  // --- UI OVERLAYS STATE ---
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeNode, setActiveNode] = useState('Hostel Node Alpha-01');
  
  // --- PREFERENCES ---
  const [unit, setUnit] = useState('Liters');
  const [refreshRate, setRefreshRate] = useState('5s');
  const [notifications, setNotifications] = useState(true);

  // --- SIMULATION LOGIC ---
  useEffect(() => {
    const simulation = setInterval(() => {
      setTankLevel(prev => {
        const h = new Date().getHours();
        // Dynamic drain based on peak hours
        let drain = (h >= 7 && h <= 9) || (h >= 18 && h <= 21) ? 0.08 : 0.03;
        let next = prev - drain;
        
        if (isPumpOn) next += 0.55; // Refill rate
        
        // Safety Auto-cutoff logic
        if (autoCutoff && next >= 95) { 
          setIsPumpOn(false); 
          return 95.0; 
        }
        
        return Math.max(0, Math.min(100, next));
      });
    }, 1000);
    return () => clearInterval(simulation);
  }, [isPumpOn, autoCutoff]);

  const chartData = [
    { t: '1', v: 40 }, { t: '2', v: 30 }, { t: '3', v: 55 }, 
    { t: '4', v: 45 }, { t: '5', v: 70 }, { t: '6', v: 60 }
  ];

  // --- OVERLAY: SIDEBAR MENU ---
  const SidebarMenu = () => (
    <div className={`absolute inset-0 z-[100] transition-all duration-300 ${showMenu ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMenu(false)} />
      <div className={`absolute inset-y-0 left-0 w-[85%] max-w-sm bg-[#1a222d] shadow-2xl transition-transform duration-500 ease-out ${showMenu ? 'translate-x-0' : '-translate-x-full'} p-8 flex flex-col`}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center font-black text-white shadow-lg rotate-3">H</div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tight">Admin Console</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">v4.2.0-Stable</p>
            </div>
          </div>
          <button onClick={() => setShowMenu(false)} className="p-2 bg-slate-800 rounded-xl text-slate-400 active:scale-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Select Building Node</p>
            <div className="space-y-2">
              {['Hostel Node Alpha-01', 'Hostel Node Beta-02', 'Staff Quarters Q-1'].map(node => (
                <button 
                  key={node}
                  onClick={() => { setActiveNode(node); setShowMenu(false); }}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${activeNode === node ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800'}`}
                >
                  <Building size={18}/>
                  <span className="font-bold text-xs uppercase tracking-tight text-left flex-1">{node}</span>
                  {activeNode === node && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Core Systems</p>
            <button className="w-full flex items-center gap-4 text-slate-300 p-3 hover:bg-slate-800 rounded-xl transition-all">
              <Database size={18} className="text-blue-500"/> <span className="text-xs font-bold uppercase tracking-tight">Consumption History</span>
            </button>
            <button className="w-full flex items-center gap-4 text-slate-300 p-3 hover:bg-slate-800 rounded-xl transition-all">
              <Radio size={18} className="text-orange-500"/> <span className="text-xs font-bold uppercase tracking-tight">Sensor Calibration</span>
            </button>
            <button className="w-full flex items-center gap-4 text-slate-300 p-3 hover:bg-slate-800 rounded-xl transition-all">
              <Waves size={18} className="text-cyan-400"/> <span className="text-xs font-bold uppercase tracking-tight">Source Switching</span>
            </button>
          </div>
        </div>

        <button className="mt-auto flex items-center justify-between bg-red-500/10 p-5 rounded-2xl group active:scale-95 transition-all">
          <div className="flex items-center gap-4 text-red-500 font-black uppercase text-xs">
            <LogOut size={18}/> System Logout
          </div>
          <ChevronRight size={16} className="text-red-500/50 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  // --- OVERLAY: SETTINGS DRAWER ---
  const SettingsPanel = () => (
    <div className={`absolute inset-0 z-[100] transition-all duration-300 ${showSettings ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity ${showSettings ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowSettings(false)} />
      <div className={`absolute bottom-0 inset-x-0 bg-[#1a222d] rounded-t-[3.5rem] shadow-2xl transition-transform duration-500 ease-out ${showSettings ? 'translate-y-0' : 'translate-y-full'} p-10 pb-12`}>
        <div className="w-16 h-1.5 bg-slate-800 rounded-full mx-auto mb-10" />
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-white font-black text-2xl uppercase tracking-tighter">Preferences</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Configuring: {activeNode}</p>
          </div>
          <button onClick={() => setShowSettings(false)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center p-5 bg-black/30 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Droplet size={20}/></div>
              <div>
                <p className="text-white font-black text-xs uppercase">Volume Units</p>
                <p className="text-slate-500 text-[9px] uppercase font-bold">Standard display metric</p>
              </div>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-xl">
              {['Liters', 'Gallons'].map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${unit === u ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center p-5 bg-black/30 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500"><RefreshCcw size={20}/></div>
              <div>
                <p className="text-white font-black text-xs uppercase">Refresh Rate</p>
                <p className="text-slate-500 text-[9px] uppercase font-bold">Cloud sync frequency</p>
              </div>
            </div>
            <select 
              value={refreshRate} 
              onChange={(e) => setRefreshRate(e.target.value)}
              className="bg-slate-800 text-white text-[10px] font-black p-3 rounded-xl outline-none appearance-none px-6"
            >
              <option>1s</option>
              <option>5s</option>
              <option>30s</option>
            </select>
          </div>

          <div className="p-5 bg-black/30 rounded-3xl border border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><Bell size={20}/></div>
              <p className="text-white font-black text-xs uppercase">System Notifications</p>
            </div>
            <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${notifications ? 'bg-blue-600' : 'bg-slate-700'}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'right-1.5' : 'left-1.5'}`} />
            </button>
          </div>
        </div>

        <button onClick={() => setShowSettings(false)} className="w-full mt-10 bg-gradient-to-r from-blue-600 to-blue-500 py-5 rounded-[2rem] text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all">
          Save Configuration
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex justify-center overflow-hidden font-sans select-none">
      <div className="w-full max-w-md h-screen flex flex-col bg-[#121820] border-x border-slate-800 relative shadow-2xl overflow-hidden">
        
        <SidebarMenu />
        <SettingsPanel />

        {/* --- DYNAMIC HEADER --- */}
        {activeTab !== 'student' && (
          <header className="p-4 pt-10 bg-[#1a222d] border-b border-slate-800 z-50">
            <div className="flex justify-between items-center mb-8 px-2">
              <button onClick={() => setShowMenu(true)} className="p-3 bg-slate-800/50 rounded-2xl text-slate-400 active:scale-90 transition-all">
                <Menu size={22} />
              </button>
              <div className="text-center">
                <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 leading-none mb-1">Admin Analytics</h1>
                <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{activeNode}</p>
              </div>
              <button onClick={() => setShowSettings(true)} className="p-3 bg-slate-800/50 rounded-2xl text-slate-400 active:scale-90 transition-all">
                <Settings size={22} />
              </button>
            </div>
            
            <div className="flex gap-2 bg-[#121820] p-1.5 rounded-[1.5rem] border border-slate-800 shadow-inner">
              {[
                { id: 'dashboard', icon: <Activity size={14}/>, label: 'Dash' },
                { id: 'alerts', icon: <AlertTriangle size={14}/>, label: 'Alerts' },
                { id: 'student', icon: <User size={14}/>, label: 'Public' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </header>
        )}

        {/* --- VIEW: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-32 scrollbar-hide animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#1a222d] rounded-[3rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Droplet size={100} className="text-blue-500"/></div>
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-800" strokeWidth="2.5" />
                    <circle 
                      cx="18" cy="18" r="16" fill="none" 
                      className="stroke-blue-500 transition-all duration-1000 ease-out" 
                      strokeWidth="2.5" 
                      strokeDasharray={`${tankLevel}, 100`} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-white text-4xl font-black tracking-tighter leading-none">{Math.round(tankLevel)}</span>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">% Full</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Status: Stable
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Est. Volume</p>
                  <h2 className="text-white text-5xl font-black tracking-tighter leading-none">
                    {unit === 'Liters' ? `${Math.round(tankLevel * 10)}L` : `${Math.round(tankLevel * 2.64)}G`}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-slate-800/50 pt-8">
                <div className="space-y-1">
                  <p className="text-slate-500 text-[9px] font-black uppercase flex items-center gap-2"><Clock size={12} className="text-orange-500"/> Runtime Left</p>
                  <p className="text-white font-black text-xl">12.1 Hrs</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[9px] font-black uppercase flex items-center gap-2"><TrendingDown size={12} className="text-blue-400"/> Consumption</p>
                  <p className="text-white font-black text-xl">Moderate</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsPumpOn(!isPumpOn)}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col gap-3 active:scale-95 ${isPumpOn ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20' : 'bg-[#1a222d] border-slate-800'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPumpOn ? 'bg-white/20' : 'bg-slate-800'}`}>
                  <Zap size={24} className={isPumpOn ? 'text-white' : 'text-slate-500'} fill={isPumpOn ? 'white' : 'none'} />
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-black uppercase ${isPumpOn ? 'text-white' : 'text-slate-500'}`}>Pump System</p>
                  <p className={`text-xs font-black uppercase ${isPumpOn ? 'text-white' : 'text-white'}`}>{isPumpOn ? 'Online' : 'Standby'}</p>
                </div>
              </button>

              <button 
                onClick={() => setAutoCutoff(!autoCutoff)}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col gap-3 active:scale-95 ${autoCutoff ? 'bg-emerald-600/10 border-emerald-500/50' : 'bg-[#1a222d] border-slate-800'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${autoCutoff ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                  <ShieldCheck size={24} className={autoCutoff ? 'text-emerald-500' : 'text-slate-500'} />
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-black uppercase ${autoCutoff ? 'text-emerald-500' : 'text-slate-500'}`}>Auto Cut-off</p>
                  <p className="text-xs font-black uppercase text-white">{autoCutoff ? 'Armed' : 'Disabled'}</p>
                </div>
              </button>
            </div>

            {/* Danger Zone Prediction */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-[2.5rem] p-6 flex items-center gap-6 shadow-2xl shadow-red-600/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
               <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Bell size={32} className="text-white" /></div>
               <div className="flex-1">
                 <p className="text-white/70 font-black text-[10px] uppercase tracking-widest leading-none mb-1">Shortage Prediction</p>
                 <p className="text-white font-black text-sm uppercase leading-tight tracking-tight">Supply may hit critical 10%<br/>during evening peak usage.</p>
               </div>
            </div>
          </div>
        )}

        {/* --- VIEW: ALERTS --- */}
        {activeTab === 'alerts' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-28 scrollbar-hide animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center px-2 mb-4">
              <h2 className="text-white font-black text-2xl uppercase tracking-tighter">System Events</h2>
              <button className="text-blue-500 font-black text-[10px] uppercase tracking-widest">Clear All</button>
            </div>
            
            <div className="bg-red-600 rounded-3xl p-6 flex gap-5 shadow-lg shadow-red-600/10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0"><AlertTriangle className="text-white" size={24}/></div>
              <div>
                <p className="text-white font-black text-xs uppercase tracking-tight">Overflow Prevented</p>
                <p className="text-white/90 text-sm font-bold leading-snug mt-1 italic opacity-80">Safety shut-off triggered at Node Alpha.</p>
                <div className="mt-4 flex items-center gap-2 bg-black/20 w-max px-3 py-1.5 rounded-full border border-white/10">
                   <Clock size={10} className="text-white/50"/>
                   <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">01:30 AM Today</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1a222d] rounded-3xl p-6 border border-slate-800 flex gap-5">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0 text-orange-500"><Activity size={24}/></div>
              <div>
                <p className="text-white font-black text-xs uppercase tracking-tight">Anomaly Detected</p>
                <p className="text-slate-400 text-sm font-bold leading-snug mt-1 italic">Unusual constant flow recorded in Block-B West.</p>
                <button className="mt-4 text-orange-400 font-black text-[9px] uppercase tracking-widest border border-orange-400/30 px-4 py-2 rounded-xl active:bg-orange-400/10">Dispatch Maintenance</button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: PUBLIC/STUDENT --- */}
        {activeTab === 'student' && (
          <div className={`flex-1 ${tankLevel < 20 ? 'bg-red-600' : tankLevel < 50 ? 'bg-yellow-400' : 'bg-emerald-500'} flex flex-col items-center justify-center p-12 space-y-16 transition-colors duration-1000 relative`}>
             <div className="bg-white p-16 rounded-[5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative group cursor-pointer active:scale-95 transition-transform" onClick={() => setTankLevel(Math.random() * 100)}>
              <Droplet size={160} className={`${tankLevel < 20 ? 'text-red-600' : tankLevel < 50 ? 'text-yellow-400' : 'text-emerald-500'} fill-current`} />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-9xl drop-shadow-xl">{tankLevel < 20 ? '☹️' : tankLevel < 50 ? '😐' : '😊'}</div>
            </div>
            
            <div className="text-center space-y-6">
               <h1 className="text-white font-black text-6xl tracking-tighter uppercase leading-none drop-shadow-lg">WATER STATUS:<br/>{tankLevel < 20 ? 'CRITICAL' : tankLevel < 50 ? 'LIMITED' : 'SUFFICIENT'}</h1>
               <p className="text-white font-bold text-2xl opacity-90 tracking-tight leading-snug px-6">{tankLevel < 20 ? 'Supply cut imminent. Prepare for zero pressure.' : tankLevel < 50 ? 'Please conserve water. Limit shower duration.' : 'System stable. No usage restrictions in effect.'}</p>
            </div>

            {tankLevel < 50 && (
              <div className="bg-blue-600 text-white px-10 py-6 rounded-[2rem] flex items-center gap-4 font-black text-sm uppercase shadow-2xl animate-bounce">
                <Bell size={24}/> Conservation Protocol Active
              </div>
            )}

            <div className="bg-black/30 backdrop-blur-md py-6 absolute bottom-0 left-0 right-0 text-center border-t border-white/10">
              <p className="text-white text-[11px] font-black uppercase tracking-[0.5em] opacity-60">Smart Hostel Water Manager</p>
            </div>
            
            <button onClick={() => setActiveTab('dashboard')} className="absolute top-12 left-10 p-5 bg-black/30 rounded-[2rem] text-white shadow-xl backdrop-blur-md active:scale-90 transition-all">
              <ChevronLeft size={28} />
            </button>
          </div>
        )}

        {/* Global Footer Meta */}
        {activeTab !== 'student' && (
          <div className="absolute bottom-5 left-0 right-0 px-8 flex justify-between items-center pointer-events-none opacity-40">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <span className="text-[9px] font-black text-white uppercase tracking-widest italic">{refreshRate} Cloud Sync</span>
             </div>
             <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Node: {activeNode.split('-').pop()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;


