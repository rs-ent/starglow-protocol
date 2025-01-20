
export default async function PollLayout({ children }) {
    return (
        <div className="bg-[rgba(52,60,76,1)] text-[var(--foreground)] font-[var(--font-body)] transition-all">
            <main className="flex-grow max-w-[480px] mx-auto min-h-dvh overflow-x-hidden
                                bg-[url('/poll-bg.png')] bg-top bg-no-repeat bg-fixed
                                bg-black bg-blend-multiply bg-opacity-15
                                shadow-xl">
                {children}
            </main>
        </div>
    );
}