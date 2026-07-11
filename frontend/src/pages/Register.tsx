import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, RegisterDto } from '../dto/auth.dto';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterDto) => {
    setApiError(null);
    try {
      await authRegister(data);
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
    <main className="min-h-screen flex items-center justify-center bg-surface font-body-md text-on-surface antialiased">
      <div className="flex flex-col w-full">
        <div className="relative flex min-h-[calc(100vh-64px)] w-full overflow-hidden">
          {/* Left Panel: Visual Storytelling & Branding */}
          <div className="relative hidden lg:flex lg:w-7/12 flex-col justify-between p-stack-lg bg-surface-container-lowest overflow-hidden">
            {/* Ambient Background Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-unit">
              <div className="flex items-center gap-stack-sm mb-stack-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
                </div>
                <span className="font-headline-md text-on-surface tracking-tight uppercase">Lotwise</span>
              </div>
              <h1 className="font-headline-xl text-on-surface max-w-xl leading-none">
                Scale your inventory <br />
                <span className="text-primary/60 italic font-light">with precision.</span>
              </h1>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-gutter max-w-2xl">
              <div className="flex flex-col gap-unit">
                <span className="font-label-mono text-primary uppercase text-[10px]">Real-time Sync</span>
                <p className="font-body-md text-on-surface-variant">Instant data distribution across 40+ high-traffic automotive marketplaces.</p>
              </div>
              <div className="flex flex-col gap-unit">
                <span className="font-label-mono text-primary uppercase text-[10px]">Smart Logistics</span>
                <p className="font-body-md text-on-surface-variant">Automated price adjustments based on regional market demand signals.</p>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="absolute right-0 bottom-0 w-3/4 h-2/3 -mr-24 -mb-12 pointer-events-none opacity-40 select-none">
              <div className="w-full h-full rounded-tl-[64px] bg-surface-container-high shadow-2xl transform rotate-3 flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover grayscale opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcN64qzJxul12g8eyr7Rj6yb2dGhWR5a6uIGzlXAA2P-3idsxXlybnUW8ZUKG4AO4lA2hu03lyyrRArFddAxOdkASgQQeNpdT6sdgtcJMgLivga-nhKP3zM1f00fTAiD9ZxuTAMTF7eX7pSP4Cki_GmhQsVDCobpkzqY3Dh23lYk9_k3FVsHkugzjigUA7ZrLhV-pW_T2NPZUXxzcJ508OCRPLVzRXoCe9h0w4KdAWK8t23XsXwGSMGw" alt="Hero Background" />
              </div>
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="flex-1 flex flex-col justify-center items-center px-container-margin py-stack-lg bg-surface relative z-20">
            <div className="w-full max-w-[400px] flex flex-col">
              <div className="mb-stack-lg space-y-unit">
                <span className="font-label-mono text-primary uppercase text-[12px] tracking-widest">Get Started</span>
                <h2 className="font-headline-lg text-on-surface">Create your account</h2>
                <p className="font-body-md text-on-surface-variant">Join the network of top-performing dealerships.</p>
              </div>

              {apiError && (
                <div className="mb-stack-md p-4 rounded-lg bg-error-container text-on-error-container font-body-md border border-error/20 flex items-start gap-3">
                  <span className="material-symbols-outlined text-error shrink-0">error</span>
                  <span>{apiError}</span>
                </div>
              )}

              <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email Input */}
                <div className="flex flex-col gap-unit">
                  <label className="font-label-mono text-on-surface-variant uppercase text-[11px] ml-1" htmlFor="email">Work Email</label>
                  <div className="relative group">
                    <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${errors.email ? 'text-error' : 'text-on-surface-variant group-focus-within:text-primary'}`}>mail</span>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@dealership.com"
                      className={`w-full h-14 pl-12 pr-4 bg-surface-container-high text-on-surface rounded-lg outline-none focus:ring-1 transition-all font-body-md placeholder:text-on-surface-variant/40 ${errors.email ? 'ring-1 ring-error' : 'focus:ring-primary'}`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="font-label-mono text-[10px] text-error ml-1">{errors.email.message}</p>}
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-unit">
                  <label className="font-label-mono text-on-surface-variant uppercase text-[11px] ml-1" htmlFor="password">Create Password</label>
                  <div className="relative group">
                    <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${errors.password ? 'text-error' : 'text-on-surface-variant group-focus-within:text-primary'}`}>lock</span>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className={`w-full h-14 pl-12 pr-12 bg-surface-container-high text-on-surface rounded-lg outline-none focus:ring-1 transition-all font-body-md placeholder:text-on-surface-variant/40 ${errors.password ? 'ring-1 ring-error' : 'focus:ring-primary'}`}
                      {...register('password')}
                    />
                  </div>
                  {errors.password && <p className="font-label-mono text-[10px] text-error ml-1">{errors.password.message}</p>}
                </div>

                <div className="flex items-start gap-stack-sm py-unit">
                  <input id="terms" type="checkbox" className="mt-1 accent-primary" />
                  <label htmlFor="terms" className="font-body-md text-on-surface-variant text-[13px]">
                    I agree to the <a href="#" className="text-on-surface underline hover:text-primary">Terms of Service</a> and <a href="#" className="text-on-surface underline hover:text-primary">Privacy Policy</a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-primary text-on-primary font-headline-md rounded-lg flex items-center justify-center gap-stack-sm hover:opacity-90 active:scale-[0.98] transition-all mt-stack-sm shadow-xl shadow-primary/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Register'}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-stack-lg flex items-center">
                <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
                <span className="px-stack-md font-label-mono text-on-surface-variant text-[10px] uppercase">Trusted by Global Brands</span>
                <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
              </div>

              <div className="text-center">
                <p className="font-body-md text-on-surface-variant">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-semibold hover:underline ml-1">Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
