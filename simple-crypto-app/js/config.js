// Simple Configuration File
// Easy to understand for beginners

const CONFIG = {
    // API Settings
    COINGECKO_URL: 'https://api.coingecko.com/api/v3',
    
    // How many cryptos to fetch
    CRYPTO_LIMIT: 50,
    
    // Update interval (in milliseconds)
    UPDATE_INTERVAL: 60000, // 1 minute
    
    // Featured crypto (Vanry/USDT)
    FEATURED_CRYPTO: 'vanar-chain',
    
    // AI Settings (You need to add your API keys)
    AI_APIS: {
        openai: {
            url: 'https://api.openai.com/v1/chat/completions',
            key: 'your-openai-api-key-here', // Replace with your key
            model: 'gpt-3.5-turbo'
        },
        gemini: {
            url: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
            key: 'your-gemini-api-key-here' // Replace with your key
        }
    }
};

// Theme settings
const THEMES = {
    light: {
        name: 'Light Mode',
        icon: 'fas fa-sun'
    },
    dark: {
        name: 'Dark Mode', 
        icon: 'fas fa-moon'
    }
};
