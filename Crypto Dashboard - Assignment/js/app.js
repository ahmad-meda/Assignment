/**
 * Main Application Logic
 * Coordinates all components and handles user interactions
 */

class CryptoPulseApp {
    constructor() {
        this.currentView = 'home';
        this.currentCoin = null;
        this.cryptoData = [];
        this.filteredData = [];
        this.searchTimeout = null;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        this.setupEventListeners();
        this.initializeDarkMode();
        await this.loadCryptocurrencies();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Back button
        const backButton = document.getElementById('backButton');
        backButton.addEventListener('click', () => this.showHomeView());

        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', Utils.debounce((e) => {
            this.filterCryptocurrencies(e.target.value);
        }, 300));

        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        sortFilter.addEventListener('change', (e) => {
            this.sortCryptocurrencies(e.target.value);
        });

        // Handle crypto card clicks
        document.addEventListener('click', (e) => {
            const cryptoCard = e.target.closest('.crypto-card');
            if (cryptoCard) {
                const coinId = cryptoCard.dataset.coinId;
                this.showDetailView(coinId);
            }

            // Handle chart period buttons
            const periodBtn = e.target.closest('.chart-period-btn');
            if (periodBtn) {
                this.updateChartPeriod(periodBtn);
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentView === 'detail') {
                this.showHomeView();
            }
        });
    }

    /**
     * Initialize dark mode from localStorage
     */
    initializeDarkMode() {
        const savedTheme = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            this.updateDarkModeIcon(true);
        }
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', isDark ? 'dark' : 'light');
        this.updateDarkModeIcon(isDark);

        // Update chart if it exists
        if (window.priceChartInstance && this.currentView === 'detail') {
            setTimeout(() => {
                this.createChartForCurrentCoin();
            }, 100);
        }
    }

    /**
     * Update dark mode icon
     */
    updateDarkModeIcon(isDark) {
        const icon = document.querySelector('#darkModeToggle i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun text-xl' : 'fas fa-moon text-xl';
        }
    }

    /**
     * Load cryptocurrencies from API
     */
    async loadCryptocurrencies() {
        try {
            Utils.toggleLoading(true);
            Utils.hideError();

            this.cryptoData = await window.cryptoAPI.getCryptocurrencies(100);
            this.filteredData = [...this.cryptoData];
            
            this.renderCryptocurrencies();
            Utils.toggleLoading(false);
            
        } catch (error) {
            console.error('Failed to load cryptocurrencies:', error);
            Utils.showError('Failed to load cryptocurrency data. Please try again later.');
        }
    }

    /**
     * Render cryptocurrency cards
     */
    renderCryptocurrencies() {
        const grid = document.getElementById('cryptoGrid');
        if (!grid) return;

        if (this.filteredData.length === 0) {
            const gridContainer = grid.querySelector('.grid') || grid.querySelector('div:last-child');
            const emptyStateHTML = `
                <div class="col-span-full empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No cryptocurrencies found</h3>
                    <p class="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
            `;
            
            if (gridContainer) {
                gridContainer.innerHTML = emptyStateHTML;
            } else {
                grid.innerHTML = emptyStateHTML;
            }
            return;
        }

        const cardsHTML = this.filteredData.map(coin => Components.createCryptoCard(coin)).join('');
        const gridContainer = grid.querySelector('.grid') || grid.querySelector('div:last-child');
        if (gridContainer) {
            gridContainer.innerHTML = cardsHTML;
        } else {
            grid.innerHTML = cardsHTML;
        }

        // Add entrance animation with staggered delay
        const cards = document.querySelectorAll('.crypto-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    /**
     * Filter cryptocurrencies based on search term
     */
    filterCryptocurrencies(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredData = [...this.cryptoData];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredData = this.cryptoData.filter(coin => 
                coin.name.toLowerCase().includes(term) ||
                coin.symbol.toLowerCase().includes(term)
            );
        }
        this.renderCryptocurrencies();
    }

    /**
     * Sort cryptocurrencies by selected criteria
     */
    sortCryptocurrencies(sortBy) {
        this.filteredData.sort((a, b) => {
            switch (sortBy) {
                case 'market_cap':
                    return (b.market_cap || 0) - (a.market_cap || 0);
                case 'price_change_percentage_24h':
                    return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
                case 'current_price':
                    return (b.current_price || 0) - (a.current_price || 0);
                case 'total_volume':
                    return (b.total_volume || 0) - (a.total_volume || 0);
                default:
                    return 0;
            }
        });
        this.renderCryptocurrencies();
    }

    /**
     * Show detail view for a specific coin
     */
    async showDetailView(coinId) {
        try {
            Utils.toggleLoading(true);
            
            // Fetch detailed coin data and historical data in parallel
            const [coinDetails, historicalData] = await Promise.all([
                window.cryptoAPI.getCoinDetails(coinId),
                window.cryptoAPI.getHistoricalData(coinId, 7)
            ]);

            this.currentCoin = coinDetails;
            this.currentView = 'detail';

            // Hide home view and show detail view
            document.getElementById('homeView').classList.add('hidden');
            document.getElementById('detailView').classList.remove('hidden');
            document.getElementById('backButton').classList.remove('hidden');

            // Render detail view
            const detailView = document.getElementById('detailView');
            detailView.innerHTML = Components.createDetailView(coinDetails, historicalData);

            // Create chart
            Components.createPriceChart(historicalData, coinDetails.name);

            Utils.toggleLoading(false);
            Utils.scrollToElement('detailView');

        } catch (error) {
            console.error('Failed to load coin details:', error);
            Utils.showError(`Failed to load details for ${coinId}. Please try again.`);
        }
    }

    /**
     * Show home view
     */
    showHomeView() {
        this.currentView = 'home';
        this.currentCoin = null;

        // Show home view and hide detail view
        document.getElementById('homeView').classList.remove('hidden');
        document.getElementById('detailView').classList.add('hidden');
        document.getElementById('backButton').classList.add('hidden');

        // Destroy chart if it exists
        if (window.priceChartInstance) {
            window.priceChartInstance.destroy();
            window.priceChartInstance = null;
        }

        Utils.scrollToElement('homeView');
    }

    /**
     * Update chart period
     */
    async updateChartPeriod(button) {
        if (!this.currentCoin) return;

        // Update button states
        document.querySelectorAll('.chart-period-btn').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        });
        
        button.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        button.classList.add('bg-blue-500', 'text-white');

        try {
            const days = parseInt(button.dataset.days);
            const historicalData = await window.cryptoAPI.getHistoricalData(this.currentCoin.id, days);
            Components.createPriceChart(historicalData, this.currentCoin.name);
        } catch (error) {
            console.error('Failed to update chart:', error);
        }
    }

    /**
     * Create chart for current coin (used for theme switching)
     */
    async createChartForCurrentCoin() {
        if (!this.currentCoin) return;

        try {
            const activePeriodBtn = document.querySelector('.chart-period-btn.bg-blue-500');
            const days = activePeriodBtn ? parseInt(activePeriodBtn.dataset.days) : 7;
            const historicalData = await window.cryptoAPI.getHistoricalData(this.currentCoin.id, days);
            Components.createPriceChart(historicalData, this.currentCoin.name);
        } catch (error) {
            console.error('Failed to recreate chart:', error);
        }
    }

    /**
     * Refresh data
     */
    async refreshData() {
        if (this.currentView === 'home') {
            await this.loadCryptocurrencies();
        } else if (this.currentView === 'detail' && this.currentCoin) {
            await this.showDetailView(this.currentCoin.id);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoPulseApp = new CryptoPulseApp();
    
    // Refresh data every 60 seconds
    setInterval(() => {
        if (window.cryptoPulseApp) {
            window.cryptoPulseApp.refreshData();
        }
    }, 60000);
});

// Handle page visibility changes to pause/resume updates
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.cryptoPulseApp) {
        // Refresh data when page becomes visible again
        window.cryptoPulseApp.refreshData();
    }
});
