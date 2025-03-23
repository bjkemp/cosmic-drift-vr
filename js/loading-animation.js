/**
 * Custom loading animation for Cosmic Drift VR
 * Provides a smooth and engaging loading experience
 */

// Global loading animation object
window.LoadingAnimation = {
    // Animation elements
    elements: {
        container: null,
        logo: null,
        progress: null,
        message: null
    },
    
    // Status
    isVisible: false,
    progress: 0,
    
    // Initialize
    init: function() {
        console.log('Initializing loading animation');
        
        // Create loading elements
        this.createElements();
        
        // Show initial loading animation
        this.show('Initializing Cosmic Drift VR...');
        
        // Listen for A-Frame events
        this.setupEventListeners();
    },
    
    // Create loading animation elements
    createElements: function() {
        // Create container
        const container = document.createElement('div');
        container.id = 'cosmic-drift-loader';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = '#000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.zIndex = '9999';
        container.style.transition = 'opacity 0.5s ease-out';
        container.style.fontFamily = 'Arial, sans-serif';
        
        // Create logo
        const logo = document.createElement('div');
        logo.textContent = 'COSMIC DRIFT';
        logo.style.fontSize = '3rem';
        logo.style.fontWeight = 'bold';
        logo.style.color = '#88CCFF';
        logo.style.textShadow = '0 0 10px rgba(136, 204, 255, 0.7)';
        logo.style.marginBottom = '2rem';
        logo.style.letterSpacing = '0.2em';
        
        // Add subtle animation to logo
        logo.style.animation = 'pulse 2s infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.9; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.style.width = '300px';
        progressContainer.style.height = '5px';
        progressContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        progressContainer.style.borderRadius = '3px';
        progressContainer.style.overflow = 'hidden';
        progressContainer.style.marginBottom = '1rem';
        
        // Create progress bar
        const progress = document.createElement('div');
        progress.style.width = '0%';
        progress.style.height = '100%';
        progress.style.backgroundColor = '#88CCFF';
        progress.style.transition = 'width 0.3s ease-out';
        progressContainer.appendChild(progress);
        
        // Create message
        const message = document.createElement('div');
        message.style.color = '#fff';
        message.style.fontSize = '1rem';
        message.style.textAlign = 'center';
        message.style.maxWidth = '80%';
        
        // Create a space-themed animation
        const spaceAnimation = document.createElement('div');
        spaceAnimation.style.position = 'absolute';
        spaceAnimation.style.top = '0';
        spaceAnimation.style.left = '0';
        spaceAnimation.style.width = '100%';
        spaceAnimation.style.height = '100%';
        spaceAnimation.style.overflow = 'hidden';
        spaceAnimation.style.zIndex = '-1';
        
        // Add stars to the animation
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.backgroundColor = '#fff';
            star.style.borderRadius = '50%';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
            star.style.animation = `pulse ${(Math.random() * 3 + 1)}s infinite`;
            
            spaceAnimation.appendChild(star);
        }
        
        // Add a nebula effect
        const nebula = document.createElement('div');
        nebula.style.position = 'absolute';
        nebula.style.width = '500px';
        nebula.style.height = '500px';
        nebula.style.borderRadius = '50%';
        nebula.style.background = 'radial-gradient(circle, rgba(136,204,255,0.1) 0%, rgba(66,103,178,0.05) 50%, rgba(0,0,0,0) 70%)';
        nebula.style.top = '50%';
        nebula.style.left = '50%';
        nebula.style.transform = 'translate(-50%, -50%)';
        nebula.style.filter = 'blur(30px)';
        nebula.style.opacity = '0.7';
        nebula.style.animation = 'pulse 5s infinite';
        
        spaceAnimation.appendChild(nebula);
        
        // Append elements
        container.appendChild(spaceAnimation);
        container.appendChild(logo);
        container.appendChild(progressContainer);
        container.appendChild(message);
        
        // Store references
        this.elements.container = container;
        this.elements.logo = logo;
        this.elements.progress = progress;
        this.elements.message = message;
        
        // Add to document
        document.body.appendChild(container);
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        document.addEventListener('DOMContentLoaded', () => {
            // Update progress
            this.updateProgress(20, 'Loading assets...');
            
            // Listen for A-Frame events
            const scene = document.querySelector('a-scene');
            if (scene) {
                // When entity loaded
                scene.addEventListener('loaded', () => {
                    this.updateProgress(90, 'Starting experience...');
                    
                    // Slight delay to allow rendering to start
                    setTimeout(() => {
                        this.updateProgress(100, 'Ready!');
                        this.hide();
                    }, 500);
                });
                
                // Listen for enter VR
                scene.addEventListener('enter-vr', () => {
                    // Make sure loader is hidden when entering VR
                    this.hide();
                });
            }
        });
        
        // Show 50% after a bit to indicate progress even if loading is slow
        setTimeout(() => {
            if (this.progress < 50) {
                this.updateProgress(50, 'Loading celestial objects...');
            }
        }, 2000);
        
        // Asset loading progress (if we had asset loading events)
        // This is a placeholder for actual asset loading progress
        window.addEventListener('load', () => {
            this.updateProgress(70, 'Finalizing...');
        });
    },
    
    // Show loading animation
    show: function(message) {
        if (!this.elements.container) return;
        
        this.elements.container.style.display = 'flex';
        this.elements.container.style.opacity = '1';
        
        if (message && this.elements.message) {
            this.elements.message.textContent = message;
        }
        
        this.isVisible = true;
    },
    
    // Hide loading animation
    hide: function() {
        if (!this.elements.container) return;
        
        this.elements.container.style.opacity = '0';
        
        // Remove from DOM after transition
        setTimeout(() => {
            this.elements.container.style.display = 'none';
        }, 500);
        
        this.isVisible = false;
    },
    
    // Update progress bar
    updateProgress: function(percent, message) {
        this.progress = percent;
        
        if (!this.elements.progress) return;
        
        // Update progress bar width
        this.elements.progress.style.width = `${percent}%`;
        
        // Update message if provided
        if (message && this.elements.message) {
            this.elements.message.textContent = message;
        }
    }
};

// Initialize loading animation
document.addEventListener('DOMContentLoaded', function() {
    window.LoadingAnimation.init();
});
