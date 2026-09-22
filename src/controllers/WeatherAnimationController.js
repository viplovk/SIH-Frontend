// Algoriot Weather Animation Controller
// High-performance timeline manager utilizing requestAnimationFrame
// Governs frame interpolation, playback velocity, and layer switching

export class WeatherAnimationController {
  constructor({
    initialLayer = "temperature",
    initialTimeIndex = 0,
    frames = [],
    animationSpeed = 1.0,
    onFrameUpdate = null
  } = {}) {
    this.currentLayer = initialLayer;
    this.currentTimeIndex = initialTimeIndex;
    this.isPlaying = false;
    this.animationSpeed = animationSpeed; // 0.5x, 1x, 2x
    this.forecastFrames = frames;
    this.interpolationProgress = 0.0; // 0.0 -> 1.0 between consecutive frames

    this.listeners = new Set();
    if (onFrameUpdate) this.listeners.add(onFrameUpdate);

    this.rafId = null;
    this.lastTimestamp = performance.now();
    this.frameDurationMs = 2600; // Base time per forecast hour step (scaled by animationSpeed)

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      if (this.isPlaying) {
        this.wasPlayingBeforeHidden = true;
        this.pause();
      }
    } else {
      if (this.wasPlayingBeforeHidden) {
        this.wasPlayingBeforeHidden = false;
        this.play();
      }
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.error("WeatherAnimationController subscriber error:", err);
      }
    });
  }

  getState() {
    return {
      currentLayer: this.currentLayer,
      currentTimeIndex: this.currentTimeIndex,
      currentFrame: this.forecastFrames[this.currentTimeIndex] || null,
      nextFrame: this.forecastFrames[(this.currentTimeIndex + 1) % (this.forecastFrames.length || 1)] || null,
      isPlaying: this.isPlaying,
      animationSpeed: this.animationSpeed,
      interpolationProgress: this.interpolationProgress,
      totalFrames: this.forecastFrames.length
    };
  }

  setFrames(frames) {
    this.forecastFrames = frames || [];
    if (this.currentTimeIndex >= this.forecastFrames.length) {
      this.currentTimeIndex = 0;
    }
    this.notify();
  }

  setLayer(layerId) {
    if (this.currentLayer !== layerId) {
      this.currentLayer = layerId;
      this.notify();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.startLoop();
    this.notify();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.notify();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setTime(index) {
    const numFrames = this.forecastFrames.length || 1;
    this.currentTimeIndex = Math.max(0, Math.min(index, numFrames - 1));
    this.interpolationProgress = 0.0;
    this.notify();
  }

  setSpeed(speed) {
    this.animationSpeed = speed;
    this.notify();
  }

  nextFrame() {
    const numFrames = this.forecastFrames.length || 1;
    this.currentTimeIndex = (this.currentTimeIndex + 1) % numFrames;
    this.interpolationProgress = 0.0;
    this.notify();
  }

  previousFrame() {
    const numFrames = this.forecastFrames.length || 1;
    this.currentTimeIndex = (this.currentTimeIndex - 1 + numFrames) % numFrames;
    this.interpolationProgress = 0.0;
    this.notify();
  }

  startLoop() {
    const loop = (now) => {
      if (!this.isPlaying) return;

      const deltaMs = now - this.lastTimestamp;
      this.lastTimestamp = now;

      const effectiveDuration = this.frameDurationMs / this.animationSpeed;
      this.interpolationProgress += deltaMs / effectiveDuration;

      if (this.interpolationProgress >= 1.0) {
        this.interpolationProgress = 0.0;
        const numFrames = this.forecastFrames.length || 1;
        this.currentTimeIndex = (this.currentTimeIndex + 1) % numFrames;
      }

      this.notify();
      this.rafId = requestAnimationFrame(loop);
    };

    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(loop);
  }

  destroy() {
    this.pause();
    this.listeners.clear();
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }
}
