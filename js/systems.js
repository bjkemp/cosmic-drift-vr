/**
 * Scene Manager - Handles procedural generation and scene management
 */
AFRAME.registerSystem('scene-manager', {
    init: function() {
        this.celestialObjects = [];
        this.sceneLoaded = false;
        
        // Setup event listeners
        this.el.addEventListener('enter-vr', this.onEnterVR.bind(this));
        this.el.addEventListener('exit-vr', this.onExitVR.bind(this));
        this.el.addEventListener('loaded', this.onSceneLoaded.bind(this));
        
        // Bind methods
        this.generateCelestialObjects = this.generateCelestialObjects.bind(this);
    },
    
    onSceneLoaded: function() {
        console.log('Scene loaded');
        this.sceneLoaded = true;
        
        // Hide loading UI, show enter VR button
        const loadingUI = document.getElementById('loading-ui');
        const uiOverlay = document.getElementById('ui-overlay');
        
        if (loadingUI) {
            loadingUI.setAttribute('visible', 'true');
        }
        
        // Generate initial celestial objects
        this.generateCelestialObjects();
        
        // Add event listener to enter VR button
        const enterVRButton = document.getElementById('enter-vr-button');
        if (enterVRButton) {
            enterVRButton.addEventListener('click', () => {
                this.el.enterVR();
            });
        }
    },
    
    onEnterVR: function() {
        console.log('Entered VR');
        // Hide desktop UI
        const uiOverlay = document.getElementById('ui-overlay');
        if (uiOverlay) {
            uiOverlay.classList.add('hidden');
        }
        
        // Hide enter VR button
        const loadingUI = document.getElementById('loading-ui');
        if (loadingUI) {
            loadingUI.setAttribute('visible', 'false');
        }
    },
    
    onExitVR: function() {
        console.log('Exited VR');
        // Show desktop UI
        const uiOverlay = document.getElementById('ui-overlay');
        if (uiOverlay) {
            uiOverlay.classList.remove('hidden');
        }
    },
    
    generateCelestialObjects: function() {
        // Clear existing objects
        this.celestialObjects.forEach(obj => {
            if (obj.parentElement) {
                obj.parentElement.removeChild(obj);
            }
        });
        this.celestialObjects = [];
        
        const container = document.getElementById('celestial-objects');
        if (!container) return;
        
        // Generate planets and stars in a spiral pattern
        const numObjects = 20;  // Reduced for performance
        
        for (let i = 0; i < numObjects; i++) {
            // Calculate position in a spiral pattern
            const angle = i * 0.5;
            const radius = 30 + i * 10;
            const x = radius * Math.cos(angle);
            const y = (Math.random() - 0.5) * 30;
            const z = radius * Math.sin(angle);
            
            // Determine object type
            let objectType, objectSize, color1, color2;
            
            if (i === 0) {
                // Center star
                objectType = 'star';
                objectSize = 5;
                color1 = '#ffcc33';
                color2 = '#ff9900';
            } else if (i % 5 === 0) {
                // Stars
                objectType = 'star';
                objectSize = 1 + Math.random() * 2;
                
                // Random star color
                const starColors = ['#ffffff', '#ffffcc', '#aaccff', '#ffccaa'];
                color1 = starColors[Math.floor(Math.random() * starColors.length)];
                color2 = color1;
            } else if (i % 7 === 0) {
                // Asteroids
                objectType = 'asteroid';
                objectSize = 0.5 + Math.random() * 1.5;
                color1 = '#aaaaaa';
                color2 = '#888888';
            } else {
                // Planets
                objectType = 'planet';
                objectSize = 1 + Math.random() * 3;
                
                // Random planet colors
                const planetColors = [
                    {c1: '#3498db', c2: '#2980b9'}, // Blue
                    {c1: '#e74c3c', c2: '#c0392b'}, // Red
                    {c1: '#2ecc71', c2: '#27ae60'}, // Green
                    {c1: '#f1c40f', c2: '#f39c12'}, // Yellow
                    {c1: '#9b59b6', c2: '#8e44ad'}  // Purple
                ];
                
                const colorScheme = planetColors[Math.floor(Math.random() * planetColors.length)];
                color1 = colorScheme.c1;
                color2 = colorScheme.c2;
            }
            
            // Create element
            const celestialObject = document.createElement('a-entity');
            celestialObject.setAttribute('position', `${x} ${y} ${z}`);
            celestialObject.setAttribute('celestial-object', {
                type: objectType,
                radius: objectSize,
                color1: color1,
                color2: color2,
                emissive: objectType === 'star',
                rotationSpeed: 0.0005 + Math.random() * 0.001
            });
            
            // Make it interactive
            if (objectType !== 'star' || i !== 0) {  // Don't make the center star interactive
                celestialObject.setAttribute('interactive-object', {
                    action: 'teleport',
                    highlightColor: '#ffffff'
                });
                celestialObject.setAttribute('data-name', `Celestial Body ${i}`);
            }
            
            container.appendChild(celestialObject);
            this.celestialObjects.push(celestialObject);
        }
    }
});

/**
 * Player Manager - Handles player movement and interaction
 */
AFRAME.registerSystem('player-manager', {
    init: function() {
        this.playerRig = null;
        this.camera = null;
        this.leftHand = null;
        this.rightHand = null;
        
        // Wait for scene to load
        this.el.addEventListener('loaded', this.onSceneLoaded.bind(this));
    },
    
    onSceneLoaded: function() {
        // Get references to player elements
        this.playerRig = document.getElementById('rig');
        this.camera = document.getElementById('player-camera');
        this.leftHand = document.getElementById('left-hand');
        this.rightHand = document.getElementById('right-hand');
        
        if (this.playerRig && this.camera) {
            console.log('Player rig initialized');
            
            // Set up event listeners for controller input
            if (this.leftHand) {
                this.leftHand.addEventListener('triggerdown', this.onTriggerDown.bind(this, 'left'));
                this.leftHand.addEventListener('triggerup', this.onTriggerUp.bind(this, 'left'));
            }
            
            if (this.rightHand) {
                this.rightHand.addEventListener('triggerdown', this.onTriggerDown.bind(this, 'right'));
                this.rightHand.addEventListener('triggerup', this.onTriggerUp.bind(this, 'right'));
            }
        }
    },
    
    onTriggerDown: function(hand) {
        console.log(`${hand} trigger down`);
        // Handle trigger down events
        // This could be used for grabbing objects, shooting, etc.
    },
    
    onTriggerUp: function(hand) {
        console.log(`${hand} trigger up`);
        // Handle trigger up events
    },
    
    tick: function(time, delta) {
        // Handle continuous player updates here
        // For example, check for proximity to celestial objects
        
        if (this.playerRig && this.camera) {
            // Do any necessary updates
        }
    }
});

/**
 * UI Manager - Handles user interface elements
 */
AFRAME.registerSystem('ui-manager', {
    init: function() {
        // Hide UI overlay when VR mode starts
        document.addEventListener('DOMContentLoaded', () => {
            const scene = document.querySelector('a-scene');
            if (scene) {
                scene.addEventListener('enter-vr', () => {
                    const uiOverlay = document.getElementById('ui-overlay');
                    if (uiOverlay) {
                        uiOverlay.classList.add('hidden');
                    }
                });
                
                scene.addEventListener('exit-vr', () => {
                    const uiOverlay = document.getElementById('ui-overlay');
                    if (uiOverlay) {
                        uiOverlay.classList.remove('hidden');
                    }
                });
            }
        });
    }
});
