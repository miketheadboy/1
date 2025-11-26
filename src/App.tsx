import { useGameStore, Scene } from './core/GameState';
import { GameLayout } from './components/GameLayout';
import { Dashboard } from './components/Dashboard';
import { CharacterCreationScreen } from './components/CharacterCreationScreen';
import { MainMenu } from './components/MainMenu';
import { CombatScene } from './components/CombatScene';
import { GameOverScreen } from './components/GameOverScreen';
import { useFXStore } from './systems/FX/FXManager';
import { ParticleSystem, type ParticleSystemRef } from './components/FX/ParticleSystem';
import React, { useEffect, useRef } from 'react';

// Global reference for particle system (hacky but effective for global access)
export let particleSystemRef: ParticleSystemRef | null = null;

const ShakeContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateShake } = useFXStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(undefined);
  const previousTimeRef = useRef<number>(undefined);

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = (time - previousTimeRef.current) / 1000;
        updateShake(deltaTime);
      }
      previousTimeRef.current = time;

      if (containerRef.current) {
        if (useFXStore.getState().isShaking) {
          const intensity = useFXStore.getState().shakeIntensity;
          const x = (Math.random() - 0.5) * intensity;
          const y = (Math.random() - 0.5) * intensity;
          containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
        } else {
          containerRef.current.style.transform = 'none';
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [updateShake]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
};

function App() {
  const { currentScene, setScene } = useGameStore();
  const particleRef = useRef<ParticleSystemRef>(null);

  useEffect(() => {
    if (particleRef.current) {
      particleSystemRef = particleRef.current;
    }
  }, []);

  let content;
  switch (currentScene) {
    case Scene.MainMenu:
      content = <MainMenu />;
      break;
    case Scene.CharacterCreation:
      content = <CharacterCreationScreen onComplete={() => setScene(Scene.Gameplay)} />;
      break;
    case Scene.Gameplay:
      content = (
        <GameLayout>
          <Dashboard />
        </GameLayout>
      );
      break;
    case Scene.Combat:
      content = <CombatScene />;
      break;
    case Scene.GameOver:
      content = <GameOverScreen />;
      break;
    default:
      content = <MainMenu />;
  }

  return (
    <>
      <ShakeContainer>
        {content}
      </ShakeContainer>
      <ParticleSystem ref={particleRef} />
    </>
  );
}

export default App;
