
import { useGameStore } from './core/GameState';
import { GameLayout } from './components/GameLayout';
import { Dashboard } from './components/Dashboard';
import { CharacterCreationScreen } from './components/CharacterCreationScreen';

function App() {
  const { characterBackground } = useGameStore();

  if (!characterBackground) {
    return <CharacterCreationScreen onComplete={() => { }} />;
  }

  return (
    <GameLayout>
      <Dashboard />
    </GameLayout>
  );
}

export default App;
