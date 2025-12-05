import { GoogleGenAI, Type } from "@google/genai";
import { Contract, ContractStatus, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const analyzeContractWithGemini = async (file: File): Promise<Partial<Contract>> => {
  const base64Data = await fileToBase64(file);
  const mimeType = file.type;

  const modelId = "gemini-2.5-flash"; // Efficient for text extraction

  const prompt = `
    Analysiere das angehängte Vertragsdokument. Extrahiere die folgenden Metadaten so präzise wie möglich.
    
    Kontext:
    - Wir benötigen eine automatische Klassifizierung.
    - RiskLevel: 'Hoch' wenn Klauseln mehrdeutig sind, automatische Verlängerungen > 1 Jahr existieren oder Haftung unbegrenzt ist. 'Mittel' bei Standardrisiken. 'Niedrig' bei Standardverträgen.
    - Zusammenfassung: Eine kurze Zusammenfassung des Vertragsgegenstands (max 2 Sätze).
    - Status: Setze auf 'Aktiv', wenn das aktuelle Datum zwischen Start und Ende liegt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Ein kurzer, beschreibender Titel für den Vertrag" },
            partnerName: { type: Type.STRING, description: "Name des Vertragspartners (Firma/Person)" },
            category: { type: Type.STRING, description: "Kategorie (z.B. Dienstleistung, Mietvertrag, NDA, Lizenz)" },
            value: { type: Type.NUMBER, description: "Gesamtwert des Vertrags (Jahreswert oder Gesamtsumme). 0 wenn unbekannt." },
            currency: { type: Type.STRING, description: "Währungscode (EUR, USD, etc.)" },
            startDate: { type: Type.STRING, description: "Startdatum im Format YYYY-MM-DD" },
            endDate: { type: Type.STRING, description: "Enddatum im Format YYYY-MM-DD (null wenn unbefristet)", nullable: true },
            noticePeriod: { type: Type.STRING, description: "Kündigungsfrist (z.B. '3 Monate zum Jahresende')" },
            riskLevel: { type: Type.STRING, enum: ["Niedrig", "Mittel", "Hoch", "Unbekannt"] },
            summary: { type: Type.STRING, description: "Kurze Zusammenfassung des Inhalts" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevante Schlagworte" }
          },
          required: ["title", "partnerName", "category", "riskLevel", "summary"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Keine Antwort von Gemini erhalten.");

    const extractedData = JSON.parse(jsonText);
    
    // Mapping internal Logic for Status based on dates
    let derivedStatus = ContractStatus.ACTIVE;
    const now = new Date();
    const end = extractedData.endDate ? new Date(extractedData.endDate) : null;
    
    if (end && end < now) {
      derivedStatus = ContractStatus.EXPIRED;
    } else if (end) {
      const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (daysUntilEnd <= 90) {
        derivedStatus = ContractStatus.EXPIRING_SOON;
      }
    }

    return {
      ...extractedData,
      status: derivedStatus,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error("Error analyzing contract:", error);
    throw error;
  }
};
