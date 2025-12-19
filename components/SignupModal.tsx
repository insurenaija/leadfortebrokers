
import React, { useState } from 'react';
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../firebase';
import { useToast } from '../App';
import { UserRole } from '../types';

interface SignupModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        fullName,
        role,
        createdAt: Date.now()
      });

      addToast('success', 'Account created successfully!');
      onClose();
    } catch (error: any) {
      addToast('error', error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-float">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-3xl font-bold mb-2">Join Leadforte</h2>
        <p className="text-gray-500 mb-8">Start your journey to better coverage today.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setRole('client')}
                className={`py-2 px-4 rounded-lg border text-sm font-semibold transition ${role === 'client' ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-500'}`}
              >
                Client
              </button>
              <button 
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-4 rounded-lg border text-sm font-semibold transition ${role === 'admin' ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-500'}`}
              >
                Broker (Admin)
              </button>
            </div>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 mt-2 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account? <button onClick={onSwitchToLogin} className="text-primary font-bold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
