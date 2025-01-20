import { getSheetsData } from "../scripts/google-sheets-data";
import { DataProvider } from "../context/PollData";
import AnalyticsClient from "../firebase/analytics";

export default async function PollLayout({ children, params }) {
    const pollData = await getSheetsData();

    return (
        <div>
            <DataProvider value={pollData}>
                {children}
                <AnalyticsClient />
            </DataProvider>
        </div>
    );
}