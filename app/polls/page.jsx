import PollList from "./PollList";
import { getPollsResults } from "../firebase/fetch";

export default async function PollListHome() {
    const pollResults = await getPollsResults();

    return (
        <PollList pollResults={pollResults}/>
    )
}