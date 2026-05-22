const apiKey = ""; // Automatically provided by the execution environment

export const fetchGeminiResponse = async (prompt, systemInstruction) => {
  let delay = 1000;
  for (let i = 0; i < 4; i++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error processing request.";
    } catch (err) {
      if (i === 3) return "Connection error to the AI backend. Please try again later.";
      await new Promise(r => setTimeout(r, delay));
      delay *= 2; // Exponential backoff
    }
  }
};
