import { Contract, ContractStatus, RiskLevel } from "../types";

// Ollama API Endpunkt - in Docker verwenden wir host.docker.internal
const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "gpt-oss:120b";

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

// Helper to convert file to text (for text-based documents)
export const fileToText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export const analyzeContractWithOllama = async (file: File): Promise<Partial<Contract>> => {
  // Für Text-Dateien den Inhalt direkt lesen
  let fileContent = "";
  
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    fileContent = await fileToText(file);
  } else if (file.type === "application/pdf") {
    // Für PDFs: Base64 senden (Ollama mit Vision-Modell) oder Hinweis geben
    // gpt-oss:120b ist ein Text-Modell, daher können wir PDFs nicht direkt verarbeiten
    // Wir informieren den User
    throw new Error("PDF-Dateien werden aktuell nicht unterstützt. Bitte laden Sie eine Text-Datei (.txt) hoch oder kopieren Sie den Vertragstext.");
  } else {
    // Versuche als Text zu lesen
    try {
      fileContent = await fileToText(file);
    } catch {
      throw new Error(`Dateityp ${file.type} wird nicht unterstützt.`);
    }
  }

  const prompt = `Du bist ein Vertragsanalyse-Experte. Analysiere den folgenden Vertragstext und extrahiere die Metadaten.

WICHTIG: Antworte NUR mit einem gültigen JSON-Objekt, ohne zusätzlichen Text oder Markdown.

Das JSON muss folgende Struktur haben:
{
  "title": "Kurzer beschreibender Titel des Vertrags",
  "partnerName": "Name des Vertragspartners (Firma/Person)",
  "category": "Kategorie (z.B. Dienstleistung, Mietvertrag, NDA, Lizenz, Arbeitsvertrag)",
  "value": 0,
  "currency": "EUR",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD oder null wenn unbefristet",
  "noticePeriod": "Kündigungsfrist (z.B. 3 Monate zum Jahresende)",
  "riskLevel": "Niedrig|Mittel|Hoch|Unbekannt",
  "summary": "Kurze Zusammenfassung des Vertragsinhalts (max 2 Sätze)",
  "tags": ["tag1", "tag2"]
}

Regeln für riskLevel:
- "Hoch": Mehrdeutige Klauseln, automatische Verlängerungen > 1 Jahr, unbegrenzte Haftung
- "Mittel": Standardrisiken, normale Vertragsbedingungen
- "Niedrig": Standardverträge ohne besondere Risiken
- "Unbekannt": Wenn nicht bestimmbar

VERTRAGSTEXT:
${fileContent}

JSON:`;

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1, // Niedrige Temperatur für konsistentere JSON-Ausgabe
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API Fehler: ${response.status} ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    
    if (!data.response) {
      throw new Error("Keine Antwort von Ollama erhalten.");
    }

    // JSON aus der Antwort extrahieren
    let jsonText = data.response.trim();
    
    // Falls die Antwort in Markdown-Code-Blöcken ist, extrahiere das JSON
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }
    
    // Versuche JSON zu parsen
    const extractedData = JSON.parse(jsonText);
    
    // Status basierend auf Daten ableiten
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
    console.error("Error analyzing contract with Ollama:", error);
    throw error;
  }
};

// Export als Default für einfache Migration
export const analyzeContract = analyzeContractWithOllama;


