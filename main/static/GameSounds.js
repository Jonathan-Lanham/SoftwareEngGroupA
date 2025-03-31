class GameSounds {
    /**
     * Create a new GameSounds instance
     */
    constructor() {
      this.sounds = {};
      this.music = {};
      this.currentMusic = null;
      this.soundVolume = 1.0;
      this.musicVolume = 0.5;
      this.soundEnabled = true;
      this.musicEnabled = true;
    }
  
    /**
     * Load a sound effect
     * @param {string} name - Identifier for the sound
     * @param {string} path - File path to the sound
     * @return {Promise} - Promise that resolves when the sound is loaded
     */
    loadSound(name, path) {
      return new Promise((resolve, reject) => {
        this.sounds[name] = loadSound(
          path,
          () => resolve(this.sounds[name]),
          (err) => reject(err)
        );
      });
    }
  
    /**
     * Load multiple sounds at once
     * @param {Object} soundPaths - Object with keys as sound names and values as file paths
     * @return {Promise} - Promise that resolves when all sounds are loaded
     */
    loadSounds(soundPaths) {
      const promises = [];
      for (const [name, path] of Object.entries(soundPaths)) {
        promises.push(this.loadSound(name, path));
      }
      return Promise.all(promises);
    }
  
    /**
     * Load a music track
     * @param {string} name - Identifier for the music
     * @param {string} path - File path to the music
     * @return {Promise} - Promise that resolves when the music is loaded
     */
    loadMusic(name, path) {
      return new Promise((resolve, reject) => {
        this.music[name] = loadSound(
          path,
          () => {
            this.music[name].setLoop(true);
            resolve(this.music[name]);
          },
          (err) => reject(err)
        );
      });
    }
  
    /**
     * Play a sound effect
     * @param {string} name - Name of the sound to play
     * @param {number} [volume] - Optional volume override (0.0 to 1.0)
     * @return {p5.SoundFile} - The sound that was played or null if not found
     */
    play(name, volume = null) {
      if (!this.soundEnabled || !this.sounds[name]) return null;
      
      const sound = this.sounds[name];
      sound.setVolume(volume !== null ? volume : this.soundVolume);
      sound.play();
      return sound;
    }
  
    /**
     * Play music track
     * @param {string} name - Name of the music to play
     * @param {number} [fadeTime=1.0] - Time in seconds to fade in
     * @return {p5.SoundFile} - The music that was played or null if not found
     */
    playMusic(name, fadeTime = 1.0) {
      if (!this.musicEnabled || !this.music[name]) return null;
  
      // Stop current music if any is playing
      if (this.currentMusic) {
        this.stopMusic(fadeTime);
      }
  
      const music = this.music[name];
      this.currentMusic = name;
      
      // Start at 0 volume and fade in
      music.setVolume(0);
      music.play();
      
      // Fade in
      const startTime = millis();
      const fadeInterval = setInterval(() => {
        const elapsed = (millis() - startTime) / 1000;
        const progress = min(elapsed / fadeTime, 1.0);
        music.setVolume(progress * this.musicVolume);
        
        if (progress >= 1.0) {
          clearInterval(fadeInterval);
        }
      }, 50);
      
      return music;
    }
  
    /**
     * Stop currently playing music
     * @param {number} [fadeTime=1.0] - Time in seconds to fade out
     */
    stopMusic(fadeTime = 1.0) {
      if (!this.currentMusic) return;
      
      const music = this.music[this.currentMusic];
      const startVolume = music.getVolume();
      const startTime = millis();
      
      const fadeInterval = setInterval(() => {
        const elapsed = (millis() - startTime) / 1000;
        const progress = min(elapsed / fadeTime, 1.0);
        music.setVolume(startVolume * (1 - progress));
        
        if (progress >= 1.0) {
          music.stop();
          clearInterval(fadeInterval);
        }
      }, 50);
      
      this.currentMusic = null;
    }
  
    /**
     * Pause all sounds
     */
    pauseAll() {
      // Pause sound effects
      Object.values(this.sounds).forEach(sound => {
        if (sound.isPlaying()) {
          sound.pause();
        }
      });
      
      // Pause music
      if (this.currentMusic) {
        this.music[this.currentMusic].pause();
      }
    }
  
    /**
     * Resume all paused sounds
     */
    resumeAll() {
      if (!this.soundEnabled && !this.musicEnabled) return;
      
      // Resume sound effects if sound is enabled
      if (this.soundEnabled) {
        Object.values(this.sounds).forEach(sound => {
          if (sound.isPaused()) {
            sound.play();
          }
        });
      }
      
      // Resume music if music is enabled
      if (this.musicEnabled && this.currentMusic) {
        if (this.music[this.currentMusic].isPaused()) {
          this.music[this.currentMusic].play();
        }
      }
    }
  
    /**
     * Set global volume for all sound effects
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setSoundVolume(volume) {
      this.soundVolume = constrain(volume, 0, 1);
    }
  
    /**
     * Set global volume for all music
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setMusicVolume(volume) {
      this.musicVolume = constrain(volume, 0, 1);
      if (this.currentMusic) {
        this.music[this.currentMusic].setVolume(this.musicVolume);
      }
    }
  
    /**
     * Enable or disable sound effects
     * @param {boolean} enabled - Whether sound effects should be enabled
     */
    enableSound(enabled) {
      this.soundEnabled = enabled;
    }
  
    /**
     * Enable or disable music
     * @param {boolean} enabled - Whether music should be enabled
     */
    enableMusic(enabled) {
      this.musicEnabled = enabled;
      
      if (!enabled && this.currentMusic) {
        this.music[this.currentMusic].pause();
      } else if (enabled && this.currentMusic && this.music[this.currentMusic].isPaused()) {
        this.music[this.currentMusic].play();
      }
    }
}