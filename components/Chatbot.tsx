
import React, { useState, useRef, useEffect } from 'react';
import { getInsuranceAdvice } from '../geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your Leadforte Assistant. How can I help you with your insurance today? You can type a question or use the FAQs below." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customInput?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const messageToSend = customInput || input;
    if (!messageToSend.trim() || loading) return;

    const userMessage = messageToSend.trim();
    if (!customInput) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const aiResponse = await getInsuranceAdvice(history, userMessage);

    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setLoading(false);
  };

  const faqs = [
    { label: "🚗 Motor Quote", query: "Tell me about Motor insurance and pricing." },
    { label: "📑 Claims Process", query: "How do I file an insurance claim?" },
    { label: "💳 Payment Methods", query: "What payment methods do you accept for premiums?" },
    { label: "📜 E-Certificates", query: "How soon do I get my digital insurance certificate?" },
    { label: "🏥 Health Plans", query: "What are the benefits of your health insurance plans?" },
    { label: "🛡️ 3rd Party vs Comp", query: "Difference between Third-Party and Comprehensive motor insurance?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end">
      {isOpen && (
        <div className="w-80 md:w-96 h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-100 animate-fade-in-up">
          <div className="bg-primary p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl border border-white/30">L</div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></div>
              </div>
              <div>
                <h4 className="font-bold tracking-tight">Leadforte AI</h4>
                <p className="text-[10px] text-white/80 uppercase tracking-widest font-black">24/7 Expert Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-primary/70 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <div className="mb-4">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Quick Questions (FAQs)</p>
               <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                {faqs.map((faq, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(faq.query)}
                    className="whitespace-nowrap bg-gray-50 hover:bg-primary/5 hover:text-primary hover:border-primary/20 border border-gray-100 text-gray-600 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    {faq.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={(e) => handleSend(undefined, e)} className="flex items-center space-x-2">
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>
              <div className="flex space-x-2">
                <a 
                  href="https://wa.me/234787166433610" 
                  target="_blank" 
                  className="bg-green-500 text-white p-3 rounded-2xl hover:bg-green-600 transition shadow-lg shadow-green-500/20"
                  title="Talk to an Agent on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
                <button type="submit" className="bg-primary text-white p-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-primary/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 relative group"
      >
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 group-hover:hidden"></div>
        <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
      </button>
    </div>
  );
};

export default Chatbot;
