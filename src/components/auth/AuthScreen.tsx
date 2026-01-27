import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useStore } from '@/stores/useStore';

type AuthMode = 'login' | 'signup' | 'forgot';

export function AuthScreen() {
  const { setUser } = useStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo, just set a user
    setUser({
      id: 'demo-user',
      email: formData.email || 'demo@example.com',
      name: formData.name || 'Demo User',
      created_at: new Date().toISOString(),
      goals: {
        calories: 2500,
        protein: 150,
        carbs: 275,
        fat: 70,
        water: 8,
      },
      preferences: {
        theme: 'light',
        notifications: true,
        units: 'metric',
        startOfWeek: 1,
      },
    });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-12">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Flame className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">CalorieTracker</h1>
        <p className="text-text-secondary mt-1">Smart food logging with AI</p>
      </motion.div>

      {/* Auth Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-secondary'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-secondary'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-12 pr-12 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-sm text-accent font-medium"
                >
                  Forgot password?
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-accent text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' && 'Log In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Reset Password'}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Social Login */}
          {mode !== 'forgot' && (
            <>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-text-tertiary text-sm">or continue with</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex gap-3">
                <SocialButton provider="google" />
                <SocialButton provider="apple" />
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-text-secondary mt-4"
            >
              Back to login
            </button>
          )}
        </div>

        {/* Terms */}
        <p className="text-center text-text-tertiary text-xs mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-accent">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-accent">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
}

function SocialButton({ provider }: { provider: 'google' | 'apple' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-1 py-3 bg-surface rounded-xl flex items-center justify-center gap-2 font-medium text-text-primary"
    >
      {provider === 'google' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {provider === 'apple' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      )}
      <span className="capitalize">{provider}</span>
    </motion.button>
  );
}
