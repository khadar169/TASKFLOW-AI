import { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Activity
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks')
        ]);
        
        const projects = projectsRes.data;
        const tasks = tasksRes.data;
        
        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'Completed').length,
          pendingTasks: tasks.filter(t => t.status === 'Pending').length,
          inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
        });
        
        setRecentTasks(tasks.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 7 },
    { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 8 },
    { name: 'Fri', tasks: 12 },
    { name: 'Sat', tasks: 3 },
    { name: 'Sun', tasks: 2 },
  ];

  const pieData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgressTasks || 0, color: '#3b82f6' },
    { name: 'Pending', value: stats.pendingTasks, color: '#f59e0b' },
  ];

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card rounded-lg border border-slate-200 dark:border-dark-border shadow-sm">
          <Activity size={18} className="text-primary-500" />
          <span className="text-sm font-medium">System Status: <span className="text-green-500">Optimal</span></span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={stats.totalProjects} icon={Briefcase} color="blue" />
        <StatCard title="Active Tasks" value={stats.totalTasks} icon={Clock} color="amber" />
        <StatCard title="Completed" value={stats.completedTasks} icon={CheckCircle2} color="emerald" />
        <StatCard title="Efficiency" value="94%" icon={TrendingUp} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-500" />
            Task Completion Trend
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Line type="monotone" dataKey="tasks" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-6">Task Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
            <h3 className="text-lg font-bold">Active Operations</h3>
            <button className="text-sm text-primary-500 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Task</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Priority</th>
                  <th className="px-6 py-4 font-medium">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {recentTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.project?.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                        task.status === 'Completed' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" :
                        task.status === 'In Progress' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      )}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          task.priority === 'High' || task.priority === 'Critical' ? "bg-red-500" :
                          task.priority === 'Medium' ? "bg-amber-500" : "bg-slate-400"
                        )}></div>
                        <span className="text-sm">{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <img 
                        src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name}`} 
                        alt="Avatar" 
                        className="w-7 h-7 rounded-full border border-slate-200 dark:border-dark-border"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Productivity */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-6">Team Productivity</h3>
          <div className="space-y-6">
            <TeamMemberProgress name="Alex Rivera" progress={85} tasks={12} avatar="https://i.pravatar.cc/150?u=alex" />
            <TeamMemberProgress name="Sarah Chen" progress={65} tasks={8} avatar="https://i.pravatar.cc/150?u=sarah" />
            <TeamMemberProgress name="Marcus Kim" progress={92} tasks={15} avatar="https://i.pravatar.cc/150?u=marcus" />
            <TeamMemberProgress name="Elena Vance" progress={45} tasks={5} avatar="https://i.pravatar.cc/150?u=elena" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
  };

  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={cn("p-3 rounded-xl", colors[color])}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <h4 className="text-2xl font-bold">{value}</h4>
      </div>
    </div>
  );
};

const TeamMemberProgress = ({ name, progress, tasks, avatar }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src={avatar} alt="" className="w-6 h-6 rounded-full" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-xs text-slate-500">{tasks} tasks</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
      <div 
        className="bg-primary-500 h-1.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;
