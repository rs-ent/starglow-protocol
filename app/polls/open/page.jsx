import TodaySong from "./TodaySong";
import TodayPoll from "./TodayPoll";
import { getSheetsData } from "../../scripts/google-sheets-data";

export default async function PollResult ({ searchParams }) {
    const params = await searchParams;
    const pollId = params?.pollId || 'p999999';
    const type = params?.type || 'poll';
    const songIdx = params?.songIdx || '0';

    const pollData = await getSheetsData();
    const poll = pollData?.[pollId];

    return (
        <>
            { type === 'poll' ? (
                <div className="flex items-center justify-center min-h-screen">
                    <TodayPoll poll_id={pollId} poll={poll}/>
                </div>
            ) : 
            (
                <div className="flex items-center justify-center min-h-screen">
                    <TodaySong poll_id={pollId} songIdx={parseInt(songIdx, 10)} poll={poll}/>
                </div>
            )}
        </>
    );
};