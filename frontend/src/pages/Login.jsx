import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@taskflow.ai');
      setPassword('admin123');
    } else {
      setEmail('member@taskflow.ai');
      setPassword('member123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-500/20">
            <Zap size={32} className="text-white fill-current" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">TaskFlow AI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">AI Operations Workflow Management</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold mb-6">Sign In</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Login to Dashboard'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-dark-border">
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">Demo Accounts</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleDemoLogin('admin')}
                  className="px-4 py-2 text-xs font-bold border border-slate-200 dark:border-dark-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Admin Demo
                </button>
                <button 
                  onClick={() => handleDemoLogin('member')}
                  className="px-4 py-2 text-xs font-bold border border-slate-200 dark:border-dark-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Member Demo
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-t border-slate-100 dark:border-dark-border">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
