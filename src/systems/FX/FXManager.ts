import { create } from 'zustand';

interface FXState {
    shakeIntensity: number;
    shakeDuration: number;
    isShaking: boolean;
    triggerShake: (intensity: number, duration: number) => void;
    updateShake: (deltaTime: number) => void;
}

export const useFXStore = create<FXState>((set, get) => ({
    shakeIntensity: 0,
    shakeDuration: 0,
    isShaking: false,

    triggerShake: (intensity: number, duration: number) => {
        set({
            shakeIntensity: intensity,
            shakeDuration: duration,
            isShaking: true
        });
    },

    updateShake: (deltaTime: number) => {
        const { shakeDuration, isShaking } = get();
        if (!isShaking) return;

        if (shakeDuration <= 0) {
            set({ isShaking: false, shakeIntensity: 0, shakeDuration: 0 });
        } else {
            set({ shakeDuration: shakeDuration - deltaTime });
        }
    }
}));
