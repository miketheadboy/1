

interface GameLayoutProps {
    children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-stone-900 text-stone-200 font-serif">
            <header className="bg-stone-800 border-b border-stone-700 p-4 shadow-md">
                <h1 className="text-3xl font-bold text-amber-600 tracking-wider text-center">BLEEDING KANSAS</h1>
                <p className="text-center text-stone-400 text-sm italic">1854 - 1861</p>
            </header>
            <main className="container mx-auto p-4 h-[calc(100vh-100px)]">
                {children}
            </main>
        </div>
    );
};
