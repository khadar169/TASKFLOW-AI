import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus,
  MessageSquare
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks?projectId=${id}`)
        ]);
        setProject(projRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors">
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Project Info */}
        <div className="flex-1 space-y-6">
          <div className="card p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{project.title}</h1>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 rounded-full text-xs font-bold uppercase">
                    {project.status}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl">{project.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Priority</p>
                <span className="font-bold text-red-500">{project.priority}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 dark:border-dark-border">
              <InfoItem icon={Calendar} label="Deadline" value={new Date(project.deadline).toLocaleDateString()} />
              <InfoItem icon={Users} label="Team Size" value={`${project.members?.length || 0} Members`} />
              <InfoItem icon={CheckCircle2} label="Tasks Done" value={`${tasks.filter(t => t.status === 'Completed').length}/${tasks.length}`} />
              <InfoItem icon={Clock} label="Days Left" value="14 Days" />
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
              <h3 className="font-bold">Project Tasks</h3>
              <button className="btn btn-primary btn-sm py-1.5 px-3 text-xs gap-1">
                <Plus size={14} /> New Task
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-dark-border">
              {tasks.length === 0 ? (
                <div className="p-10 text-center text-slate-400 italic">No tasks created yet</div>
              ) : (
                tasks.map(task => (
                  <div key={task._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        task.status === 'Completed' ? "bg-green-500" : task.status === 'In Progress' ? "bg-blue-500" : "bg-amber-500"
                      )}></div>
                      <div>
                        <h4 className="text-sm font-semibold">{task.title}</h4>
                        <p className="text-xs text-slate-500">{task.priority} Priority</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MessageSquare size={14} />
                        <span className="text-xs">{task.comments?.length || 0}</span>
                      </div>
                      <img 
                        src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name}`} 
                        className="w-7 h-7 rounded-full" 
                        alt=""
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold mb-4">Project Team</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={project.admin?.avatar} className="w-10 h-10 rounded-full border-2 border-primary-500" alt="" />
                <div>
                  <p className="text-sm font-bold">{project.admin?.name}</p>
                  <p className="text-xs text-slate-500">Project Manager</p>
                </div>
              </div>
              {project.members?.map(member => (
                <div key={member._id} className="flex items-center gap-3">
                  <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-slate-500">Team Member</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-bold border border-slate-200 dark:border-dark-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Manage Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div>
    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
      <Icon size={14} />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-bold">{value}</p>
  </div>
);

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default ProjectDetails;
