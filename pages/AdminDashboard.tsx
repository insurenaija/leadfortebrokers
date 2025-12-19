
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, updateDoc, doc } from '../firebase';
import { useAuth, useToast } from '../App';
import { InsurancePolicy, InsuranceClaim, PolicyStatus, ClaimStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [activeTab, setActiveTab] = useState<'policies' | 'claims'>('policies');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pSnap = await getDocs(collection(db, "policies"));
      setPolicies(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as InsurancePolicy)));

      const cSnap = await getDocs(collection(db, "claims"));
      setClaims(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as InsuranceClaim)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePolicyStatus = async (id: string, status: PolicyStatus) => {
    try {
      await updateDoc(doc(db, "policies", id), { status });
      addToast('success', `Policy ${status}!`);
      fetchData();
    } catch (err) {
      addToast('error', 'Failed to update policy');
    }
  };

  const updateClaimStatus = async (id: string, status: ClaimStatus) => {
    try {
      await updateDoc(doc(db, "claims", id), { status });
      addToast('success', `Claim ${status}!`);
      fetchData();
    } catch (err) {
      addToast('error', 'Failed to update claim');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-primary py-12 mb-8 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Brokerage Command Center</h1>
          <p className="text-white/80">Manage Nigeria's premium insurance portfolio with real-time approvals.</p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex space-x-1 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 max-w-md mb-8">
          <button 
            onClick={() => setActiveTab('policies')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition ${activeTab === 'policies' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Policy Requests ({policies.filter(p => p.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('claims')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition ${activeTab === 'claims' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Claim Requests ({claims.filter(c => c.status === 'under-review').length})
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'policies' ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Client</th>
                    <th className="px-8 py-5">Insurance</th>
                    <th className="px-8 py-5">Premium</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {policies.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900">{p.userName}</div>
                        <div className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-semibold text-primary">{p.type}</div>
                        <div className="text-xs text-gray-500">{p.planName}</div>
                      </td>
                      <td className="px-8 py-6 font-bold">₦{p.premium.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          p.status === 'active' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        {p.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updatePolicyStatus(p.id, 'active')}
                              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updatePolicyStatus(p.id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Client</th>
                    <th className="px-8 py-5">Description</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {claims.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-8 py-6 font-bold">{c.userName}</td>
                      <td className="px-8 py-6 text-sm text-gray-600 italic">"{c.description}"</td>
                      <td className="px-8 py-6 font-bold text-red-600">₦{c.amount.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          c.status === 'paid' ? 'bg-green-600 text-white' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        {c.status === 'under-review' && (
                          <>
                            <button 
                              onClick={() => updateClaimStatus(c.id, 'paid')}
                              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700"
                            >
                              Settle
                            </button>
                            <button 
                              onClick={() => updateClaimStatus(c.id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                            >
                              Deny
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
