/**
 * CoinGecko API Integration
 * Handles all API calls to fetch cryptocurrency data
 */

class CryptoAPI {
    constructor() {
        this.baseURL = 'https://api.coingecko.com/api/v3';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Generic fetch method with error handling
     */
    async fetchData(endpoint) {
        const cacheKey = endpoint;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    }

    /**
     * Get list of cryptocurrencies with market data
     * Ensures Vanry/USDT is prioritized in the list
     */
    async getCryptocurrencies(limit = 100) {
        try {
            const data = await this.fetchData(
                `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
            );

            // Find Vanry in the list and move it to the front
            const vanryIndex = data.findIndex(coin => 
                coin.symbol.toLowerCase() === 'vanry' || 
                coin.id.toLowerCase().includes('vanry')
            );

            if (vanryIndex > 0) {
                const vanryCoin = data.splice(vanryIndex, 1)[0];
                data.unshift(vanryCoin);
            }

            // If Vanry is not in the top results, fetch it specifically
            if (vanryIndex === -1) {
                try {
                    const vanryData = await this.fetchData('/coins/vanar-chain');
                    if (vanryData) {
                        const vanryFormatted = {
                            id: vanryData.id,
                            symbol: vanryData.symbol,
                            name: vanryData.name,
                            image: vanryData.image?.small || vanryData.image?.thumb,
                            current_price: vanryData.market_data?.current_price?.usd || 0,
                            market_cap: vanryData.market_data?.market_cap?.usd || 0,
                            total_volume: vanryData.market_data?.total_volume?.usd || 0,
                            price_change_percentage_24h: vanryData.market_data?.price_change_percentage_24h || 0,
                            market_cap_rank: vanryData.market_data?.market_cap_rank || null
                        };
                        data.unshift(vanryFormatted);
                    }
                } catch (vanryError) {
                    console.warn('Could not fetch Vanry data specifically:', vanryError);
                }
            }

            return data;
        } catch (error) {
            console.error('Error fetching cryptocurrencies:', error);
            throw error;
        }
    }

    /**
     * Get detailed information for a specific cryptocurrency
     */
    async getCoinDetails(coinId) {
        try {
            const data = await this.fetchData(`/coins/${coinId}`);
            return data;
        } catch (error) {
            console.error(`Error fetching details for ${coinId}:`, error);
            throw error;
        }
    }

    /**
     * Get historical market data for charts
     */
    async getHistoricalData(coinId, days = 7) {
        try {
            const data = await this.fetchData(
                `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
            );
            return data;
        } catch (error) {
            console.error(`Error fetching historical data for ${coinId}:`, error);
            throw error;
        }
    }

    /**
     * Search for cryptocurrencies
     */
    async searchCoins(query) {
        try {
            const data = await this.fetchData(`/search?query=${encodeURIComponent(query)}`);
            return data.coins || [];
        } catch (error) {
            console.error('Error searching coins:', error);
            throw error;
        }
    }

    /**
     * Get trending cryptocurrencies
     */
    async getTrending() {
        try {
            const data = await this.fetchData('/search/trending');
            return data.coins || [];
        } catch (error) {
            console.error('Error fetching trending coins:', error);
            throw error;
        }
    }

    /**
     * Get global market data
     */
    async getGlobalData() {
        try {
            const data = await this.fetchData('/global');
            return data.data || {};
        } catch (error) {
            console.error('Error fetching global data:', error);
            throw error;
        }
    }
}

// Create global instance
window.cryptoAPI = new CryptoAPI();
