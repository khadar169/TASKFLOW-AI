import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Calendar, Users, Filter, Briefcase } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium',
  });

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      toast.success('Project created successfully');
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your AI operation pipelines</p>
        </div>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="btn btn-primary gap-2"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg flex items-center gap-2 text-sm">
            <Filter size={16} />
            Filter
          </button>
          <select className="px-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg text-sm outline-none">
            <option>Latest</option>
            <option>Priority</option>
            <option>Deadline</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-slate-200 dark:bg-slate-800"></div>
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <Briefcase size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold">No projects found</h3>
            <p className="text-slate-500">Get started by creating your first project</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="card group hover:shadow-lg hover:border-primary-500/50 transition-all">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    project.priority === 'High' || project.priority === 'Critical' ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                    project.priority === 'Medium' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" :
                    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  )}>
                    {project.priority}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                  {project.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(project.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      {project.members?.length || 0} Members
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.members?.slice(0, 3).map((m, i) => (
                        <img 
                          key={i} 
                          src={m.avatar || `https://ui-avatars.com/api/?name=${m.name}`} 
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card" 
                          alt="member"
                        />
                      ))}
                      {project.members?.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-dark-card flex items-center justify-center text-[10px] font-bold">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className={cn(
                      "text-xs font-semibold",
                      project.status === 'Active' ? "text-primary-500" : "text-slate-400"
                    )}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-dark-border">
            <div className="p-6 border-b border-slate-100 dark:border-dark-border">
              <h2 className="text-xl font-bold">Create New Project</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Project Title</label>
                <input 
                  type="text" 
                  required
                  className="input" 
                  placeholder="e.g. LLM Reasoning Benchmark"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea 
                  required
                  className="input min-h-[100px]" 
                  placeholder="Describe the project goals and scope..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Deadline</label>
                  <input 
                    type="date" 
                    required
                    className="input" 
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority</label>
                  <select 
                    className="input"
                    value={newProject.priority}
                    onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn btn-primary"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Projects;
