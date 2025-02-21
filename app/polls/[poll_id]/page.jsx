import LocaleNavigator from "./LocaleNavigator";
import { getSheetsData } from "../../scripts/google-sheets-data";

export async function generateMetadata({ params }) {
    const { poll_id } = params;
    const pollData = await getSheetsData();
    const poll = pollData?.[poll_id];

    const title = poll?.title
        ? `[POLL #${poll_id.slice(1)}] ${poll.title}`
        : `Starglow K-POP Poll #${poll_id.slice(1)}`;

    const description = poll?.options
        ? `#${poll.options.split(';').join(' #')}`
        : "Participate in our K-POP Poll!";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://starglow-protocol.vercel.app';
    let image = poll?.poll_announce_img || poll?.img || '/images/link_image.jpg';

    if (image.startsWith('/')) {
        image = baseUrl + image;
    }

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `${baseUrl}/polls/${poll_id}`,
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
            images: image,
        },
    };
}


export default async function PollHome({ params }) {
    const { poll_id } = await params;

    return <LocaleNavigator poll_id={poll_id} />;
};