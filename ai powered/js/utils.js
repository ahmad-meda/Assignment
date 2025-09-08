/**
 * Utility functions for the cryptocurrency app
 */

const Utils = {
    /**
     * Format currency values
     */
    formatCurrency(value, currency = 'USD', decimals = 2) {
        if (value == null || isNaN(value)) return '$0.00';
        
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        
        return formatter.format(value);
    },

    /**
     * Format large numbers (market cap, volume)
     */
    formatLargeNumber(value) {
        if (value == null || isNaN(value)) return '0';
        
        if (value >= 1e12) {
            return (value / 1e12).toFixed(2) + 'T';
        } else if (value >= 1e9) {
            return (value / 1e9).toFixed(2) + 'B';
        } else if (value >= 1e6) {
            return (value / 1e6).toFixed(2) + 'M';
        } else if (value >= 1e3) {
            return (value / 1e3).toFixed(2) + 'K';
        }
        
        return value.toFixed(2);
    },

    /**
     * Format percentage change
     */
    formatPercentage(value) {
        if (value == null || isNaN(value)) return '0.00%';
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    },

    /**
     * Get color class for percentage change
     */
    getChangeColorClass(value) {
        if (value == null || isNaN(value)) return 'text-gray-500';
        return value >= 0 ? 'price-up' : 'price-down';
    },

    /**
     * Get trend icon for percentage change
     */
    getTrendIcon(value) {
        if (value == null || isNaN(value)) return 'fas fa-minus';
        return value >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    },

    /**
     * Debounce function for search input
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Show/hide loading spinner
     */
    toggleLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        const grid = document.getElementById('cryptoGrid');
        const error = document.getElementById('errorMessage');
        
        if (show) {
            spinner.classList.remove('hidden');
            grid.classList.add('hidden');
            error.classList.add('hidden');
        } else {
            spinner.classList.add('hidden');
            grid.classList.remove('hidden');
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        const spinner = document.getElementById('loadingSpinner');
        const grid = document.getElementById('cryptoGrid');
        const error = document.getElementById('errorMessage');
        
        spinner.classList.add('hidden');
        grid.classList.add('hidden');
        error.classList.remove('hidden');
        
        const errorSpan = error.querySelector('span');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    },

    /**
     * Hide error message
     */
    hideError() {
        const error = document.getElementById('errorMessage');
        error.classList.add('hidden');
    },

    /**
     * Smooth scroll to element
     */
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },

    /**
     * Generate random color for charts
     */
    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 50%)`;
    },

    /**
     * Format date for charts
     */
    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Validate if a string is a valid URL
     */
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },

    /**
     * Get coin logo URL with fallback
     */
    getCoinImageUrl(coin) {
        if (coin.image) {
            return coin.image;
        }
        if (coin.large) {
            return coin.large;
        }
        if (coin.small) {
            return coin.small;
        }
        if (coin.thumb) {
            return coin.thumb;
        }
        // Fallback to a generic crypto icon
        return 'https://cryptologos.cc/logos/versions/generic-crypto-icon.png';
    }
};
