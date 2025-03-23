/**
 * Screenshot functionality for Cosmic Drift VR
 * Allows taking screenshots both in and out of VR
 */

// Global screenshot object
window.ScreenshotUtil = {
    // Initialize
    init: function() {
        console.log('Initializing screenshot utility');
        
        // Add key listeners
        this.addKeyListeners();
        
        // Add screenshot button if in debug/test mode
        this.addScreenshotButton();
    },
    
    // Add key listeners for screenshots
    addKeyListeners: function() {
        document.addEventListener('keydown', (event) => {
            // Press 'P' to take a screenshot
            if (event.key === 'p') {
                this.takeScreenshot();
            }
        });
    },
    
    // Add a button for screenshots in test mode
    addScreenshotButton: function() {
        // Only add button in test mode
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('test') && window.location.hostname !== 'localhost') {
            return;
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'fixed';
            buttonContainer.style.bottom = '20px';
            buttonContainer.style.right = '20px';
            buttonContainer.style.zIndex = '9999';
            
            const screenshotBtn = document.createElement('button');
            screenshotBtn.textContent = '📷 Screenshot';
            screenshotBtn.style.padding = '10px 15px';
            screenshotBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            screenshotBtn.style.color = 'white';
            screenshotBtn.style.border = 'none';
            screenshotBtn.style.borderRadius = '5px';
            screenshotBtn.style.cursor = 'pointer';
            
            screenshotBtn.addEventListener('click', () => {
                this.takeScreenshot();
            });
            
            buttonContainer.appendChild(screenshotBtn);
            document.body.appendChild(buttonContainer);
        });
    },
    
    // Take a screenshot of the current view
    takeScreenshot: function() {
        console.log('Taking screenshot...');
        
        const scene = document.querySelector('a-scene');
        if (!scene) {
            console.error('No A-Frame scene found');
            return;
        }
        
        // Get canvas
        const canvas = scene.canvas;
        if (!canvas) {
            console.error('No canvas found in A-Frame scene');
            return;
        }
        
        try {
            // Create a new canvas to capture the screenshot
            const screenshotCanvas = document.createElement('canvas');
            const context = screenshotCanvas.getContext('2d');
            
            // Set dimensions to match the original canvas
            screenshotCanvas.width = canvas.width;
            screenshotCanvas.height = canvas.height;
            
            // Draw the scene to the new canvas
            context.drawImage(canvas, 0, 0);
            
            // Convert to image data URL
            const imageDataURL = screenshotCanvas.toDataURL('image/png');
            
            // Create a link and trigger download
            const link = document.createElement('a');
            link.href = imageDataURL;
            link.download = `cosmic-drift-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Screenshot taken successfully');
            
            // Show a brief visual feedback
            this.showScreenshotFeedback();
        } catch (error) {
            console.error('Error taking screenshot:', error);
        }
    },
    
    // Show visual feedback that a screenshot was taken
    showScreenshotFeedback: function() {
        const feedback = document.createElement('div');
        feedback.textContent = 'Screenshot Captured!';
        feedback.style.position = 'fixed';
        feedback.style.top = '50%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        feedback.style.color = 'white';
        feedback.style.padding = '20px';
        feedback.style.borderRadius = '10px';
        feedback.style.fontFamily = 'Arial, sans-serif';
        feedback.style.fontSize = '18px';
        feedback.style.zIndex = '10000';
        feedback.style.pointerEvents = 'none';
        
        document.body.appendChild(feedback);
        
        // Fade out and remove after 2 seconds
        setTimeout(() => {
            feedback.style.transition = 'opacity 0.5s ease-out';
            feedback.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 500);
        }, 1500);
    }
};

// Initialize screenshot utility
window.addEventListener('load', function() {
    window.ScreenshotUtil.init();
});
