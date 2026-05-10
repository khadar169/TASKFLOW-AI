import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Navbar = ({ setSidebarOpen }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 border border-slate-200 dark:border-dark-border rounded-md"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="hidden sm:block">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search projects or tasks..."
              className="w-80 bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <span className="text-xs text-primary-500">Mark all as read</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} className={cn(
                        "p-4 border-b border-slate-50 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                        !n.read && "bg-primary-50/30 dark:bg-primary-900/10"
                      )}>
                        <p className="text-sm font-medium">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-dark-border">
            <div className="hidden text-right lg:block">
              <span className="block text-sm font-semibold">{user?.name}</span>
              <span className="block text-xs text-slate-500">{user?.role}</span>
            </div>
            <img
              className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-dark-border"
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
              alt="User"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper for classNames
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Navbar;
