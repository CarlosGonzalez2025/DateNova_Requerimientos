import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

// Initialize the client safely
const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const generateSuggestion = async (
  context: string,
  currentInput: string,
  section: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    console.warn("API Key not found. Skipping AI generation.");
    return "Clave API no configurada. No se puede generar sugerencia.";
  }

  try {
    const prompt = `
      Actúa como un Arquitecto de Software Senior y Product Owner.
      Estoy llenando una matriz de descubrimiento para un nuevo proyecto de software.
      
      Sección: ${section}
      Campo Específico: ${context}
      
      Lo que el usuario ha escrito hasta ahora (puede estar vacío): "${currentInput}"
      
      Por favor, mejora, completa o sugiere un contenido profesional y detallado para este campo. 
      Sé conciso pero técnico. Solo devuelve el texto sugerido, sin explicaciones adicionales.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error al generar sugerencia. Intente nuevamente.";
  }
};