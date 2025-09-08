// Simple API Handler - Easy to understand
// Handles cryptocurrency data from CoinGecko

class CryptoAPI {
    constructor() {
        this.baseUrl = CONFIG.COINGECKO_URL;
    }

    // Get cryptocurrency list with Vanry first
    async getCryptos() {
        try {
            const url = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${CONFIG.CRYPTO_LIMIT}&page=1&sparkline=false&price_change_percentage=24h`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            // Put Vanry first if it exists
            const vanryIndex = data.findIndex(crypto => crypto.id === CONFIG.FEATURED_CRYPTO);
            if (vanryIndex > 0) {
                const vanry = data.splice(vanryIndex, 1)[0];
                data.unshift(vanry);
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            return [];
        }
    }

    // Get detailed info for one crypto
    async getCryptoDetails(cryptoId) {
        try {
            const url = `${this.baseUrl}/coins/${cryptoId}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching crypto details:', error);
            return null;
        }
    }

    // Format price nicely
    formatPrice(price) {
        if (price < 0.01) {
            return '$' + price.toFixed(6);
        } else if (price < 1) {
            return '$' + price.toFixed(4);
        } else {
            return '$' + price.toFixed(2);
        }
    }

    // Format percentage change
    formatChange(change) {
        if (!change) return '0.00%';
        const sign = change >= 0 ? '+' : '';
        return sign + change.toFixed(2) + '%';
    }

    // Format large numbers (market cap, volume)
    formatLargeNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    }
}

// Create global API instance
const cryptoAPI = new CryptoAPI();
