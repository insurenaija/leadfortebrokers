
import React, { useState } from 'react';

interface CalculatorModalProps {
  onClose: () => void;
}

const CalculatorModal: React.FC<CalculatorModalProps> = ({ onClose }) => {
  const [type, setType] = useState('Motor');
  const [value, setValue] = useState(2500000); // 2.5M Naira
  const [duration, setDuration] = useState(1);

  const calculatePremium = () => {
    let base = 0;
    if (type === 'Motor') base = value * 0.035; // 3.5%
    else if (type === 'Health') base = 45000 * duration;
    else if (type === 'Life') base = (value * 0.01) + 5000;
    return Math.round(base);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
        
        <h2 className="text-3xl font-extrabold mb-2">Premium Estimator</h2>
        <p className="text-gray-500 mb-8">Quickly calculate your insurance costs.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Insurance Category</label>
            <div className="grid grid-cols-3 gap-2">
              {['Motor', 'Health', 'Life'].map(t => (
                <button 
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-3 rounded-2xl text-sm font-bold border transition ${type === t ? 'bg-primary border-primary text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {type === 'Motor' ? 'Vehicle Value (₦)' : type === 'Health' ? 'Family Size' : 'Sum Assured (₦)'}
            </label>
            <input 
              type="number" 
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-lg"
            />
          </div>

          <div className="bg-primary/5 p-8 rounded-3xl text-center border border-primary/10">
            <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-widest">Estimated Annual Premium</p>
            <div className="text-4xl font-black text-primary">₦{calculatePremium().toLocaleString()}</div>
            <p className="text-[10px] text-gray-400 mt-2">*Final premium subject to brokerage review and carrier assessment.</p>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorModal;
