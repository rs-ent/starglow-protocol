import { getPollResult } from "../../firebase/fetch";
import PollCardResult from "./PollCard.Result";

export default async function PollResult ({ searchParams }) {
    const params = await searchParams;
    const pollId = params?.pollId || 'p999999';
    const result = await getPollResult(pollId);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <PollCardResult poll_id={pollId} result={result} />
        </div>
    );
};