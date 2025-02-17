import Poll from "./Poll";
import LocaleFile from "./LocaleFile";
import { getSheetsData } from "../../../scripts/google-sheets-data";

export default async function PollPage({ params }) {
    const { poll_id, locale } = await params;
    const localeFile = await LocaleFile({ locale });

    const pollData = await getSheetsData();
    const poll = pollData?.[poll_id];

    return (
        <Poll poll={poll} poll_id={poll_id} t={localeFile} />
    );
}