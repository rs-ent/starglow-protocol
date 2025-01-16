import { getSheetsData } from "../scripts/google-sheets-data";
import { DataProvider } from "../context/PollData";
import AnalyticsClient from "../firebase/analytics";

export default async function PollLayout({ children, params }) {
    const pollData = await getSheetsData();

    return (
        <html>
            <body>
                <DataProvider value={pollData}>
                    <div className="bg-[rgba(0,0,0,1)] text-[var(--foreground)] font-[var(--font-body)] transition-all">
                        <main className="flex-grow max-w-[480px] mx-auto min-h-dvh overflow-x-hidden
                                         bg-[url('/poll-bg.png')] bg-cover bg-no-repeat
                                         bg-black bg-blend-multiply bg-opacity-10
                                         shadow-xl">
                            {children}
                        </main>
                    </div>
                    <AnalyticsClient />
                </DataProvider>
            </body>
        </html>
    );
}