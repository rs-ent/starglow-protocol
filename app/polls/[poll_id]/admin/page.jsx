import { getPollResult } from '../../../firebase/fetch';
import PollAdmin from './PollAdmin';

export default async function PollResult ({ params }) {
    const { poll_id } = await params;
    const result = await getPollResult(poll_id);

    return (
        <PollAdmin poll_id={poll_id} result={result} />
    );
};