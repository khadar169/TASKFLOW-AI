import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Columns3, 
  User, 
  LogOut, 
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Briefcase, path: '/projects' },
    { name: 'Kanban Board', icon: Columns3, path: '/board' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const activePath = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border transition-transform duration-300 transform md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-600 rounded-lg">
                <Zap size={20} className="text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                TaskFlow <span className="text-primary-500">AI</span>
              </span>
            </Link>
            <button className="md:hidden" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            <div className="pb-4 mb-4 border-b border-slate-100 dark:border-dark-border">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Menu
              </p>
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activePath(item.path) 
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400" 
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-100 dark:border-dark-border">
            <div className="flex items-center gap-3 mb-4 px-2">
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-primary-500"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
