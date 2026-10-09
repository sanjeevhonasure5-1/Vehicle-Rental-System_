import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/signin', // Redirect back to sign in after reset
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset instructions have been sent to your email.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center">
          {isResetting ? 'Reset Password' : 'Welcome Back to DriveGo'}
        </h2>
        
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        {message && <p className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</p>}

        {!isResetting ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button 
                  type="button" 
                  onClick={() => setIsResetting(true)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
                >
                  Forgot password?
                </button>
              </div>
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <p className="text-sm text-gray-600 mb-2">
              Enter your account email address, and we will send you a link to reset your password.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Send Reset Link
            </button>
            <button 
              type="button" 
              onClick={() => setIsResetting(false)}
              className="w-full text-center text-sm text-gray-600 hover:text-slate-900 font-medium mt-2"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {!isResetting && (
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <Link to="/signup" className="text-slate-900 font-semibold hover:underline">Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
}