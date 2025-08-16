const SPEED_STORAGE_KEY = 'youtube-playback-speed';
let videoElement; // Keep a reference to the video element

// This function saves the new speed to Chrome's storage
const saveSpeed = (speed) => {
  chrome.storage.local.set({ [SPEED_STORAGE_KEY]: speed });
  console.log(`YouTube Speed Keeper: New speed saved -> ${speed}x`);
};

// This function gets the saved speed and applies it to the video
const applySavedSpeed = () => {
  chrome.storage.local.get([SPEED_STORAGE_KEY], (result) => {
    const savedSpeed = result[SPEED_STORAGE_KEY] || 1.0; // Default to 1.0 if nothing is saved
    if (videoElement.playbackRate !== savedSpeed) {
      videoElement.playbackRate = savedSpeed;
    }
    console.log(`YouTube Speed Keeper: Applied speed -> ${savedSpeed}x`);
  });
};

// This is the main function to set everything up
const initializeSpeedController = () => {
  // Use setInterval to repeatedly look for the video element
  const interval = setInterval(() => {
    videoElement = document.querySelector('video.html5-main-video');

    if (videoElement) {
      // Once the video is found, stop checking
      clearInterval(interval);
      console.log("YouTube Speed Keeper: Video element found!");

      // Apply the last saved speed
      applySavedSpeed();

      // Add a listener that saves the speed whenever the user changes it
      videoElement.addEventListener('ratechange', () => {
        saveSpeed(videoElement.playbackRate);
      });
    }
  }, 1000); // Check every 1 second
};

// YouTube uses dynamic navigation, so we need to re-initialize when a new video loads
// in the same tab. The 'yt-navigate-finish' event is perfect for this.
document.addEventListener('yt-navigate-finish', initializeSpeedController);

// Run the initializer for the first time on page load
initializeSpeedController();