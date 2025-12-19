import { GoogleGenAI } from "@google/genai";

// For static hosting, we rely on the injected process.env.API_KEY or a hardcoded fallback if specifically provided
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "AIzaSyADMClAH6puWwBB95lKPACrlOlzBxNoTw4" });

export const getInsuranceAdvice = async (history: { role: string; content: string }[], userInput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: `You are the Leadforte Insurance Assistant. 
        Your tone is professional, helpful, and friendly. 
        You specialize in Nigerian insurance markets (Motor, Health, Life, Travel). 
        
        FAQ KNOWLEDGE BASE:
        1. Motor Insurance: We offer Comprehensive (covers damage to your car and others) and Third-Party (legal minimum, covers others only).
        2. Pricing: Competitive rates starting as low as ₦5,000 for basic 3rd party. Comprehensive depends on vehicle value (approx 3.5%).
        3. E-Certificates: Issued instantly upon payment and document verification.
        4. Claims: Must be filed within 48 hours of an incident. Evidence (photos/police report) is required.
        5. Payment: We accept bank transfers, card payments (Paystack/Flutterwave), and USSD.
        6. Contact: If technical or immediate purchase needed, suggest WhatsApp handoff (+234 787 166 433 610).
        
        Always explain complex jargon simply. 
        Use Naira (₦) for all currency mentions.
        Based in Lagos, Nigeria.`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having a bit of trouble connecting to my knowledge base. Please try again or contact our support team on WhatsApp.";
  }
};