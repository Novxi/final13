import { GoogleGenAI } from "@google/genai";

export const generateSolarAdvice = async (userQuestion: string): Promise<string> => {
    // Initialize GoogleGenAI with the API key directly from process.env as per strict guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: userQuestion,
            config: {
                systemInstruction: `Sen North Enerji şirketinin gelişmiş yapay zeka asistanı 'North AI'sın. 
                Görevin: Potansiyel müşterilere güneş enerjisi, elektrikli araç şarjı ve depolama sistemleri hakkında kısa, güven verici ve teknik olarak doğru bilgiler vermek.
                Ton: Profesyonel, fütüristik, yardımsever, Türkçe, 'Sen' dili.
                Şirket Bilgileri: North Enerji, premium solar çözümler sunar.
                Cevapların 2-3 cümleyi geçmesin. Müşteriyi her zaman 'Teklif Al' formuna yönlendirmeye çalış.`,
                temperature: 0.7,
            }
        });
        return response.text || "Şu an cevap oluşturulamadı.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Bağlantı hatası oluştu, lütfen daha sonra tekrar deneyin.";
    }
};