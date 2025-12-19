import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { auth, db, onAuthStateChanged, doc, getDoc, signOut } from './firebase.ts';
import { UserProfile, ToastMessage } from './types.ts';
import LandingPage from './pages/LandingPage.tsx';
import ClientDashboard from './pages/ClientDashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import LoginModal from './components/LoginModal.tsx';
import SignupModal from './components/SignupModal.tsx';
import Chatbot from './components/Chatbot.tsx';

// --- Auth Context ---
interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refreshUser: async () => {} });

export const useAuth = () => useContext(AuthContext);

// --- UI Context ---
interface UIContextType {
  openLogin: () => void;
  openSignup: () => void;
}

const UIContext = createContext<UIContextType>({ openLogin: () => {}, openSignup: () => {} });

export const useUI = () => useContext(UIContext);

// --- Toast Context ---
interface ToastContextType {
  addToast: (type: ToastMessage['type'], message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export const useToast = () => useContext(ToastContext);

// --- Layout Wrapper ---
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { openLogin, openSignup } = useUI();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass sticky top-0 z-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">L</div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">Leadforte<span className="text-primary">.</span></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <a href="#features" className="hover:text-primary transition">Services</a>
            <a href="#how-it-works" className="hover:text-primary transition">How it Works</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-sm font-semibold text-primary hover:underline">
                  My Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={openLogin}
                  className="text-gray-700 font-semibold px-4 py-2 text-sm hover:text-primary transition"
                >
                  Sign In
                </button>
                <button 
                  onClick={openSignup}
                  className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl">L</div>
          </div>
          <h3 className="text-xl font-bold mb-4">Leadforte Insurance Brokers Ltd.</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Providing reliable, transparent, and high-quality insurance brokerage services across Nigeria. Your protection, our priority.
          </p>
          <div className="border-t border-gray-800 pt-8 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Leadforte Brokers. All rights reserved. Registered in Nigeria.
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => { setShowLogin(true); setShowSignup(false); };
  const openSignup = () => { setShowSignup(true); setShowLogin(false); };

  return (
    <UIContext.Provider value={{ openLogin, openSignup }}>
      {children}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchToSignup={openSignup} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSwitchToLogin={openLogin} />}
    </UIContext.Provider>
  );
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col space-y-3">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`${
              toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-primary'
            } text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 transform transition-all duration-300 animate-bounce-in`}
          >
            <span>{toast.message}</span>
            <button onClick={() => setToasts(t => t.filter(x => x.id !== toast.id))} className="text-white/70 hover:text-white">&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data() as UserProfile);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) await fetchUserProfile(auth.currentUser.uid);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      <ToastProvider>
        <UIProvider>
          <HashRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route 
                  path="/dashboard" 
                  element={user ? (user.role === 'client' ? <ClientDashboard /> : <Navigate to="/admin" />) : <Navigate to="/" />} 
                />
                <Route 
                  path="/admin" 
                  element={user ? (user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />) : <Navigate to="/" />} 
                />
              </Routes>
            </AppLayout>
          </HashRouter>
        </UIProvider>
      </ToastProvider>
    </AuthContext.Provider>
  );
}