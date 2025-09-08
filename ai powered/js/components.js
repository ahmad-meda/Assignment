/**
 * UI Components for the cryptocurrency app
 */

const Components = {
    /**
     * Create a cryptocurrency card component
     */
    createCryptoCard(coin) {
        const changeClass = Utils.getChangeColorClass(coin.price_change_percentage_24h);
        const trendIcon = Utils.getTrendIcon(coin.price_change_percentage_24h);
        const isVanry = coin.symbol.toLowerCase() === 'vanry' || coin.id.toLowerCase().includes('vanry');
        const change24h = coin.price_change_percentage_24h || 0;
        const isPositive = change24h >= 0;
        
        return `
            <div class="crypto-card ${isVanry ? 'featured' : ''}" data-coin-id="${coin.id}">
                <div class="flex items-center justify-between mb-5">
                    <div class="flex items-center">
                        <div class="relative">
                            <img src="${Utils.getCoinImageUrl(coin)}" 
                                 alt="${coin.name}" 
                                 class="w-14 h-14 rounded-full mr-4 ring-2 ring-gray-100 dark:ring-gray-700"
                                 onerror="this.src='https://via.placeholder.com/56x56/e5e7eb/6b7280?text=${coin.symbol.charAt(0).toUpperCase()}'">
                            ${isVanry ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><i class="fas fa-star text-white text-xs"></i></div>' : ''}
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">${coin.name}</h3>
                            <div class="flex items-center space-x-2">
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">${coin.symbol}</span>
                                ${coin.market_cap_rank ? `<span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 font-medium">#${coin.market_cap_rank}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div class="flex justify-between items-end">
                        <div>
                            <span class="text-2xl font-bold text-gray-900 dark:text-white">
                                ${Utils.formatCurrency(coin.current_price)}
                            </span>
                        </div>
                        <div class="text-right">
                            <div class="flex items-center justify-end ${changeClass} mb-1">
                                <div class="trend-icon ${isPositive ? 'up' : 'down'} mr-2">
                                    <i class="${trendIcon}"></i>
                                </div>
                                <span class="font-bold text-lg">
                                    ${Utils.formatPercentage(Math.abs(change24h))}
                                </span>
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">24h change</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Market Cap</p>
                            <p class="text-sm font-bold text-gray-900 dark:text-white">
                                $${Utils.formatLargeNumber(coin.market_cap)}
                            </p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Volume 24h</p>
                            <p class="text-sm font-bold text-gray-900 dark:text-white">
                                $${Utils.formatLargeNumber(coin.total_volume)}
                            </p>
                        </div>
                    </div>
                    
                    ${isVanry ? `
                    <div class="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900">
                        <div class="flex items-center justify-center space-x-2">
                            <i class="fas fa-crown text-blue-500"></i>
                            <span class="text-blue-600 dark:text-blue-400 text-sm font-bold">VANRY/USDT Featured Pair</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Create detailed view component
     */
    createDetailView(coin, historicalData) {
        const changeClass = Utils.getChangeColorClass(coin.market_data?.price_change_percentage_24h);
        const trendIcon = Utils.getTrendIcon(coin.market_data?.price_change_percentage_24h);
        const currentPrice = coin.market_data?.current_price?.usd || 0;
        const priceChange24h = coin.market_data?.price_change_percentage_24h || 0;
        
        return `
            <div class="detail-view slide-in-right">
                <!-- Header Section -->
                <div class="professional-card p-8 mb-8">
                    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                        <div class="flex items-center mb-6 lg:mb-0">
                            <div class="relative mr-6">
                                <img src="${Utils.getCoinImageUrl(coin)}" 
                                     alt="${coin.name}" 
                                     class="w-20 h-20 rounded-full ring-4 ring-gray-100 dark:ring-gray-700"
                                     onerror="this.src='https://via.placeholder.com/80x80/e5e7eb/6b7280?text=${coin.symbol.charAt(0).toUpperCase()}'">
                                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <i class="fas fa-chart-line text-white text-sm"></i>
                                </div>
                            </div>
                            <div>
                                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">${coin.name}</h1>
                                <div class="flex items-center space-x-3">
                                    <span class="text-xl font-medium text-gray-500 dark:text-gray-400 uppercase">${coin.symbol}</span>
                                    ${coin.market_data?.market_cap_rank ? `<span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full">Rank #${coin.market_data.market_cap_rank}</span>` : ''}
                                </div>
                                <p class="text-gray-600 dark:text-gray-400 mt-2">Live Market Data</p>
                            </div>
                        </div>
                        
                        <div class="text-right lg:text-right w-full lg:w-auto">
                            <div class="text-5xl font-bold text-gray-900 dark:text-white mb-3">
                                ${Utils.formatCurrency(currentPrice)}
                            </div>
                            <div class="flex items-center justify-end ${changeClass} mb-2">
                                <div class="trend-icon ${priceChange24h >= 0 ? 'up' : 'down'} mr-3">
                                    <i class="${trendIcon}"></i>
                                </div>
                                <span class="text-2xl font-bold">
                                    ${Utils.formatPercentage(priceChange24h)}
                                </span>
                            </div>
                            <p class="text-gray-500 dark:text-gray-400 font-medium">24 Hour Change</p>
                        </div>
                    </div>
                </div>

                <!-- Chart Section -->
                <div class="chart-container mb-8">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                <i class="fas fa-chart-area mr-3 text-green-500"></i>
                                Price Analysis
                            </h2>
                            <p class="text-gray-600 dark:text-gray-400">Interactive price chart with trend analysis</p>
                        </div>
                        <div class="flex space-x-2">
                            <button class="chart-period-btn active" data-days="7">
                                <i class="fas fa-calendar-week mr-1"></i>7D
                            </button>
                            <button class="chart-period-btn" data-days="30">
                                <i class="fas fa-calendar-alt mr-1"></i>30D
                            </button>
                            <button class="chart-period-btn" data-days="90">
                                <i class="fas fa-calendar mr-1"></i>90D
                            </button>
                        </div>
                    </div>
                    <div class="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <canvas id="priceChart" class="w-full h-96"></canvas>
                    </div>
                </div>

                <!-- Statistics Grid -->
                <div class="mb-8">
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            <i class="fas fa-chart-bar mr-3 text-purple-500"></i>
                            Market Statistics
                        </h2>
                        <p class="text-gray-600 dark:text-gray-400">Comprehensive market data and metrics</p>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Market Cap</h3>
                                <i class="fas fa-chart-pie text-blue-500"></i>
                            </div>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                $${Utils.formatLargeNumber(coin.market_data?.market_cap?.usd || 0)}
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Total market value</p>
                        </div>
                        
                        <div class="stat-card">
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">24h Volume</h3>
                                <i class="fas fa-exchange-alt text-green-500"></i>
                            </div>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                $${Utils.formatLargeNumber(coin.market_data?.total_volume?.usd || 0)}
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Trading volume</p>
                        </div>
                        
                        <div class="stat-card">
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Circulating Supply</h3>
                                <i class="fas fa-coins text-yellow-500"></i>
                            </div>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                ${Utils.formatLargeNumber(coin.market_data?.circulating_supply || 0)}
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${coin.symbol.toUpperCase()} tokens</p>
                        </div>
                        
                        <div class="stat-card">
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">All-Time High</h3>
                                <i class="fas fa-trophy text-orange-500"></i>
                            </div>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                ${Utils.formatCurrency(coin.market_data?.ath?.usd || 0)}
                            </p>
                            ${coin.market_data?.ath_date?.usd ? `<p class="text-sm text-gray-500 dark:text-gray-400">${new Date(coin.market_data.ath_date.usd).toLocaleDateString()}</p>` : '<p class="text-sm text-gray-500 dark:text-gray-400">Historic peak</p>'}
                        </div>
                    </div>
                </div>

                <!-- Description Section -->
                ${coin.description?.en ? `
                <div class="professional-card p-8">
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            <i class="fas fa-info-circle mr-3 text-blue-500"></i>
                            About ${coin.name}
                        </h2>
                        <p class="text-gray-600 dark:text-gray-400">Project overview and key information</p>
                    </div>
                    
                    <div class="text-gray-700 dark:text-gray-300 prose prose-lg max-w-none leading-relaxed">
                        ${coin.description.en.substring(0, 800)}${coin.description.en.length > 800 ? '...' : ''}
                    </div>
                    
                    ${coin.links?.homepage?.[0] ? `
                    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex flex-wrap gap-4">
                            <a href="${coin.links.homepage[0]}" target="_blank" rel="noopener noreferrer" 
                               class="btn btn-primary">
                                <i class="fas fa-globe mr-2"></i>
                                Official Website
                            </a>
                            ${coin.links?.blockchain_site?.[0] ? `
                            <a href="${coin.links.blockchain_site[0]}" target="_blank" rel="noopener noreferrer" 
                               class="btn btn-secondary">
                                <i class="fas fa-cube mr-2"></i>
                                Explorer
                            </a>
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Create and update the price chart
     */
    createPriceChart(historicalData, coinName) {
        const ctx = document.getElementById('priceChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (window.priceChartInstance) {
            window.priceChartInstance.destroy();
        }

        const prices = historicalData.prices || [];
        const labels = prices.map(price => Utils.formatDate(price[0]));
        const data = prices.map(price => price[1]);

        const isDarkMode = document.documentElement.classList.contains('dark');
        const textColor = isDarkMode ? '#e5e7eb' : '#374151';
        const gridColor = isDarkMode ? '#374151' : '#e5e7eb';

        window.priceChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${coinName} Price (USD)`,
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#3b82f6',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        titleColor: textColor,
                        bodyColor: textColor,
                        borderColor: gridColor,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `Price: ${Utils.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            color: gridColor,
                            drawBorder: false,
                        },
                        ticks: {
                            color: textColor,
                            maxTicksLimit: 7
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: gridColor,
                            drawBorder: false,
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return Utils.formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Create loading placeholder cards
     */
    createLoadingCards(count = 8) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                            <div>
                                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                            </div>
                        </div>
                        <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
                                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                            </div>
                            <div>
                                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
                                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        return html;
    }
};
