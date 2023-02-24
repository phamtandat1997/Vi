import Sound from 'react-native-sound';

let currentTime = 0;
let currentAudio = null;
let track = null;

export default class SoundService {

  // call this func in constructor's components
  static setCategory() {
    Sound.setCategory('Playback');
  }

  static pause() {
    if (currentTime > 0) {
      // move to time, pause clicked
      track.setCurrentTime(currentTime);
      track.play(() => this.stop());
    } else {
      track.getCurrentTime((seconds) => {
        // set current time for play continue
        currentTime = seconds;
      });
      track.pause();
    }
  }

  static play(audio) {
    try {
      track = new Sound(audio, (e) => {
        if (e) {
          console.log('[ERROR] playTrack', e);
        } else {
          if (currentTime > 0) {
            track.setCurrentTime(currentTime);
          }
          track.play(() => this.stop());
        }
      });
    } catch (e) {
      console.log('[PLAY ERROR]', e);
    }
  }

  static stop() {
    if (track) {
      this.onPlayEnd();
      track.stop();
    }
  }

  static onPlayEnd() {
    currentTime = 0;
    currentAudio = 0;
  }
}