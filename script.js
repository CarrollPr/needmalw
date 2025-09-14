class GreenMaxWebsite {
    constructor() {
        this.currentTheme = 'light';
        this.currentTab = 'general';
        this.deviceInfo = {};
        this.screenInfo = {};
        this.init();
    }

    /**
     * Initialize the website functionality
     */
    init() {
        this.detectDevice();
        this.detectScreen();
        this.optimizeInterface();
        this.loadTheme();
        this.setupEventListeners();
        this.setupFAQInteractivity();
        this.initializeActiveTab();
        this.setupDynamicOptimization();
    }

    /**
     * Load theme from localStorage or set default
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('greenmax-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Check user's system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            }
        }
        this.applyTheme();
    }

    /**
     * Apply the current theme to the document
     */
    applyTheme() {
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        
        if (this.currentTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        } else {
            body.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
        }
        
        // Save theme preference
        localStorage.setItem('greenmax-theme', this.currentTheme);
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        
        // Add a subtle animation effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Keyboard navigation for tabs
        tabButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tabName = e.currentTarget.getAttribute('data-tab');
                    this.switchTab(tabName);
                }
            });
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                const savedTheme = localStorage.getItem('greenmax-theme');
                if (!savedTheme) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }

        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectScreen();
                this.optimizeInterface();
            }, 100);
        });

        // Listen for window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.detectScreen();
                this.optimizeInterface();
            }, 150);
        });
    }

    /**
     * Switch between tabs
     * @param {string} tabName - The name of the tab to switch to
     */
    switchTab(tabName) {
        // Remove active class from all tabs and panels
        const allTabButtons = document.querySelectorAll('.tab-button');
        const allTabPanels = document.querySelectorAll('.tab-panel');
        
        allTabButtons.forEach(button => button.classList.remove('active'));
        allTabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to selected tab and panel
        const activeTabButton = document.querySelector(`[data-tab="${tabName}"]`);
        const activeTabPanel = document.getElementById(tabName);
        
        if (activeTabButton && activeTabPanel) {
            activeTabButton.classList.add('active');
            activeTabPanel.classList.add('active');
            this.currentTab = tabName;
            
            // Scroll to top of content for better UX
            activeTabPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update URL hash without triggering page reload
            history.replaceState(null, null, `#${tabName}`);
        }
    }

    /**
     * Initialize the active tab based on URL hash or default
     */
    initializeActiveTab() {
        const hash = window.location.hash.substring(1);
        const validTabs = ['general', 'faq'];
        
        if (hash && validTabs.includes(hash)) {
            this.switchTab(hash);
        } else {
            this.switchTab('general'); // Default tab
        }
    }

    /**
     * Setup FAQ accordion functionality
     */
    setupFAQInteractivity() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('h4');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQItem(item));
                
                // Keyboard accessibility
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleFAQItem(item);
                    }
                });
                
                // Make questions focusable
                question.setAttribute('tabindex', '0');
                question.setAttribute('role', 'button');
                question.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Toggle FAQ item open/closed
     * @param {HTMLElement} item - The FAQ item to toggle
     */
    toggleFAQItem(item) {
        const isActive = item.classList.contains('active');
        const question = item.querySelector('h4');
        const answer = item.querySelector('.faq-answer');
        
        if (isActive) {
            item.classList.remove('active');
            if (question) question.setAttribute('aria-expanded', 'false');
            if (answer) answer.style.maxHeight = '0';
        } else {
            item.classList.add('active');
            if (question) question.setAttribute('aria-expanded', 'true');
            if (answer) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        }
    }

    /**
     * Utility method to handle smooth scrolling to elements
     * @param {string} elementId - The ID of the element to scroll to
     */
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    /**
     * Check if user prefers reduced motion
     * @returns {boolean} - True if user prefers reduced motion
     */
    prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Get current theme
     * @returns {string} - Current theme ('light' or 'dark')
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Get current active tab
     * @returns {string} - Current active tab name
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * Detect device type and capabilities
     */
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        
        this.deviceInfo = {
            // Device type detection
            isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
            isTablet: /ipad|android(?!.*mobile)|tablet/i.test(userAgent),
            isDesktop: !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|tablet/i.test(userAgent),
            
            // Specific device detection
            isIOS: /iphone|ipad|ipod/i.test(userAgent),
            isAndroid: /android/i.test(userAgent),
            isMac: /mac/i.test(platform),
            isWindows: /win/i.test(platform),
            
            // Capabilities
            hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            hasHover: window.matchMedia('(hover: hover)').matches,
            canVibrate: 'vibrate' in navigator,
            
            // Browser detection
            isChrome: /chrome/i.test(userAgent),
            isFirefox: /firefox/i.test(userAgent),
            isSafari: /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
            
            // Connection info
            connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
            
            // Device pixel ratio
            pixelRatio: window.devicePixelRatio || 1
        };
        
        // Refine tablet detection
        if (this.deviceInfo.isMobile && (window.innerWidth > 768 || window.innerHeight > 768)) {
            this.deviceInfo.isTablet = true;
            this.deviceInfo.isMobile = false;
        }
        
        console.log('Device detected:', this.deviceInfo);
    }

    /**
     * Detect screen properties and viewport
     */
    detectScreen() {
        this.screenInfo = {
            width: window.innerWidth,
            height: window.innerHeight,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            orientation: screen.orientation ? screen.orientation.angle : (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'),
            
            // Breakpoints
            isXSmall: window.innerWidth < 480,
            isSmall: window.innerWidth >= 480 && window.innerWidth < 768,
            isMedium: window.innerWidth >= 768 && window.innerWidth < 1024,
            isLarge: window.innerWidth >= 1024 && window.innerWidth < 1200,
            isXLarge: window.innerWidth >= 1200,
            
            // Aspect ratio
            aspectRatio: window.innerWidth / window.innerHeight,
            
            // Safe areas (for modern mobile devices)
            safeAreaTop: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') || '0'),
            safeAreaBottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)') || '0'),
            
            // Viewport type
            isPortrait: window.innerHeight > window.innerWidth,
            isLandscape: window.innerWidth > window.innerHeight
        };
        
        console.log('Screen detected:', this.screenInfo);
    }

    /**
     * Optimize interface based on device and screen detection
     */
    optimizeInterface() {
        const body = document.body;
        
        // Clear previous device classes
        body.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'touch-device', 'no-touch', 'orientation-portrait', 'orientation-landscape');
        
        // Add device type classes
        if (this.deviceInfo.isMobile) {
            body.classList.add('device-mobile');
        } else if (this.deviceInfo.isTablet) {
            body.classList.add('device-tablet');
        } else {
            body.classList.add('device-desktop');
        }
        
        // Add touch capability classes
        if (this.deviceInfo.hasTouch) {
            body.classList.add('touch-device');
        } else {
            body.classList.add('no-touch');
        }
        
        // Add orientation classes
        body.classList.add(this.screenInfo.isPortrait ? 'orientation-portrait' : 'orientation-landscape');
        
        // Add screen size classes
        const sizeClasses = ['xs', 'sm', 'md', 'lg', 'xl'];
        sizeClasses.forEach(size => body.classList.remove(`screen-${size}`));
        
        if (this.screenInfo.isXSmall) body.classList.add('screen-xs');
        else if (this.screenInfo.isSmall) body.classList.add('screen-sm');
        else if (this.screenInfo.isMedium) body.classList.add('screen-md');
        else if (this.screenInfo.isLarge) body.classList.add('screen-lg');
        else body.classList.add('screen-xl');
        
        // Optimize for specific scenarios
        this.optimizeTouchInteractions();
        this.optimizeScrolling();
        this.optimizePerformance();
        this.adjustLayoutForScreen();
    }

    /**
     * Optimize touch interactions for mobile devices
     */
    optimizeTouchInteractions() {
        if (!this.deviceInfo.hasTouch) return;
        
        // Add larger touch targets for mobile
        const style = document.createElement('style');
        style.textContent = `
            .touch-device .tab-button {
                min-height: 44px;
                padding: 1rem 1.5rem;
            }
            .touch-device .theme-toggle {
                width: 48px;
                height: 48px;
                min-width: 44px;
                min-height: 44px;
            }
            .touch-device .faq-item h4 {
                min-height: 44px;
                padding: 1rem 0;
            }
        `;
        
        // Remove existing touch optimization styles
        const existingTouchStyles = document.querySelector('#touch-optimization');
        if (existingTouchStyles) {
            existingTouchStyles.remove();
        }
        
        style.id = 'touch-optimization';
        document.head.appendChild(style);
        
        // Add haptic feedback for supported devices
        if (this.deviceInfo.canVibrate) {
            const buttons = document.querySelectorAll('.tab-button, .theme-toggle, .faq-item h4');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    navigator.vibrate(10); // Light haptic feedback
                });
            });
        }
    }

    /**
     * Optimize scrolling behavior
     */
    optimizeScrolling() {
        // Enable momentum scrolling on iOS
        if (this.deviceInfo.isIOS) {
            document.body.style.webkitOverflowScrolling = 'touch';
        }
        
        // Adjust scroll behavior for different devices
        const scrollBehavior = this.deviceInfo.isMobile ? 'auto' : 'smooth';
        document.documentElement.style.scrollBehavior = scrollBehavior;
    }

    /**
     * Optimize performance based on device capabilities
     */
    optimizePerformance() {
        // Reduce animations on low-end devices
        const isLowEndDevice = this.deviceInfo.pixelRatio <= 1 || 
                               (this.deviceInfo.connection && this.deviceInfo.connection.saveData);
        
        if (isLowEndDevice || this.prefersReducedMotion()) {
            const style = document.createElement('style');
            style.textContent = `
                * {
                    transition-duration: 0.1s !important;
                    animation-duration: 0.1s !important;
                }
                .content-card:hover {
                    transform: none !important;
                }
            `;
            
            const existingPerfStyles = document.querySelector('#performance-optimization');
            if (existingPerfStyles) {
                existingPerfStyles.remove();
            }
            
            style.id = 'performance-optimization';
            document.head.appendChild(style);
        }
    }

    /**
     * Adjust layout for current screen
     */
    adjustLayoutForScreen() {
        const style = document.createElement('style');
        let css = '';
        
        // Mobile-specific optimizations
        if (this.deviceInfo.isMobile) {
            css += `
                .device-mobile .container {
                    padding: 0 12px;
                }
                .device-mobile .content-card {
                    margin-bottom: 1rem;
                    padding: 1rem;
                }
                .device-mobile .hero {
                    padding: 1rem 0;
                }
                .device-mobile .tabs {
                    padding: 0 0.5rem;
                }
            `;
        }
        
        // Tablet-specific optimizations
        if (this.deviceInfo.isTablet) {
            css += `
                .device-tablet .container {
                    padding: 0 24px;
                }
                .device-tablet .tabs {
                    gap: 1.5rem;
                }
                .device-tablet .content-card {
                    padding: 1.5rem;
                }
            `;
        }
        
        // Landscape mobile optimizations
        if (this.deviceInfo.isMobile && this.screenInfo.isLandscape) {
            css += `
                .device-mobile.orientation-landscape .hero {
                    padding: 0.5rem 0;
                    margin-bottom: 1.5rem;
                }
                .device-mobile.orientation-landscape .hero h2 {
                    font-size: 1.8rem;
                }
            `;
        }
        
        // High DPI optimizations
        if (this.deviceInfo.pixelRatio > 2) {
            css += `
                .logo i {
                    font-size: 2.2rem;
                }
                .tab-button i {
                    font-size: 1.1rem;
                }
            `;
        }
        
        style.textContent = css;
        
        const existingLayoutStyles = document.querySelector('#layout-optimization');
        if (existingLayoutStyles) {
            existingLayoutStyles.remove();
        }
        
        style.id = 'layout-optimization';
        document.head.appendChild(style);
    }

    /**
     * Setup dynamic optimization that responds to changes
     */
    setupDynamicOptimization() {
        // Monitor connection changes
        if (this.deviceInfo.connection) {
            this.deviceInfo.connection.addEventListener('change', () => {
                this.optimizePerformance();
            });
        }
        
        // Monitor battery status for performance optimization
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const optimizeForBattery = () => {
                    if (battery.level < 0.2 || !battery.charging) {
                        // Reduce performance when battery is low
                        document.body.classList.add('low-battery');
                        const style = document.createElement('style');
                        style.textContent = `
                            .low-battery * {
                                transition: none !important;
                                animation: none !important;
                            }
                        `;
                        style.id = 'battery-optimization';
                        document.head.appendChild(style);
                    } else {
                        document.body.classList.remove('low-battery');
                        const batteryStyles = document.querySelector('#battery-optimization');
                        if (batteryStyles) batteryStyles.remove();
                    }
                };
                
                battery.addEventListener('levelchange', optimizeForBattery);
                battery.addEventListener('chargingchange', optimizeForBattery);
                optimizeForBattery();
            });
        }
    }

    /**
     * Get device information
     * @returns {object} Device information
     */
    getDeviceInfo() {
        return this.deviceInfo;
    }

    /**
     * Get screen information
     * @returns {object} Screen information
     */
    getScreenInfo() {
        return this.screenInfo;
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.greenMaxWebsite = new GreenMaxWebsite();
    
    // Add some additional error handling
    window.addEventListener('error', (e) => {
        console.error('Green Max Website Error:', e.error);
    });
    
    // Handle hash changes for direct linking to tabs
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        const validTabs = ['general', 'faq'];
        
        if (hash && validTabs.includes(hash)) {
            window.greenMaxWebsite.switchTab(hash);
        }
    });
    
    // Add loading state management
    document.body.classList.add('loaded');
});

// Additional utility functions for enhanced functionality

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

/**
 * Show a temporary notification
 * @param {string} message - Message to show
 * @param {string} type - Type of notification ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GreenMaxWebsite, copyToClipboard, showNotification };
}
