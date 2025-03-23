/**
 * Cosmic Particles - Creates a dynamic particle system for space atmosphere
 */
AFRAME.registerComponent('cosmic-particles', {
    schema: {
        count: {type: 'number', default: 1000},
        color: {type: 'color', default: '#ffffff'},
        size: {type: 'number', default: 0.05},
        speed: {type: 'number', default: 0.01}
    },
    
    init: function() {
        // Create particle system
        const data = this.data;
        const scene = this.el.sceneEl.object3D;
        
        // Create geometry and material
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: data.color,
            size: data.size,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // Create particles
        const positions = new Float32Array(data.count * 3);
        const velocities = [];
        
        for (let i = 0; i < data.count; i++) {
            // Random position in a sphere
            const radius = 20 + Math.random() * 80;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Random velocities
            velocities.push({
                x: (Math.random() - 0.5) * data.speed,
                y: (Math.random() - 0.5) * data.speed,
                z: (Math.random() - 0.5) * data.speed
            });
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create particle system
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.el.setObject3D('particle-system', this.particles);
        
        // Store velocity data for animation
        this.velocities = velocities;
    },
    
    tick: function(time, delta) {
        if (!this.particles) return;
        
        const positions = this.particles.geometry.attributes.position.array;
        
        // Update particles positions
        for (let i = 0; i < this.data.count; i++) {
            positions[i * 3] += this.velocities[i].x;
            positions[i * 3 + 1] += this.velocities[i].y;
            positions[i * 3 + 2] += this.velocities[i].z;
            
            // Reset particles that go too far
            const distance = Math.sqrt(
                positions[i * 3] ** 2 + 
                positions[i * 3 + 1] ** 2 + 
                positions[i * 3 + 2] ** 2
            );
            
            if (distance > 100) {
                const scale = 20 / distance;
                positions[i * 3] *= scale;
                positions[i * 3 + 1] *= scale;
                positions[i * 3 + 2] *= scale;
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
    },
    
    remove: function() {
        if (this.particles) {
            this.el.removeObject3D('particle-system');
        }
    }
});

/**
 * Celestial Object - Creates procedural planets and stars
 */
AFRAME.registerComponent('celestial-object', {
    schema: {
        type: {type: 'string', default: 'planet', oneOf: ['planet', 'star', 'asteroid']},
        radius: {type: 'number', default: 1},
        color1: {type: 'color', default: '#3498db'},
        color2: {type: 'color', default: '#2980b9'},
        emissive: {type: 'boolean', default: false},
        rotationSpeed: {type: 'number', default: 0.001}
    },
    
    init: function() {
        const data = this.data;
        this.objectGroup = new THREE.Group();
        
        switch(data.type) {
            case 'planet':
                this.createPlanet();
                break;
            case 'star':
                this.createStar();
                break;
            case 'asteroid':
                this.createAsteroid();
                break;
        }
        
        this.el.setObject3D('celestial-object', this.objectGroup);
    },
    
    createPlanet: function() {
        const data = this.data;
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        
        // Create planet material with custom shader for performance
        const material = new THREE.MeshStandardMaterial({
            color: data.color1,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const planet = new THREE.Mesh(geometry, material);
        this.objectGroup.add(planet);
    },
    
    createStar: function() {
        const data = this.data;
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        
        // Create emissive material for star
        const material = new THREE.MeshStandardMaterial({
            color: data.color1,
            emissive: data.color1,
            emissiveIntensity: 1,
            roughness: 0.2,
            metalness: 0.5
        });
        
        const star = new THREE.Mesh(geometry, material);
        this.objectGroup.add(star);
        
        // Add light source
        const light = new THREE.PointLight(data.color1, 1, 100);
        this.objectGroup.add(light);
    },
    
    createAsteroid: function() {
        const data = this.data;
        // Use icosahedron for performance over detailed geometry
        const geometry = new THREE.IcosahedronGeometry(data.radius, 1);
        
        // Randomize vertices for asteroid look
        const positions = geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            positions.setXYZ(
                i,
                positions.getX(i) * (0.8 + Math.random() * 0.4),
                positions.getY(i) * (0.8 + Math.random() * 0.4),
                positions.getZ(i) * (0.8 + Math.random() * 0.4)
            );
        }
        
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshStandardMaterial({
            color: data.color1,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const asteroid = new THREE.Mesh(geometry, material);
        this.objectGroup.add(asteroid);
    },
    
    tick: function(time, delta) {
        if (this.objectGroup) {
            this.objectGroup.rotation.y += this.data.rotationSpeed;
        }
    },
    
    remove: function() {
        if (this.objectGroup) {
            this.el.removeObject3D('celestial-object');
        }
    }
});

/**
 * Performance Optimizer - Adjusts rendering settings for better performance
 */
AFRAME.registerComponent('performance-optimizer', {
    schema: {
        level: {type: 'string', default: 'medium', oneOf: ['low', 'medium', 'high']},
        foveationLevel: {type: 'number', default: 2},
        dynamicFoveation: {type: 'boolean', default: true}
    },
    
    init: function() {
        const data = this.data;
        const scene = this.el.sceneEl;
        
        // Apply foveation settings (Quest 2 specific)
        if (scene.renderer) {
            // Check if WebXR foveation is available
            if (scene.renderer.xr && scene.renderer.xr.setFoveation) {
                console.log('Setting foveation level:', data.foveationLevel);
                scene.renderer.xr.setFoveation(data.foveationLevel);
            }
        }
        
        // Apply performance level settings
        switch(data.level) {
            case 'low':
                this.applyLowPerformance();
                break;
            case 'medium':
                this.applyMediumPerformance();
                break;
            case 'high':
                this.applyHighPerformance();
                break;
        }
        
        // Optimize renderer settings
        if (scene.renderer) {
            // Use power preference for better battery performance
            scene.renderer.powerPreference = 'high-performance';
            
            // Limit precision for better performance
            scene.renderer.precision = 'mediump';
        }
    },
    
    applyLowPerformance: function() {
        const scene = this.el.sceneEl;
        
        // Reduce shadow quality
        if (scene.renderer && scene.renderer.shadowMap) {
            scene.renderer.shadowMap.enabled = false;
        }
        
        // Reduce draw distance
        if (scene.camera) {
            scene.camera.far = 500;
        }
        
        // Find all entities with the 'celestial-object' component and reduce their detail
        const celestialObjects = document.querySelectorAll('[celestial-object]');
        celestialObjects.forEach(entity => {
            const component = entity.components['celestial-object'];
            if (component) {
                // Reduce the detail of the geometry
                if (component.objectGroup) {
                    component.objectGroup.traverse(obj => {
                        if (obj.geometry && obj.geometry.type.includes('Sphere')) {
                            // Reduce sphere segments
                            obj.geometry = new THREE.SphereGeometry(obj.geometry.parameters.radius, 16, 16);
                        }
                    });
                }
            }
        });
    },
    
    applyMediumPerformance: function() {
        const scene = this.el.sceneEl;
        
        // Moderate shadow quality
        if (scene.renderer && scene.renderer.shadowMap) {
            scene.renderer.shadowMap.enabled = true;
            scene.renderer.shadowMap.type = THREE.PCFShadowMap;
        }
        
        // Moderate draw distance
        if (scene.camera) {
            scene.camera.far = 1000;
        }
    },
    
    applyHighPerformance: function() {
        const scene = this.el.sceneEl;
        
        // High quality shadows
        if (scene.renderer && scene.renderer.shadowMap) {
            scene.renderer.shadowMap.enabled = true;
            scene.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        
        // Extended draw distance
        if (scene.camera) {
            scene.camera.far = 2000;
        }
    },
    
    tick: function() {
        // If using dynamic foveation, could adjust foveation level based on framerate
        if (this.data.dynamicFoveation) {
            // This would require measuring performance, which we're not implementing here
            // for simplicity
        }
    }
});

/**
 * Interactive Object - Makes objects interactable in VR
 */
AFRAME.registerComponent('interactive-object', {
    schema: {
        highlightColor: {type: 'color', default: '#ffff00'},
        action: {type: 'string', default: 'none'}
    },
    
    init: function() {
        this.originalColor = null;
        this.originalMaterial = null;
        this.isHighlighted = false;
        
        // Store reference to mesh
        this.mesh = this.el.getObject3D('mesh');
        
        // Setup event listeners for interaction
        this.el.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.el.addEventListener('click', this.onClick.bind(this));
    },
    
    onMouseEnter: function() {
        if (this.mesh && this.mesh.material) {
            if (!this.originalMaterial) {
                this.originalMaterial = this.mesh.material.clone();
            }
            this.mesh.material.emissive = new THREE.Color(this.data.highlightColor);
            this.mesh.material.emissiveIntensity = 0.5;
            this.isHighlighted = true;
        }
    },
    
    onMouseLeave: function() {
        if (this.mesh && this.mesh.material && this.isHighlighted) {
            if (this.originalMaterial) {
                this.mesh.material.emissive = this.originalMaterial.emissive;
                this.mesh.material.emissiveIntensity = this.originalMaterial.emissiveIntensity;
            }
            this.isHighlighted = false;
        }
    },
    
    onClick: function() {
        // Handle different actions
        switch(this.data.action) {
            case 'teleport':
                // Teleport player to object
                const cameraRig = document.getElementById('rig');
                if (cameraRig) {
                    const position = this.el.getAttribute('position');
                    cameraRig.setAttribute('position', {
                        x: position.x,
                        y: position.y + 2,  // Offset to place player above object
                        z: position.z
                    });
                }
                break;
                
            case 'info':
                // Show information about object
                // This would typically update a UI element or trigger an animation
                const objectName = this.el.getAttribute('data-name') || 'Unknown';
                console.log(`Displaying info for: ${objectName}`);
                break;
                
            default:
                // Custom action can be implemented
                console.log('Interactive object clicked');
        }
    },
    
    remove: function() {
        this.el.removeEventListener('mouseenter', this.onMouseEnter);
        this.el.removeEventListener('mouseleave', this.onMouseLeave);
        this.el.removeEventListener('click', this.onClick);
    }
});
