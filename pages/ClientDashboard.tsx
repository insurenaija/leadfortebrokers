
import React, { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs, addDoc } from '../firebase';
import { useAuth, useToast } from '../App';
import { InsurancePolicy, InsuranceClaim, InsuranceType } from '../types';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Quote Form State
  const [quoteType, setQuoteType] = useState<InsuranceType>('Motor');
  const [planName, setPlanName] = useState('Standard');
  const [premium, setPremium] = useState(50000);

  // Claim Form State
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [claimAmount, setClaimAmount] = useState(0);
  const [claimDesc, setClaimDesc] = useState('');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const pQuery = query(collection(db, "policies"), where("userId", "==", user.uid));
      const pSnap = await getDocs(pQuery);
      setPolicies(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as InsurancePolicy)));

      const cQuery = query(collection(db, "claims"), where("userId", "==", user.uid));
      const cSnap = await getDocs(cQuery);
      setClaims(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as InsuranceClaim)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, "policies"), {
        userId: user.uid,
        userName: user.fullName,
        type: quoteType,
        planName,
        premium,
        status: 'pending',
        startDate: Date.now(),
        expiryDate: Date.now() + 31536000000, // 1 year
        createdAt: Date.now()
      });
      addToast('success', 'Policy application submitted!');
      setShowQuoteModal(false);
      fetchData();
    } catch (err) {
      addToast('error', 'Failed to submit quote');
    }
  };

  const handleFileClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, "claims"), {
        userId: user.uid,
        userName: user.fullName,
        policyId: selectedPolicyId,
        amount: claimAmount,
        description: claimDesc,
        status: 'under-review',
        evidenceUrls: [],
        createdAt: Date.now()
      });
      addToast('success', 'Claim filed successfully!');
      setShowClaimModal(false);
      fetchData();
    } catch (err) {
      addToast('error', 'Failed to file claim');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-primary/5 py-12 mb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, {user?.fullName}</h1>
              <p className="text-gray-500">Manage your active policies and track your claims here.</p>
            </div>
            <div className="flex space-x-3 mt-6 md:mt-0">
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition"
              >
                + New Policy
              </button>
              <button 
                onClick={() => setShowClaimModal(true)}
                className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                File a Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-8">
        {/* Statistics */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Policies</h4>
            <div className="text-4xl font-bold text-gray-900">{policies.filter(p => p.status === 'active').length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending Quotes</h4>
            <div className="text-4xl font-bold text-primary">{policies.filter(p => p.status === 'pending').length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Claims</h4>
            <div className="text-4xl font-bold text-yellow-600">{claims.filter(c => c.status === 'under-review').length}</div>
          </div>
        </div>

        {/* Policies Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">My Policies</h3>
              <button className="text-primary text-sm font-bold">See All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {policies.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No policies found. Get a quote to start!</td></tr>
                  ) : policies.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{p.type === 'Motor' ? '🚗' : p.type === 'Health' ? '🏥' : '🛡️'}</span>
                          <span className="font-semibold">{p.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.planName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'active' ? 'bg-green-100 text-green-700' : 
                          p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">₦{p.premium.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Claims */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-50">
              <h3 className="font-bold text-lg">Recent Claims</h3>
            </div>
            <div className="p-6 space-y-4">
              {claims.length === 0 ? (
                <p className="text-center text-gray-400 py-4">No recent claims.</p>
              ) : claims.slice(0, 5).map(c => (
                <div key={c.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h5 className="font-bold text-sm">₦{c.amount.toLocaleString()}</h5>
                    <p className="text-xs text-gray-500 truncate w-32">{c.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    c.status === 'paid' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowQuoteModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Get a New Quote</h2>
            <form onSubmit={handleGetQuote} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Insurance Type</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={quoteType}
                  onChange={(e) => setQuoteType(e.target.value as InsuranceType)}
                >
                  <option value="Motor">Motor Insurance</option>
                  <option value="Health">Health Insurance</option>
                  <option value="Life">Life Insurance</option>
                  <option value="Travel">Travel Insurance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Plan Details</label>
                <input 
                  type="text" 
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  placeholder="e.g. Comprehensive Silver"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Estimated Premium (₦)</label>
                <input 
                  type="number" 
                  value={premium}
                  onChange={(e) => setPremium(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowClaimModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">File an Incident Claim</h2>
            <form onSubmit={handleFileClaim} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Policy</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={selectedPolicyId}
                  onChange={(e) => setSelectedPolicyId(e.target.value)}
                  required
                >
                  <option value="">Select a policy...</option>
                  {policies.filter(p => p.status === 'active').map(p => (
                    <option key={p.id} value={p.id}>{p.type} - {p.planName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Claim Amount (₦)</label>
                <input 
                  type="number" 
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description of Incident</label>
                <textarea 
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 h-32"
                  placeholder="Tell us what happened..."
                  required
                />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold">File Claim</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
