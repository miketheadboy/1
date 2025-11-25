

interface GameLogProps {
    logs: string[];
}

export const GameLog: React.FC<GameLogProps> = ({ logs }) => {
    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-amber-500 mb-2 border-b border-stone-600 pb-1">Journal</h2>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono text-sm">
                {logs.map((log, index) => (
                    <div key={index} className="text-stone-300 border-b border-stone-700/50 pb-1 last:border-0">
                        <span className="text-amber-700 mr-2">{'>'}</span>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};
