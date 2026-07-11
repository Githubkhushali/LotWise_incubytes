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
        // After successful registration, log them in automatically
        await login({ email, password });
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || `Failed to ${isLoginTab ? 'login' : 'register'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex items-center justify-center p-margin-mobile">
      <main className="w-full max-w-md">
        <div className="flex flex-col w-full min-h-[819px] justify-center items-center relative overflow-hidden">
          
          {/* Ambient Racing Line Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full opacity-20" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#abd600" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path d="M-100,200 Q400,150 1100,300" fill="none" stroke="url(#line-grad)" strokeWidth="2">
                <animate attributeName="d" dur="10s" repeatCount="indefinite" values="M-100,200 Q400,150 1100,300; M-100,300 Q600,450 1100,200; M-100,200 Q400,150 1100,300" />
              </path>
              <path d="M-100,500 Q500,450 1100,550" fill="none" opacity="0.5" stroke="url(#line-grad)" strokeWidth="1">
                <animate attributeName="d" dur="15s" repeatCount="indefinite" values="M-100,500 Q500,450 1100,550; M-100,450 Q300,550 1100,500; M-100,500 Q500,450 1100,550" />
              </path>
            </svg>
          </div>

          {/* Terminal Header Metadata */}
          <div className="absolute top-0 left-0 p-md flex flex-col gap-xs opacity-40 select-none">
            <div className="flex items-center gap-sm">
              <span className="w-2 h-2 bg-secondary-fixed rounded-full animate-pulse"></span>
              <span className="font-label-caps text-on-surface uppercase tracking-widest">System: Secure_Uplink_v4.2</span>
            </div>
            <div className="font-label-caps text-on-surface text-[10px] uppercase">LAT: 52.5200° N | LON: 13.4050° E</div>
          </div>

          {/* Main Login Card */}
          <div className="relative z-10 w-full max-w-md">
            <div className="bg-surface-container/60 backdrop-blur-xl p-lg rounded-lg shadow-2xl border-l-2 border-secondary-fixed relative overflow-hidden group">
              
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-on-surface-variant/20"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-on-surface-variant/20"></div>

              <div className="mb-lg">
                <div className="flex items-baseline justify-between mb-xs">
                  <h1 className="font-display-lg-mobile text-secondary uppercase tracking-tighter">Lotwise</h1>
                  <span className="font-label-caps text-secondary-fixed text-[10px] border border-secondary-fixed/30 px-2 py-0.5">AUTH_REQUIRED</span>
                </div>
                <p className="font-body-md text-on-surface-variant opacity-80">Access the private racing inventory terminal.</p>
              </div>

              {/* Form Switcher */}
              <div className="flex gap-md mb-lg border-b border-outline-variant/30">
                <button 
                  onClick={() => { setIsLoginTab(true); setError(''); }}
                  className={`pb-sm font-label-caps transition-all ${isLoginTab ? 'text-secondary border-b-2 border-secondary-fixed' : 'text-on-surface-variant hover:text-secondary'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setIsLoginTab(false); setError(''); }}
                  className={`pb-sm font-label-caps transition-all ${!isLoginTab ? 'text-secondary border-b-2 border-secondary-fixed' : 'text-on-surface-variant hover:text-secondary'}`}
                >
                  Register
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error/10 border border-error/30 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                  <span className="font-label-caps text-error">{error}</span>
                </div>
              )}

              {/* Inputs */}
              <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
                <div className="group/input">
                  <label htmlFor="email" className="font-label-caps text-on-surface-variant uppercase mb-xs block text-[10px]">Registry ID / Email</label>
                  <div className="relative">
                    <input 
                      id="email"
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-lowest/50 border-b border-outline-variant py-sm px-xs font-body-md text-secondary placeholder:text-on-surface-variant/30 focus:outline-none focus:border-secondary-fixed transition-colors" 
                      placeholder="driver@lotwise.spec" 
                    />
                    <span className="material-symbols-outlined absolute right-xs top-1/2 -translate-y-1/2 text-on-surface-variant text-sm opacity-40">alternate_email</span>
                  </div>
                </div>

                <div className="group/input">
                  <label htmlFor="password" className="font-label-caps text-on-surface-variant uppercase mb-xs block text-[10px]">Access Key</label>
                  <div className="relative">
                    <input 
                      id="password"
                      required 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-container-lowest/50 border-b border-outline-variant py-sm px-xs font-body-md text-secondary placeholder:text-on-surface-variant/30 focus:outline-none focus:border-secondary-fixed transition-colors" 
                      placeholder="••••••••" 
                    />
                    <span className="material-symbols-outlined absolute right-xs top-1/2 -translate-y-1/2 text-on-surface-variant text-sm opacity-40">lock</span>
                  </div>
                </div>

                {/* Security Metric */}
                <div className="flex items-center gap-sm mt-xs">
                  <div className="flex-1 h-1 bg-surface-container-high rounded-full overflow-hidden flex gap-1">
                    <div className="h-full w-1/3 bg-secondary-fixed"></div>
                    <div className="h-full w-1/3 bg-secondary-fixed"></div>
                    <div className="h-full w-1/3 bg-secondary-fixed/20"></div>
                  </div>
                  <span className="font-label-caps text-[10px] text-secondary-fixed">Encryption: AES-256</span>
                </div>

                {/* CTA */}
                <button 
                  disabled={isLoading}
                  className={`mt-lg w-full font-headline-sm uppercase py-md flex items-center justify-center gap-sm transition-all group/btn ${isLoading ? 'bg-white text-surface opacity-50 cursor-not-allowed' : 'bg-secondary-fixed text-on-secondary hover:bg-white shadow-[0_0_20px_rgba(195,244,0,0.3)] active:scale-95'}`} 
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                      <span>VALIDATING...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLoginTab ? 'Enter Showroom' : 'Create Account'}</span>
                      <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer Actions */}
              <div className="mt-xl flex justify-between items-center">
                <button className="font-label-caps text-[10px] text-on-surface-variant hover:text-secondary-fixed transition-colors">Forgot Credentials?</button>
                <div className="flex gap-sm">
                  <div className="w-8 h-[1px] bg-outline-variant self-center"></div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant">V.2.0.84</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Accent Labels */}
          <div className="absolute bottom-md right-md [writing-mode:vertical-rl] flex items-center gap-md opacity-20 select-none">
            <span className="font-label-caps text-on-surface uppercase tracking-widest text-[10px]">Technical Excellence // Precision Engineering</span>
            <div className="h-12 w-[1px] bg-on-surface"></div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Login;
