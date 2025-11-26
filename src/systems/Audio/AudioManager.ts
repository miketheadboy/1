export class AudioManager {
    private static instance: AudioManager;
    private audioContext: AudioContext | null = null;

    private constructor() { }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    private initContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    public playSFX(type: 'shoot' | 'hit' | 'reload' | 'click' | 'battle_start' | 'victory' | 'defeat') {
        this.initContext();
        if (!this.audioContext) return;

        // Placeholder: Synthesize simple sounds for now until we have assets
        // This ensures "Juice" is felt even without files
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;

        switch (type) {
            case 'shoot':
                // Gunshot: Noise burst + rapid decay
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'hit':
                // Thud
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.1);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'reload':
                // Click/Slide
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            case 'click':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case 'battle_start':
                // Dramatic chord?
                this.playTone(440, 0.5, 'sawtooth');
                setTimeout(() => this.playTone(554, 0.5, 'sawtooth'), 100);
                setTimeout(() => this.playTone(659, 0.8, 'sawtooth'), 200);
                break;
        }
    }

    private playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }
}

export const audioManager = AudioManager.getInstance();
