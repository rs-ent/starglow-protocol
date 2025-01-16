import Poll from "./Poll";
import LocaleFile from "./LocaleFile";

export default async function PollPage({ params }) {
    const { poll_id, locale } = await params;
    const localeFile = await LocaleFile({ locale });

    return (
        <Poll poll_id={poll_id} t={localeFile} />
    );
}