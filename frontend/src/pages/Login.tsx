import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login, register: authRegister } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isLoginTab) {
        await login({ email, password });
      } else {
        await authRegister({ email, password, role: 'user' });
        await login({ email, password });
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || `Failed to ${isLoginTab ? 'login' : 'register'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="w-[800px] h-[800px] bg-rose-600/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase mb-2">
              Lotwise
            </h1>
            <p className="text-slate-400 text-sm">
              Premium Dealership Terminal
            </p>
          </div>

          {/* Form Switcher */}
          <div className="flex gap-4 mb-8 border-b border-slate-800">
            <button 
              onClick={() => { setIsLoginTab(true); setError(''); }}
              className={`pb-3 text-sm font-medium transition-all w-1/2 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-t-sm ${isLoginTab ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsLoginTab(false); setError(''); }}
              className={`pb-3 text-sm font-medium transition-all w-1/2 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-t-sm ${!isLoginTab ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400 text-xl">warning</span>
              <span className="text-sm text-red-400 font-medium">{error}</span>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Registry ID / Email
              </label>
              <div className="relative">
                <input 
                  id="email"
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 px-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" 
                  placeholder="driver@lotwise.com" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">alternate_email</span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Access Key
              </label>
              <div className="relative">
                <input 
                  id="password"
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 px-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" 
                  placeholder="••••••••" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">lock</span>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className={`mt-6 w-full font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                isLoading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-rose-600 text-white hover:bg-rose-500 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] active:scale-[0.98]'
              }`} 
              type="submit"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{isLoginTab ? 'Enter Showroom' : 'Create Account'}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
