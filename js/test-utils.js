/**
 * Test utilities for Cosmic Drift VR
 * These functions help test performance and compatibility with Quest 2
 */

// Global test object
window.CosmicDriftTests = {
    // Performance metrics
    performanceMetrics: {
        fps: 0,
        frameTime: 0,
        memoryUsage: 0
    },
    
    // Test results
    testResults: {},
    
    // Initialize tests
    init: function() {
        console.log('Initializing Cosmic Drift test utilities');
        
        // Only run in dev mode or with URL param ?test=true
        if (!this.isTestMode()) {
            return;
        }
        
        // Setup FPS counter
        this.setupPerformanceMonitoring();
        
        // Setup device compatibility test
        this.testDeviceCompatibility();
        
        // Setup WebXR compatibility test
        this.testWebXR();
        
        // Setup rendering test
        this.testRendering();
        
        // Setup test UI
        this.setupTestUI();
    },
    
    // Check if we're in test mode
    isTestMode: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('test') || window.location.hostname === 'localhost';
    },
    
    // Set up performance monitoring
    setupPerformanceMonitoring: function() {
        let lastTime = performance.now();
        let frames = 0;
        
        // Define frame counter
        const countFrames = () => {
            frames++;
            const now = performance.now();
            
            // Update every second
            if (now - lastTime >= 1000) {
                this.performanceMetrics.fps = frames;
                this.performanceMetrics.frameTime = (now - lastTime) / frames;
                
                // Try to get memory info if available
                if (performance.memory) {
                    this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
                }
                
                // Log metrics
                console.log(`Performance: ${this.performanceMetrics.fps} FPS, ${this.performanceMetrics.frameTime.toFixed(2)}ms per frame`);
                
                // Reset counters
                frames = 0;
                lastTime = now;
                
                // Update UI if exists
                this.updateTestUI();
            }
            
            // Request next frame
            requestAnimationFrame(countFrames);
        };
        
        // Start counting
        requestAnimationFrame(countFrames);
    },
    
    // Test device compatibility for Quest 2
    testDeviceCompatibility: function() {
        const userAgent = navigator.userAgent;
        console.log('User Agent:', userAgent);
        
        // Check for Quest browser
        const isQuest = userAgent.includes('Quest');
        
        // Check for mobile
        const isMobile = /Android|Mobile|Quest/i.test(userAgent);
        
        // Set results
        this.testResults.isQuest = isQuest;
        this.testResults.isMobile = isMobile;
        
        console.log(`Device compatibility: ${isQuest ? 'Running on Quest' : 'Not running on Quest'}`);
    },
    
    // Test WebXR support
    testWebXR: function() {
        if (navigator.xr) {
            navigator.xr.isSessionSupported('immersive-vr')
                .then(supported => {
                    this.testResults.webXRSupported = supported;
                    console.log(`WebXR immersive-vr support: ${supported ? 'Yes' : 'No'}`);
                })
                .catch(err => {
                    this.testResults.webXRSupported = false;
                    console.error('Error checking WebXR support:', err);
                });
        } else {
            this.testResults.webXRSupported = false;
            console.log('WebXR not available');
        }
    },
    
    // Test rendering capabilities
    testRendering: function() {
        // Create a test renderer to check capabilities
        const canvas = document.createElement('canvas');
        let gl;
        
        try {
            // Try to get WebGL 2 context
            gl = canvas.getContext('webgl2');
            if (gl) {
                this.testResults.webGL = 2;
            } else {
                // Fall back to WebGL 1
                gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                this.testResults.webGL = gl ? 1 : 0;
            }
        } catch (e) {
            this.testResults.webGL = 0;
            console.error('Error testing WebGL:', e);
        }
        
        if (gl) {
            // Get renderer info
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                
                this.testResults.renderer = renderer;
                this.testResults.vendor = vendor;
                
                console.log(`Graphics: ${vendor} ${renderer}`);
            }
            
            // Check max textures
            this.testResults.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            
            // Test float textures
            const floatTextures = gl.getExtension('OES_texture_float');
            this.testResults.floatTexturesSupported = !!floatTextures;
        }
    },
    
    // Set up a simple test UI
    setupTestUI: function() {
        if (document.getElementById('cosmic-drift-test-ui')) {
            return;
        }
        
        const testUI = document.createElement('div');
        testUI.id = 'cosmic-drift-test-ui';
        testUI.style.position = 'fixed';
        testUI.style.top = '10px';
        testUI.style.left = '10px';
        testUI.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        testUI.style.color = 'white';
        testUI.style.padding = '10px';
        testUI.style.borderRadius = '5px';
        testUI.style.fontFamily = 'monospace';
        testUI.style.fontSize = '14px';
        testUI.style.zIndex = '9999';
        testUI.style.maxWidth = '300px';
        
        testUI.innerHTML = '<h3>Cosmic Drift Test Mode</h3>' +
            '<div id="test-fps">FPS: --</div>' +
            '<div id="test-device">Device: --</div>' +
            '<div id="test-webxr">WebXR: --</div>' +
            '<div id="test-webgl">WebGL: --</div>';
        
        document.body.appendChild(testUI);
    },
    
    // Update the test UI
    updateTestUI: function() {
        const fpsEl = document.getElementById('test-fps');
        const deviceEl = document.getElementById('test-device');
        const webxrEl = document.getElementById('test-webxr');
        const webglEl = document.getElementById('test-webgl');
        
        if (fpsEl) {
            fpsEl.textContent = `FPS: ${this.performanceMetrics.fps} (${this.performanceMetrics.frameTime.toFixed(2)}ms)`;
            // Color code based on performance
            if (this.performanceMetrics.fps >= 60) {
                fpsEl.style.color = '#4CAF50'; // Green
            } else if (this.performanceMetrics.fps >= 30) {
                fpsEl.style.color = '#FFC107'; // Yellow
            } else {
                fpsEl.style.color = '#F44336'; // Red
            }
        }
        
        if (deviceEl) {
            deviceEl.textContent = `Device: ${this.testResults.isQuest ? 'Quest' : (this.testResults.isMobile ? 'Mobile' : 'Desktop')}`;
        }
        
        if (webxrEl) {
            webxrEl.textContent = `WebXR: ${this.testResults.webXRSupported ? 'Supported' : 'Not Supported'}`;
            webxrEl.style.color = this.testResults.webXRSupported ? '#4CAF50' : '#F44336';
        }
        
        if (webglEl) {
            webglEl.textContent = `WebGL: ${this.testResults.webGL === 2 ? 'WebGL 2' : (this.testResults.webGL === 1 ? 'WebGL 1' : 'Not Supported')}`;
            webglEl.style.color = this.testResults.webGL > 0 ? '#4CAF50' : '#F44336';
        }
    }
};

// Initialize tests when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.CosmicDriftTests.init();
});
