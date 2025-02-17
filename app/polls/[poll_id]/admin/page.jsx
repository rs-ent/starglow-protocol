import { getPollResult } from "../../../firebase/fetch";
import { getSheetsData } from "../../../scripts/google-sheets-data";
import PollAdmin from "./PollAdmin";

export default async function PollResult({ params }) {
  const { poll_id } = await params;
  const result = await getPollResult(poll_id);
  
  const pollData = await getSheetsData();
  const poll = pollData?.[poll_id];

  return <PollAdmin poll={poll} poll_id={poll_id} result={result} />;
}
