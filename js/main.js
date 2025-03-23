/**
 * Main application script - initializes the VR experience
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cosmic Drift VR initializing...');
    
    // Add any initialization code here
    
    // Handle browser-specific VR setup
    setupVRSupport();
    
    // Update UI based on device capabilities
    updateUIForDevice();
});

/**
 * Set up VR support detection and adaptation
 */
function setupVRSupport() {
    // Check for WebXR support
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr')
            .then((supported) => {
                if (supported) {
                    console.log('WebXR immersive-vr supported');
                    document.body.classList.add('vr-supported');
                } else {
                    console.log('WebXR immersive-vr not supported');
                    document.body.classList.add('vr-not-supported');
                    showVRNotSupportedMessage();
                }
            })
            .catch((err) => {
                console.error('Error checking XR support:', err);
                document.body.classList.add('vr-not-supported');
                showVRNotSupportedMessage();
            });
    } else {
        console.log('WebXR not available');
        // Fall back to mobile view
        document.body.classList.add('vr-not-supported');
        showVRNotSupportedMessage();
    }
}

/**
 * Update UI elements based on device capabilities
 */
function updateUIForDevice() {
    // Check if running on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Adjust UI for mobile
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            instructions.innerHTML = '<p>Tap the VR button and place your device in your headset</p>';
        }
    } else {
        document.body.classList.add('desktop-device');
    }
}

/**
 * Show a message when VR is not supported
 */
function showVRNotSupportedMessage() {
    const instructions = document.querySelector('.instructions');
    if (instructions) {
        instructions.innerHTML = '<p>VR not supported on your device.</p><p>Try using an Oculus Quest 2 or other VR headset.</p>';
    }
}
