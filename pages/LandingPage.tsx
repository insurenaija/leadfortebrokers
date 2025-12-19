import React, { useState, useEffect } from 'react';
import CalculatorModal from '../components/CalculatorModal.tsx';
import { useUI } from '../App.tsx';

const LandingPage: React.FC = () => {
  const { openSignup } = useUI();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [activeAd, setActiveAd] = useState(0);

  const features = [
    { title: 'Motor Insurance', desc: 'Comprehensive or Third-Party cover for private and commercial vehicles.', icon: '🚗' },
    { title: 'Health Plans', desc: 'Protect your family with premium medical care at top-tier hospitals.', icon: '🏥' },
    { title: 'Life Cover', desc: 'Secure the future of your loved ones with guaranteed payouts.', icon: '🛡️' },
    { title: 'Travel Protection', desc: 'Worry-free journeys with international medical and baggage cover.', icon: '✈️' },
  ];

  const steps = [
    { step: '01', title: 'Compare', text: 'Browse quotes from 15+ top insurance carriers in Nigeria instantly.' },
    { step: '02', title: 'Verify', text: 'Upload your documents securely through our automated KYC portal.' },
    { step: '03', title: 'Cover', text: 'Receive your e-certificate instantly upon payment verification.' },
  ];

  const testimonials = [
    { name: 'Olamide Adeleke', role: 'Fleet Manager', text: 'Leadforte transformed our logistics operations with instant motor policies.', icon: '👤' },
    { name: 'Chisom Eze', role: 'Business Owner', text: 'The AI assistant helped me understand the fine print of my life insurance plan.', icon: '👩‍💼' },
    { name: 'Fatima Mohammed', role: 'HR Director', text: 'The group health plans are the best we have ever used for our employees in Lagos.', icon: '💼' },
  ];

  const adProducts = [
    { name: 'Leadforte Auto+', tag: 'Best Seller', text: 'Premium roadside assistance included.', color: 'bg-rose-500' },
    { name: 'Family Guard', tag: 'New', text: 'Covers up to 6 family members.', color: 'bg-blue-600' },
    { name: 'Travel Safe', tag: 'Limited', text: 'Zero excess on medical claims.', color: 'bg-emerald-600' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setActiveAd((prev) => (prev + 1) % adProducts.length);
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length, steps.length, adProducts.length]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 bg-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 text-center md:text-left">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full mb-6">#1 Brokerage in Nigeria</span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-gray-900 mb-6">
              Insurance that <span className="text-primary underline decoration-primary/20">Works</span> for You.
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto md:mx-0">
              Leadforte provides high-end, responsive, and secure insurance solutions tailored for the unique needs of the Nigerian market.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <button onClick={openSignup} className="bg-primary text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition active:scale-95">Get Started</button>
              <button onClick={() => setShowCalculator(true)} className="bg-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-bold hover:bg-gray-200 transition">Estimate Premium</button>
            </div>
          </div>
          
          <div className="relative flex justify-center items-center">
            <div className="relative z-10 w-full max-w-sm md:max-w-md aspect-square bg-gray-50 rounded-[4rem] flex items-center justify-center shadow-inner animate-float border-2 border-primary/5">
              <div className="text-9xl">🛡️</div>
              {/* Floating Mini Icons */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-white shadow-2xl rounded-3xl flex items-center justify-center text-4xl animate-float" style={{animationDelay: '0.2s'}}>🚗</div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-white shadow-2xl rounded-[2rem] flex items-center justify-center text-5xl animate-float" style={{animationDelay: '0.7s'}}>🏥</div>
              <div className="absolute top-1/2 -left-10 w-16 h-16 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-3xl animate-float" style={{animationDelay: '1.2s'}}>✈️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold mb-4">Our Core Services</h2>
            <p className="text-gray-500 font-medium">Tailored insurance solutions designed to fit your lifestyle and business requirements.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
                <div className="text-4xl mb-6 bg-gray-50 w-20 h-20 flex items-center justify-center rounded-[1.5rem] group-hover:bg-primary/10 transition duration-500">{f.icon}</div>
                <h3 className="text-xl font-extrabold mb-4">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">{f.desc}</p>
                <button 
                  onClick={openSignup}
                  className="w-full py-3 px-6 bg-gray-50 text-gray-900 group-hover:bg-primary group-hover:text-white rounded-2xl font-bold text-sm transition-colors duration-500"
                >
                  Get Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (White Background Auto-Slide Carousel) */}
      <section id="how-it-works" className="py-24 bg-white border-y border-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-900">How It Works</h2>
            <p className="text-gray-500 font-medium">Get covered in 3 simple steps without the paperwork hassle.</p>
          </div>
          
          <div className="max-w-4xl mx-auto relative h-[300px] flex items-center justify-center">
            {steps.map((s, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 transition-all duration-1000 transform flex flex-col items-center justify-center text-center px-10 ${i === currentStep ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <div className="bg-primary text-white text-2xl font-black w-20 h-20 flex items-center justify-center rounded-3xl mb-8 shadow-2xl shadow-primary/30">
                  {s.step}
                </div>
                <h3 className="text-3xl font-extrabold mb-4 text-gray-900">{s.title}</h3>
                <p className="text-lg text-gray-500 max-w-xl font-medium leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3 mt-8">
            {steps.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'bg-primary w-12' : 'bg-gray-200 w-2'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gray-50/50 py-20 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div><h4 className="text-5xl font-black text-gray-900 mb-2">99%</h4><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Claims Paid</p></div>
            <div><h4 className="text-5xl font-black text-gray-900 mb-2">24h</h4><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fast Issuance</p></div>
            <div><h4 className="text-5xl font-black text-gray-900 mb-2">₦50B</h4><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Protected</p></div>
            <div><h4 className="text-5xl font-black text-gray-900 mb-2">15+</h4><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Partners</p></div>
          </div>
        </div>
      </section>

      {/* Testimonials (Auto Slide Carousel) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-extrabold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="relative h-64 overflow-hidden">
            {testimonials.map((t, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 transition-all duration-1000 transform flex flex-col items-center justify-center text-center ${i === currentTestimonial ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}
              >
                <div className="text-6xl mb-6 bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center shadow-sm border border-gray-100">{t.icon}</div>
                <p className="text-2xl font-medium text-gray-800 mb-8 max-w-2xl italic leading-relaxed">"{t.text}"</p>
                <h5 className="font-black text-primary uppercase tracking-widest text-sm">{t.name}</h5>
                <p className="text-xs text-gray-400 font-bold">{t.role}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentTestimonial(i)}
                className={`w-3 h-1.5 rounded-full transition-all duration-300 ${i === currentTestimonial ? 'bg-primary w-8' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA (Ready to Secure Your Future - White Background) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-gray-50 rounded-[4rem] p-12 md:p-20 text-gray-900 relative shadow-2xl shadow-gray-100/50 border border-gray-100 grid lg:grid-cols-2 gap-12 items-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to secure your future?</h2>
              <p className="text-gray-500 text-lg mb-12 font-medium leading-relaxed">Join thousands of Nigerians who trust Leadforte for their insurance needs. Fast, reliable, and digital-first. Your safety is our standard.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button onClick={openSignup} className="bg-primary text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all active:scale-95">Get Started Now</button>
                <button 
                  onClick={() => setShowCalculator(true)}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-900 px-10 py-5 rounded-2xl font-bold transition flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <span>Premium Calculator</span>
                </button>
              </div>
            </div>

            <div className="relative z-10 bg-white rounded-[3rem] p-8 border border-gray-100 min-h-[300px] flex flex-col justify-center overflow-hidden shadow-inner">
               <div className="mb-6 flex justify-between items-center">
                 <span className="text-xs font-black uppercase tracking-widest text-primary">Live Product Spotlight</span>
                 <div className="flex space-x-1">
                   {adProducts.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeAd ? 'bg-primary' : 'bg-gray-300'}`}></div>)}
                 </div>
               </div>
               
               <div className="relative h-40">
                 {adProducts.map((ad, i) => (
                   <div key={i} className={`absolute inset-0 transition-all duration-700 flex flex-col justify-center ${i === activeAd ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-2 pointer-events-none'}`}>
                     <span className={`inline-block w-fit px-3 py-1 rounded-full text-[10px] font-bold text-white mb-4 ${ad.color}`}>{ad.tag}</span>
                     <h4 className="text-4xl font-black mb-2 text-gray-900">{ad.name}</h4>
                     <p className="text-gray-500 font-medium">{ad.text}</p>
                   </div>
                 ))}
               </div>
               
               <div className="mt-8 pt-8 border-t border-gray-200 flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">✨</div>
                 <p className="text-xs text-gray-500 font-medium">Customized policies updated every hour based on market rates.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {showCalculator && <CalculatorModal onClose={() => setShowCalculator(false)} />}
    </div>
  );
};

export default LandingPage;