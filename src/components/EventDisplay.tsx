import type { GameEvent } from '../systems/Events/EventTypes';
import { useGameStore } from '../core/GameState';

interface EventDisplayProps {
    event: GameEvent;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ event }) => {
    const resolveEventOption = useGameStore(state => state.resolveEventOption);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-stone-100 text-stone-900 max-w-2xl w-full rounded-lg shadow-2xl border-4 border-stone-800 p-8 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-600"></div>

                <h2 className="text-3xl font-bold font-serif mb-2 text-stone-900 border-b-2 border-stone-300 pb-2">
                    {event.title}
                </h2>

                {event.date && (
                    <p className="text-stone-500 italic mb-4 font-serif">
                        {event.date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                )}

                <p className="text-lg leading-relaxed mb-8 font-serif">
                    {event.description}
                </p>

                <div className="space-y-3">
                    {event.options.map(option => (
                        <button
                            key={option.id}
                            onClick={() => resolveEventOption(option)}
                            className="w-full text-left p-4 border-2 border-stone-300 rounded hover:border-amber-600 hover:bg-stone-200 transition-colors group"
                        >
                            <span className="block font-bold text-lg group-hover:text-amber-700">
                                {option.text}
                            </span>
                            {option.description && (
                                <span className="block text-stone-600 mt-1">
                                    {option.description}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
