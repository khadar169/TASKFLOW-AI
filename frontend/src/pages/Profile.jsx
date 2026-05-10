import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Camera, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      toast.success('Profile updated successfully!');
      // Update local storage/state if needed
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Update your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card p-6 flex flex-col items-center text-center h-fit">
          <div className="relative mb-4 group">
            <img 
              src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}`} 
              className="w-32 h-32 rounded-full border-4 border-primary-500/20 object-cover"
              alt="Avatar"
            />
            <button className="absolute bottom-1 right-1 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-sm text-slate-500 mb-6">{user?.role}</p>
          
          <div className="w-full pt-6 border-t border-slate-100 dark:border-dark-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Joined</span>
              <span className="font-medium">May 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Projects</span>
              <span className="font-medium">4 Active</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </span>
                  <input 
                    type="text" 
                    className="input pl-10" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input 
                    type="email" 
                    className="input pl-10" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-400">Account Role</label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 border border-dashed border-slate-300 dark:border-dark-border">
                <Shield size={18} />
                <span className="text-sm font-medium">{user?.role} Access Level</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Avatar URL</label>
              <input 
                type="text" 
                className="input" 
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-dark-border">
              <h3 className="font-bold mb-4">Security</h3>
              <div>
                <label className="block text-sm font-medium mb-1.5">New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  className="input" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary gap-2 min-w-[150px]"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
