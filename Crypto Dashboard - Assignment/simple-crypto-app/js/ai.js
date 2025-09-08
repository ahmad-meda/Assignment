// Simple AI Integration - OpenAI and Gemini
// Provides cryptocurrency insights using AI

class AIInsights {
    constructor() {
        this.currentProvider = 'openai';
    }

    // Set AI provider (OpenAI or Gemini)
    setProvider(provider) {
        this.currentProvider = provider;
    }

    // Generate insight for a cryptocurrency
    async generateInsight(cryptoData) {
        const provider = this.currentProvider;
        const prompt = this.createPrompt(cryptoData);

        try {
            if (provider === 'openai') {
                return await this.callOpenAI(prompt);
            } else if (provider === 'gemini') {
                return await this.callGemini(prompt);
            }
        } catch (error) {
            console.error('AI API Error:', error);
            return this.getFallbackInsight(cryptoData);
        }
    }

    // Create prompt for AI
    createPrompt(crypto) {
        return `Analyze this cryptocurrency data and provide a brief investment insight (2-3 sentences):
        
Name: ${crypto.name} (${crypto.symbol})
Price: $${crypto.current_price}
24h Change: ${crypto.price_change_percentage_24h?.toFixed(2)}%
Market Cap: $${cryptoAPI.formatLargeNumber(crypto.market_cap)}
Volume: $${cryptoAPI.formatLargeNumber(crypto.total_volume)}

Please provide a simple analysis suitable for beginners.`;
    }

    // Call OpenAI API
    async callOpenAI(prompt) {
        const config = CONFIG.AI_APIS.openai;
        
        if (config.key === 'your-openai-api-key-here') {
            return this.getDemoInsight();
        }

        const response = await fetch(config.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Call Gemini API
    async callGemini(prompt) {
        const config = CONFIG.AI_APIS.gemini;
        
        if (config.key === 'your-gemini-api-key-here') {
            return this.getDemoInsight();
        }

        const response = await fetch(`${config.url}?key=${config.key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Demo insight when no API key is provided
    getDemoInsight() {
        const insights = [
            "This cryptocurrency shows interesting market patterns. Consider the current trend and market conditions before making any investment decisions.",
            "The recent price movement indicates market volatility. Always do your own research and never invest more than you can afford to lose.",
            "Market sentiment appears mixed for this asset. Consider diversifying your portfolio and consulting with financial advisors.",
            "This crypto has shown resilience in recent market conditions. However, past performance doesn't guarantee future results.",
            "The trading volume suggests active interest from investors. Consider the long-term fundamentals before making decisions."
        ];
        
        return insights[Math.floor(Math.random() * insights.length)];
    }

    // Fallback insight for errors
    getFallbackInsight(crypto) {
        return `${crypto.name} is currently trading at ${cryptoAPI.formatPrice(crypto.current_price)}. Please note that cryptocurrency investments carry significant risks and you should always do your own research.`;
    }
}

// Create global AI instance
const aiInsights = new AIInsights();
