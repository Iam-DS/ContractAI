import { 
  Contract, 
  ContractStatus, 
  ContractType, 
  ContractCategory,
  CONTRACT_TYPE_TO_CATEGORY 
} from "../types";

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

// Alle erlaubten Vertragstypen als String-Liste für den Prompt
const ALLOWED_CONTRACT_TYPES = Object.values(ContractType);

// Validierung und Mapping des Vertragstyps
const validateAndMapContractType = (rawType: string): ContractType => {
  // Exakte Übereinstimmung prüfen
  const exactMatch = ALLOWED_CONTRACT_TYPES.find(
    t => t.toLowerCase() === rawType.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // Fuzzy-Matching für häufige Varianten
  const normalizedInput = rawType.toLowerCase().trim();
  
  // Mapping-Tabelle für Varianten
  const variants: Record<string, ContractType> = {
    'it-dienstleistung': ContractType.IT_VERTRAG,
    'it dienstleistung': ContractType.IT_VERTRAG,
    'it-dienstleistungsvertrag': ContractType.IT_VERTRAG,
    'softwarevertrag': ContractType.IT_VERTRAG,
    'lizenzvertrag': ContractType.IT_VERTRAG,
    'dienstleistungsvertrag': ContractType.BERATUNGSVERTRAG,
    'dienstvertrag': ContractType.BERATUNGSVERTRAG,
    'servicevertrag': ContractType.WARTUNGSVERTRAG_BAU,
    'service': ContractType.WARTUNGSVERTRAG_BAU,
    'miete': ContractType.MIETVERTRAG,
    'miet': ContractType.MIETVERTRAG,
    'pacht': ContractType.PACHTVERTRAG,
    'arbeit': ContractType.ARBEITSVERTRAG,
    'anstellung': ContractType.ARBEITSVERTRAG,
    'anstellungsvertrag': ContractType.ARBEITSVERTRAG,
    'kauf': ContractType.KAUFVERTRAG,
    'lieferung': ContractType.LIEFERVERTRAG,
    'leasing': ContractType.LEASINGVERTRAG,
    'versicherung': ContractType.VERSICHERUNGSVERTRAG,
    'darlehen': ContractType.DARLEHENSVERTRAG,
    'kredit': ContractType.DARLEHENSVERTRAG,
    'kreditvertrag': ContractType.DARLEHENSVERTRAG,
    'nda': ContractType.BERATUNGSVERTRAG,
    'geheimhaltung': ContractType.BERATUNGSVERTRAG,
    'geheimhaltungsvertrag': ContractType.BERATUNGSVERTRAG,
    'werk': ContractType.WERKVERTRAG,
    'bauvertrag': ContractType.VOB_B_VERTRAG,
    'bau': ContractType.VOB_B_VERTRAG,
    'vob': ContractType.VOB_B_VERTRAG,
    'rahmen': ContractType.RAHMENVERTRAG,
    'makler': ContractType.MAKLERVERTRAG,
    'hausverwaltung': ContractType.HAUSVERWALTUNGSVERTRAG,
    'hausmeister': ContractType.HAUSMEISTERVERTRAG,
    'reinigung': ContractType.REINIGUNGSVERTRAG,
    'gesellschaft': ContractType.GESELLSCHAFTSVERTRAG,
    'gmbh': ContractType.GESELLSCHAFTSVERTRAG,
    'wartung': ContractType.WARTUNGSVERTRAG_BAU,
    'subunternehmer': ContractType.SUBUNTERNEHMERVERTRAG,
    'beratung': ContractType.BERATUNGSVERTRAG,
    'consulting': ContractType.BERATUNGSVERTRAG,
  };

  // Suche nach Teilübereinstimmung
  for (const [variant, type] of Object.entries(variants)) {
    if (normalizedInput.includes(variant)) {
      return type;
    }
  }

  // Fallback
  return ContractType.SONSTIGER;
};

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
  "contractType": "Einer der erlaubten Vertragstypen (siehe Liste unten)",
  "value": 0,
  "currency": "EUR",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD oder null wenn unbefristet",
  "noticePeriod": "Kündigungsfrist (z.B. 3 Monate zum Jahresende)",
  "riskLevel": "Niedrig|Mittel|Hoch|Unbekannt",
  "summary": "Kurze Zusammenfassung des Vertragsinhalts (max 2 Sätze)",
  "tags": ["tag1", "tag2"]
}

ERLAUBTE VERTRAGSTYPEN (wähle den passendsten):

Kunden & Bauprojekte:
- Werkvertrag (Herstellung eines Werkes)
- Wartungsvertrag (Wartung/Instandhaltung für Kunden)
- Rahmenvertrag (Langfristige Geschäftsbeziehung)
- VOB/B-Vertrag (Bauverträge nach VOB)

Personal & Dienstleister:
- Arbeitsvertrag (Anstellung von Mitarbeitern)
- Tarifvertrag (Kollektive Arbeitsbedingungen)
- Subunternehmervertrag (Werk/Dienstleistung durch Subunternehmer)
- Beratungsvertrag (Beratungsdienstleistungen)
- IT-Vertrag (Software, IT-Dienstleistungen, Lizenzen)

Lieferanten & Einkauf:
- Kaufvertrag (Einmaliger Kauf von Waren)
- Liefervertrag (Regelmäßige Lieferung von Waren)
- Rahmenliefervertrag (Langfristiger Liefervertrag)
- Leasingvertrag (Leasing von Gegenständen)
- Mietvertrag Maschinen (Anmietung von Maschinen/Geräten)
- Wartungsvertrag Fuhrpark (Wartung von Fahrzeugen)

Immobilien:
- Mietvertrag (Anmietung von Immobilien/Räumen)
- Pachtvertrag (Pacht von Grundstücken/Betrieben)
- Hausverwaltungsvertrag (Verwaltung von Immobilien)
- Maklervertrag (Immobilienvermittlung)
- Hausmeistervertrag (Hausmeisterservice)
- Reinigungsvertrag (Gebäudereinigung)

Finanzen & Versicherungen:
- Darlehensvertrag (Kredite, Darlehen)
- Kontovertrag (Bankkonten)
- Bürgschaft (Bürgschaftsvereinbarungen)
- Bankaval (Bankgarantien)
- Versicherungsvertrag (Alle Arten von Versicherungen)
- Gesellschaftsvertrag (GmbH, GbR, etc.)

Falls kein Typ passt: "Sonstiger Vertrag"

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
    
    // Vertragstyp validieren und mappen
    const contractType = validateAndMapContractType(
      extractedData.contractType || extractedData.category || 'Sonstiger Vertrag'
    );
    
    // Hauptkategorie aus dem Vertragstyp ableiten
    const category = CONTRACT_TYPE_TO_CATEGORY[contractType];
    
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
      title: extractedData.title,
      partnerName: extractedData.partnerName,
      category: category,
      contractType: contractType,
      value: extractedData.value || 0,
      currency: extractedData.currency || 'EUR',
      startDate: extractedData.startDate,
      endDate: extractedData.endDate,
      noticePeriod: extractedData.noticePeriod || 'Nicht angegeben',
      riskLevel: extractedData.riskLevel,
      summary: extractedData.summary,
      tags: extractedData.tags || [],
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
