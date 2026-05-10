import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  Users, Briefcase, CheckCircle, Clock, 
  ArrowUpRight, ArrowDownRight, Activity, TrendingUp
} from 'lucide-react';

const data = [
  { name: 'Mon', tasks: 40 },
  { name: 'Tue', tasks: 30 },
  { name: 'Wed', tasks: 60 },
  { name: 'Thu', tasks: 45 },
  { name: 'Fri', tasks: 75 },
  { name: 'Sat', tasks: 55 },
  { name: 'Sun', tasks: 20 },
];

const stats = [
  { label: 'Total Projects', value: '12', icon: <Briefcase />, color: 'bg-blue-500', trend: '+12%', isPositive: true },
  { label: 'Active Tasks', value: '48', icon: <Activity />, color: 'bg-emerald-500', trend: '+5%', isPositive: true },
  { label: 'Completed', value: '128', icon: <CheckCircle />, color: 'bg-purple-500', trend: '+18%', isPositive: true },
  { label: 'Pending', value: '7', icon: <Clock />, color: 'bg-amber-500', trend: '-2%', isPositive: false },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ops Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <img 
                key={i}
                className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" 
                src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} 
                alt="user"
              />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
              +12
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Task Velocity
            </h3>
            <select className="bg-slate-950 border border-slate-800 text-slate-400 text-xs rounded-lg px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent AI Tasks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent AI Operations</h3>
          <div className="space-y-4">
            {[
              { name: 'Omni T2V Elo', user: 'Abdull K.', status: 'In Progress', time: '2m ago' },
              { name: 'Text To Video H2H', user: 'Sarah J.', status: 'Completed', time: '15m ago' },
              { name: 'Language Survey', user: 'Admin', status: 'Pending', time: '1h ago' },
              { name: 'Omni TTS Eval', user: 'Mike R.', status: 'Reviewing', time: '3h ago' },
              { name: 'Image Compare', user: 'Ethara Bot', status: 'Completed', time: '5h ago' },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-primary-500">
                    {task.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{task.name}</h4>
                    <p className="text-xs text-slate-500">{task.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {task.status}
                  </span>
                  <p className="text-[10px] text-slate-600 mt-1">{task.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
