import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Filter, 
  Search, 
  Video, 
  Image as ImageIcon, 
  Mic, 
  Type, 
  ChevronRight,
  Star,
  Activity
} from 'lucide-react';

const Projects = () => {
  // --- REAL PROJECTS FROM MULTIMANGO SCREENSHOT ---
  const projects = [
    {
      id: '1',
      title: 'Omni T2V Elo',
      description: 'T2V ELO evaluation — compare text-to-video outputs side-by-side.',
      tags: ['Video', 'AI Eval'],
      icon: <Video className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-500/10'
    },
    {
      id: '2',
      title: 'Text To Video H2H',
      description: 'Compare two videos side-by-side to say which is better along different aspects.',
      tags: ['Video', 'H2H'],
      icon: <Video className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-500/10'
    },
    {
      id: '3',
      title: 'Text To Audio Video H2H',
      description: 'Compare text-to-audio-video models side-by-side and evaluate visual quality.',
      tags: ['Audio', 'Text', 'Video'],
      icon: <Mic className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-500/10'
    },
    {
      id: '4',
      title: 'Language Proficiency Survey',
      description: 'Survey to collect information about languages you speak and proficiency levels.',
      tags: ['Multimodal', 'Survey'],
      icon: <Type className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-500/10'
    },
    {
      id: '5',
      title: 'Text To Image Compare',
      description: 'Compare AI-generated images for ELO run-specific evaluation side-by-side.',
      tags: ['Image', 'Text'],
      icon: <ImageIcon className="w-6 h-6 text-pink-500" />,
      color: 'bg-pink-500/10'
    },
    {
      id: '6',
      title: 'Video Color Picker',
      description: 'Analyze and pick specific color profiles from AI generated video frames.',
      tags: ['Video', 'Analysis'],
      icon: <Activity className="w-6 h-6 text-indigo-500" />,
      color: 'bg-indigo-500/10'
    },
    {
      id: '7',
      title: 'Omni TTS Elo',
      description: 'TTS-specific ELO evaluation with language proficiency requirements.',
      tags: ['Audio', 'Text'],
      icon: <Mic className="w-6 h-6 text-red-500" />,
      color: 'bg-red-500/10'
    },
    {
      id: '8',
      title: 'Omni R2I',
      description: 'Reasoning-to-Image evaluation for multimodal AI models.',
      tags: ['Multimodal', 'Image'],
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary-500" />
            Available Projects
          </h1>
          <p className="text-slate-400 mt-1">Select a task to begin working on AI evaluations.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95">
          <Plus className="w-5 h-5" />
          Create Project
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
        <div className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium cursor-pointer">
          All
        </div>
        {['Audio', 'Image', 'Multimodal', 'Text', 'Video'].map((filter) => (
          <div key={filter} className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-sm font-medium cursor-pointer transition-all">
            {filter}
          </div>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-white w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-primary-500/50 hover:bg-slate-800/50 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-primary-500" />
            </div>

            <div className={`${project.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              {project.icon}
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
              {project.title}
            </h3>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-slate-950 text-slate-500 text-[10px] uppercase tracking-wider font-bold rounded-md border border-slate-800">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
