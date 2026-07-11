import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema, LoginDto } from '../dto/auth.dto';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    setApiError(null);
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col w-full items-center justify-center min-h-[calc(100vh-64px)]">
        {/* Ambient Background Element */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
          <div
            className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Login Container */}
        <div className="relative w-full max-w-[440px] px-gutter">
          {/* Brand Identity Area */}
          <div className="flex flex-col items-center mb-stack-lg space-y-unit">
            <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center rounded-xl mb-stack-md shadow-xl">
              <span
                className="material-symbols-outlined text-[40px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}
              >
                view_in_ar
              </span>
            </div>
            <h1 className="font-headline-xl text-on-surface tracking-tight">Lotwise</h1>
            <p className="font-body-md text-on-surface-variant">Precision inventory management</p>
          </div>

          {/* Main Card */}
          <div className="bg-surface-container rounded-xl shadow-2xl p-stack-lg border border-outline-variant/10 transition-transform duration-100"
               style={{ transformStyle: 'preserve-3d' }}>
            
            {apiError && (
              <div className="mb-stack-md p-4 rounded-lg bg-error-container text-on-error-container font-body-md border border-error/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-error shrink-0">error</span>
                <span>{apiError}</span>
              </div>
            )}

            <form className="space-y-stack-lg" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Input Group: Email */}
              <div className="space-y-unit">
                <label className="font-label-mono text-on-surface-variant uppercase tracking-widest ml-1" htmlFor="email">
                  Work Email
                </label>
                <div className="relative group">
                  <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-error' : 'text-on-surface-variant group-focus-within:text-primary'}`}>
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@dealership.com"
                    className={`w-full bg-surface-container-low border rounded-lg py-4 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:ring-1 transition-all placeholder:text-on-surface-variant/40 ${
                      errors.email
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'border-outline-variant/30 focus:border-primary focus:ring-primary/20'
                    }`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="font-label-mono text-error ml-1 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Input Group: Password */}
              <div className="space-y-unit">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label-mono text-on-surface-variant uppercase tracking-widest" htmlFor="password">
                    Security Key
                  </label>
                  <a href="#" className="font-label-mono text-primary hover:underline lowercase" tabIndex={-1}>
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-error' : 'text-on-surface-variant group-focus-within:text-primary'}`}>
                    lock
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-surface-container-low border rounded-lg py-4 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:ring-1 transition-all placeholder:text-on-surface-variant/40 ${
                      errors.password
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'border-outline-variant/30 focus:border-primary focus:ring-primary/20'
                    }`}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="font-label-mono text-error ml-1 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Primary Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full bg-primary text-on-primary font-headline-md py-4 rounded-lg overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                )}
                
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Log in
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Secondary Navigation */}
            <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant/10 text-center">
              <p className="font-body-md text-on-surface-variant">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline transition-colors">
                  Register for Lotwise
                </Link>
              </p>
            </div>
          </div>

          {/* System Status Footer */}
          <div className="mt-stack-lg flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">Systems Nominal</span>
            </div>
            <div className="font-label-mono text-[10px] text-on-surface-variant uppercase opacity-40">v4.2.0-stable</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
