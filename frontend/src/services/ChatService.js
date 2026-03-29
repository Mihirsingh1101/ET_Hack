// API Configuration
const RAG_API_BASE_URL = "http://127.0.0.1:8003";
const SENTIMENT_API_BASE_URL = "http://127.0.0.1:8001";

export const ChatService = {
  /**
   * Send a message to the RAG backend and get AI response
   * @param {string} userMessage - The user's question
   * @param {object} insightData - {ticker, sector, insight_text, timestamp}
   * @param {array} chatHistory - Previous conversation turns
   * @returns {object} - {ai_response, latency_seconds, snippets_procured}
   */
  async sendMessage(userMessage, insightData, chatHistory = []) {
    try {
      const response = await fetch(`${RAG_API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: userMessage,
          insight_data: insightData,
          chat_history: chatHistory,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to get AI response");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Chat API Error:", error);
      throw error;
    }
  },

  /**
   * Analyze company sentiment using FinBERT
   * @param {string} companyName - Name of the company (e.g., "Reliance Industries")
   * @returns {object} - {stock_delta, sector_delta, market_delta, signal, insight_data, ...}
   */
  async analyzeSentiment(companyName) {
    try {
      console.log(`[SentimentAPI] Analyzing: ${companyName}`);
      const response = await fetch(`${SENTIMENT_API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to analyze sentiment");
      }

      const data = await response.json();
      console.log(`[SentimentAPI] Response received:`, data);
      return data;
    } catch (error) {
      console.error("Sentiment API Error:", error);
      throw error;
    }
  },

  /**
   * Health check to verify RAG backend is running
   */
  async healthCheck() {
    try {
      const response = await fetch(`${RAG_API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error("Backend health check failed:", error);
      return false;
    }
  },
};
