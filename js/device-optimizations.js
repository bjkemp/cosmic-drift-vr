/**
 * Device-specific optimizations for Cosmic Drift VR
 * Provides automatic detection and optimization for different devices,
 * with special focus on Quest 2
 */

// Global device optimizer
window.DeviceOptimizer = {
    // Device detection results
    device: {
        isQuest: false,
        isQuest2: false,
        isOculusBrowser: false,
        isMobile: false,
        isDesktop: false,
        browserName: 'unknown',
        foveationSupported: false
    },
    
    // Initialize optimizer
    init: function() {
        console.log('Initializing device optimizations');
        
        // Detect device
        this.detectDevice();
        
        // Apply optimizations
        this.applyOptimizations();
        
        // Listen for VR mode changes
        this.setupVRListeners();
    },
    
    // Detect the current device
    detectDevice: function() {
        const userAgent = navigator.userAgent;
        console.log('User Agent:', userAgent);
        
        // Check for Quest devices
        this.device.isQuest = userAgent.includes('Quest');
        this.device.isQuest2 = userAgent.includes('Quest 2');
        
        // Check for Oculus Browser
        this.device.isOculusBrowser = userAgent.includes('OculusBrowser');
        
        // Check for mobile
        this.device.isMobile = /Android|Mobile|iPhone|iPad|iPod/i.test(userAgent);
        
        // Check for desktop
        this.device.isDesktop = !this.device.isMobile;
        
        // Detect browser
        if (userAgent.includes('Chrome')) {
            this.device.browserName = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
            this.device.browserName = 'Firefox';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            this.device.browserName = 'Safari';
        } else if (userAgent.includes('OculusBrowser')) {
            this.device.browserName = 'Oculus Browser';
        } else if (userAgent.includes('Edge')) {
            this.device.browserName = 'Edge';
        }
        
        // Check for WebXR and foveation support
        if (navigator.xr) {
            // We'll check for foveation support when the scene is ready
            this.checkFoveationSupport();
        }
        
        console.log('Device detected:', this.device);
    },
    
    // Check if foveation is supported
    checkFoveationSupport: function() {
        // We'll need to wait for the scene to be ready
        document.addEventListener('DOMContentLoaded', () => {
            const scene = document.querySelector('a-scene');
            if (!scene) return;
            
            scene.addEventListener('loaded', () => {
                if (scene.renderer && scene.renderer.xr && scene.renderer.xr.setFoveation) {
                    this.device.foveationSupported = true;
                    console.log('Foveation supported');
                } else {
                    console.log('Foveation not supported');
                }
            });
        });
    },
    
    // Apply optimizations based on detected device
    applyOptimizations: function() {
        // Set a global class on the document for CSS optimizations
        document.body.classList.add(this.getDeviceClass());
        
        // Apply Quest 2 specific optimizations
        if (this.device.isQuest2) {
            this.applyQuest2Optimizations();
        }
        // Apply mobile specific optimizations
        else if (this.device.isMobile) {
            this.applyMobileOptimizations();
        }
        // Apply desktop specific optimizations
        else {
            this.applyDesktopOptimizations();
        }
    },
    
    // Get a CSS class based on device type
    getDeviceClass: function() {
        if (this.device.isQuest2) return 'device-quest2';
        if (this.device.isQuest) return 'device-quest';
        if (this.device.isMobile) return 'device-mobile';
        return 'device-desktop';
    },
    
    // Apply Quest 2 specific optimizations
    applyQuest2Optimizations: function() {
        console.log('Applying Quest 2 optimizations');
        
        // Force low or medium performance level
        document.addEventListener('DOMContentLoaded', () => {
            const scene = document.querySelector('a-scene');
            if (!scene) return;
            
            // Set performance optimizer to low for better framerate
            if (scene.hasAttribute('performance-optimizer')) {
                scene.setAttribute('performance-optimizer', 'level', 'low');
                scene.setAttribute('performance-optimizer', 'foveationLevel', '3');
            }
            
            // Update renderer settings for Quest 2
            scene.addEventListener('loaded', () => {
                if (scene.renderer) {
                    // Set precision to medium for better performance
                    scene.renderer.precision = 'mediump';
                    
                    // Apply foveation if available
                    if (scene.renderer.xr && scene.renderer.xr.setFoveation) {
                        scene.renderer.xr.setFoveation(3);
                    }
                }
            });
        });
        
        // Add a meta tag to prevent scaling
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    },
    
    // Apply mobile specific optimizations
    applyMobileOptimizations: function() {
        console.log('Applying mobile optimizations');
        
        // Set performance level to low
        document.addEventListener('DOMContentLoaded', () => {
            const scene = document.querySelector('a-scene');
            if (!scene) return;
            
            if (scene.hasAttribute('performance-optimizer')) {
                scene.setAttribute('performance-optimizer', 'level', 'low');
            }
        });
    },
    
    // Apply desktop specific optimizations
    applyDesktopOptimizations: function() {
        console.log('Applying desktop optimizations');
        
        // Set performance level to high
        document.addEventListener('DOMContentLoaded', () => {
            const scene = document.querySelector('a-scene');
            if (!scene) return;
            
            if (scene.hasAttribute('performance-optimizer')) {
                scene.setAttribute('performance-optimizer', 'level', 'high');
            }
        });
    },
    
    // Setup VR mode change listeners
    setupVRListeners: function() {
        document.addEventListener('DOMContentLoaded', () => {
            const scene = document.querySelector('a-scene');
            if (!scene) return;
            
            // When entering VR mode
            scene.addEventListener('enter-vr', () => {
                console.log('Entered VR mode');
                this.onEnterVR();
            });
            
            // When exiting VR mode
            scene.addEventListener('exit-vr', () => {
                console.log('Exited VR mode');
                this.onExitVR();
            });
        });
    },
    
    // Handle entering VR mode
    onEnterVR: function() {
        // For Quest 2, apply additional optimizations
        if (this.device.isQuest2) {
            // Could inject additional optimizations here
        }
    },
    
    // Handle exiting VR mode
    onExitVR: function() {
        // Reset any VR-specific optimizations
    }
};

// Initialize device optimizer on load
window.addEventListener('load', function() {
    window.DeviceOptimizer.init();
});
