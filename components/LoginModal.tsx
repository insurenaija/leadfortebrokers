
import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../firebase';
import { useToast } from '../App';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addToast('success', 'Logged in successfully!');
      onClose();
      // Redirect handled by App router based on role
    } catch (error: any) {
      addToast('error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const setTestCreds = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-float">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Enter your details to access your account.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account? <button onClick={onSwitchToSignup} className="text-primary font-bold hover:underline">Create Account</button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Test Credentials</p>
          <div className="flex space-x-2">
            <button onClick={() => setTestCreds('client@leadforte.com', 'password123')} className="flex-1 text-[10px] bg-gray-50 hover:bg-gray-100 py-2 rounded border border-gray-200 text-gray-600">Client Demo</button>
            <button onClick={() => setTestCreds('admin@leadforte.com', 'adminpass')} className="flex-1 text-[10px] bg-gray-50 hover:bg-gray-100 py-2 rounded border border-gray-200 text-gray-600">Admin Demo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
