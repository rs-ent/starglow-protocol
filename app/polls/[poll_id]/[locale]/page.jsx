import Poll from "./Poll";
import LocaleFile from "./LocaleFile";
import { getSheetsData } from "../../../scripts/google-sheets-data";

export async function generateMetadata({ params }) {
    const { poll_id, locale } = params;
    const pollData = await getSheetsData();
    const poll = pollData?.[poll_id];

    const title = poll?.title
        ? `[POLL #${poll_id.replace('p', '')}] ${poll.title}`
        : `Starglow K-POP Poll #${poll_id.replace('p', '')}`;

    const description = poll?.options
        ? `#${poll.options.split(';').join(' #')}`
        : "Participate in our K-POP Poll!";

    const image = poll?.poll_announce_img || poll?.img || '/images/link_image.webp';
    console.log("Image: ", image);

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `https://starglow-protocol.vercel.app/polls/${poll_id}`,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            siteName: "Starglow Protocol",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [image],
        },
    };
}

export default async function PollPage({ params }) {
    const { poll_id, locale } = await params;
    const localeFile = await LocaleFile({ locale });

    const pollData = await getSheetsData();
    const poll = pollData?.[poll_id];

    return (
        <Poll poll={poll} poll_id={poll_id} t={localeFile} />
    );
}