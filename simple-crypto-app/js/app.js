// Main App Logic - Simple and Easy to Understand
// This file controls everything in the app

class SimpleCryptoApp {
    constructor() {
        this.cryptos = [];
        this.selectedCrypto = null;
        this.init();
    }

    // Start the app
    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.loadCryptos();
        this.startAutoUpdate();
    }

    // Set up button clicks and interactions
    setupEventListeners() {
        // Theme toggle button
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Search box
        document.getElementById('searchBox').addEventListener('input', (e) => {
            this.searchCryptos(e.target.value);
        });

        // AI provider selection
        document.getElementById('aiProvider').addEventListener('change', (e) => {
            aiInsights.setProvider(e.target.value);
        });

        // Generate AI insight button
        document.getElementById('generateInsight').addEventListener('click', () => {
            this.generateAIInsight();
        });
    }

    // Load saved theme or use system preference
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            document.documentElement.classList.add('dark');
        }
    }

    // Switch between light and dark mode
    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Load cryptocurrency data
    async loadCryptos() {
        this.showLoading(true);
        
        try {
            this.cryptos = await cryptoAPI.getCryptos();
            this.displayCryptos(this.cryptos);
        } catch (error) {
            this.showError('Failed to load cryptocurrency data');
        }
        
        this.showLoading(false);
    }

    // Show or hide loading spinner
    showLoading(show) {
        const loading = document.getElementById('loading');
        const cryptoList = document.getElementById('cryptoList');
        
        if (show) {
            loading.classList.remove('hidden');
            cryptoList.classList.add('hidden');
        } else {
            loading.classList.add('hidden');
            cryptoList.classList.remove('hidden');
        }
    }

    // Display cryptos in the list
    displayCryptos(cryptos) {
        const container = document.getElementById('cryptoList');
        container.innerHTML = '';

        cryptos.forEach((crypto, index) => {
            const item = this.createCryptoItem(crypto, index === 0);
            container.appendChild(item);
        });
    }

    // Create a single crypto item
    createCryptoItem(crypto, isFeatured = false) {
        const div = document.createElement('div');
        div.className = `crypto-item p-5 rounded-xl transition-all duration-300 ${isFeatured ? 'featured-crypto' : ''}`;
        
        const changeClass = crypto.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down';
        const changeIcon = crypto.price_change_percentage_24h >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <img src="${crypto.image}" alt="${crypto.name}" class="w-12 h-12 rounded-full shadow-md">
                        ${isFeatured ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><i class="fas fa-star text-white text-xs"></i></div>' : ''}
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h3 class="font-bold text-gray-800 dark:text-white text-lg">${crypto.name}</h3>
                            ${isFeatured ? '<span class="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full font-medium">FEATURED</span>' : ''}
                        </div>
                        <p class="text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">${crypto.symbol}</p>
                        ${isFeatured ? '<p class="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">VANRY/USDT Pair</p>' : ''}
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-gray-800 dark:text-white text-lg">${cryptoAPI.formatPrice(crypto.current_price)}</p>
                    <div class="flex items-center justify-end ${changeClass} text-sm font-semibold">
                        <i class="fas ${changeIcon} mr-1"></i>
                        ${cryptoAPI.formatChange(crypto.price_change_percentage_24h)}
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">24h Volume: $${cryptoAPI.formatLargeNumber(crypto.total_volume)}</p>
                </div>
            </div>
        `;

        // Click to select crypto
        div.addEventListener('click', () => {
            this.selectCrypto(crypto);
        });

        return div;
    }

    // Select a crypto for AI analysis
    selectCrypto(crypto) {
        this.selectedCrypto = crypto;
        this.showCryptoDetails(crypto);
        
        // Enable AI insight button
        const button = document.getElementById('generateInsight');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-magic mr-2"></i>Generate AI Insight';
        
        // Highlight selected crypto
        document.querySelectorAll('.crypto-item').forEach(item => {
            item.classList.remove('ring-2', 'ring-blue-500');
        });
        event.currentTarget.classList.add('ring-2', 'ring-blue-500');
    }

    // Show crypto details in the right panel
    showCryptoDetails(crypto) {
        const detailsDiv = document.getElementById('cryptoDetails');
        const contentDiv = document.getElementById('detailsContent');
        
        contentDiv.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center space-x-3">
                    <img src="${crypto.image}" alt="${crypto.name}" class="w-12 h-12 rounded-full">
                    <div>
                        <h4 class="font-bold text-gray-800 dark:text-white">${crypto.name}</h4>
                        <p class="text-gray-600 dark:text-gray-400">${crypto.symbol.toUpperCase()}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Price</p>
                        <p class="font-bold text-gray-800 dark:text-white">${cryptoAPI.formatPrice(crypto.current_price)}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">24h Change</p>
                        <p class="${crypto.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down'} font-bold">
                            ${cryptoAPI.formatChange(crypto.price_change_percentage_24h)}
                        </p>
                    </div>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Market Cap</p>
                        <p class="font-bold text-gray-800 dark:text-white">$${cryptoAPI.formatLargeNumber(crypto.market_cap)}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Volume</p>
                        <p class="font-bold text-gray-800 dark:text-white">$${cryptoAPI.formatLargeNumber(crypto.total_volume)}</p>
                    </div>
                </div>
            </div>
        `;
        
        detailsDiv.classList.remove('hidden');
    }

    // Generate AI insight for selected crypto
    async generateAIInsight() {
        if (!this.selectedCrypto) return;
        
        const button = document.getElementById('generateInsight');
        const insightsDiv = document.getElementById('aiInsights');
        
        // Show loading
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
        insightsDiv.innerHTML = '<div class="ai-typing text-center py-4 text-gray-600 dark:text-gray-300">AI is analyzing</div>';
        
        try {
            const insight = await aiInsights.generateInsight(this.selectedCrypto);
            this.displayAIInsight(insight);
        } catch (error) {
            this.displayAIInsight('Sorry, AI analysis is temporarily unavailable. Please try again later.');
        }
        
        // Reset button
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-magic mr-2"></i>Generate New Insight';
    }

    // Display AI insight
    displayAIInsight(insight) {
        const insightsDiv = document.getElementById('aiInsights');
        const provider = document.getElementById('aiProvider').value;
        const providerName = provider === 'openai' ? 'OpenAI GPT' : 'Google Gemini';
        
        insightsDiv.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-purple-600 dark:text-purple-400">
                        <i class="fas fa-robot mr-1"></i>
                        ${providerName}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        ${new Date().toLocaleTimeString()}
                    </span>
                </div>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${insight}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 italic">
                    ⚠️ This is AI-generated content. Always do your own research before investing.
                </p>
            </div>
        `;
    }

    // Search cryptocurrencies
    searchCryptos(query) {
        if (!query.trim()) {
            this.displayCryptos(this.cryptos);
            return;
        }
        
        const filtered = this.cryptos.filter(crypto => 
            crypto.name.toLowerCase().includes(query.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(query.toLowerCase())
        );
        
        this.displayCryptos(filtered);
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('cryptoList');
        container.innerHTML = `
            <div class="text-center py-8 text-red-500">
                <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                <p>${message}</p>
                <button onclick="app.loadCryptos()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Try Again
                </button>
            </div>
        `;
    }

    // Auto-update data every minute
    startAutoUpdate() {
        setInterval(() => {
            this.loadCryptos();
        }, CONFIG.UPDATE_INTERVAL);
    }
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SimpleCryptoApp();
});
