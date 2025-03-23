# Cosmic Drift VR - Quest 2 Guide

This guide provides specific instructions for running and optimizing Cosmic Drift VR on the Meta Quest 2 (formerly Oculus Quest 2).

## Getting Started

1. **Launch Oculus Browser**: From your Quest 2 home environment, open the Oculus Browser app.
   
2. **Navigate to the Experience**: Enter the URL for the Cosmic Drift VR experience:
   `https://yourusername.github.io/cosmic-drift-vr/`
   
3. **Enter VR Mode**: Tap the "Enter VR" button in the center of the screen to start the immersive experience.

## Controls

- **Movement**: Use the left thumbstick to fly through space
- **Rotation**: Use the right thumbstick to look around
- **Interaction**: Point at celestial objects and press the trigger to teleport to them
- **Menu**: Press the menu button on your right controller to access settings

## Performance Optimization

The application automatically detects Quest 2 hardware and applies the following optimizations:

- Foveated rendering (level 3) to improve performance
- Reduced draw distance and geometry complexity
- Medium precision for shaders
- Dynamic performance scaling based on device temperature

If you experience performance issues:

1. Make sure your Quest 2 is sufficiently charged (low battery can reduce performance)
2. Close other applications running in the background
3. Try adding `?perf=low` to the URL for maximum performance mode
4. If using Air Link or Link cable, ensure your PC meets the requirements

## Troubleshooting

### Common Issues

1. **WebXR Not Available**: Make sure you're using the latest version of Oculus Browser
   
2. **Low Frame Rate**: 
   - Add `?perf=low` to the URL
   - Ensure your Quest 2 has adequate battery charge
   - Let the headset cool down if it's been in use for a long time
   
3. **Controls Not Working**: 
   - Make sure your controllers are properly paired
   - Try restarting the browser and experience
   
4. **White Screen or Crash**:
   - Clear the browser cache
   - Restart the Oculus Browser
   - Ensure you have a stable internet connection

## Contest Entry Notes

This application was specifically designed for entry in the OneShot VR Game Contest with John Carmack as a judge. Key design decisions include:

1. **Optimized for Quest 2**: All rendering is performance-tuned for standalone VR
2. **WebXR Based**: Runs directly in the browser with no installation required
3. **Immersive Visuals**: Dynamic particle systems and procedural generation
4. **Minimal Dependency Design**: Core experience uses minimal external libraries
5. **Size Optimized**: Total download is kept small for fast loading

## Taking Screenshots

To capture screenshots of your experience:
- Press the 'P' key if using a keyboard
- In test mode, use the screenshot button in the lower right corner
- Screenshots are automatically saved to your downloads folder

## Feedback

We welcome feedback on your experience, especially regarding:
- Performance on Quest 2
- Visual quality and immersion
- Control scheme and interaction model
- Any bugs or issues encountered

Please submit feedback through GitHub issues or the contest submission form.
