import { pickMarketingTargetPoll } from '../scripts/pick-marketing-target-poll';
import { postTweet } from './post-tweet';

export async function runCronMarketing() {
    const selectedPoll = await pickMarketingTargetPoll();
    if (selectedPoll) {
        console.log('Selected Poll:', selectedPoll);
        const { poll, msg } = selectedPoll;
        if (poll.poll_announce_img) {
            const tweet = await postTweet(msg, poll.poll_announce_img);
            console.log('Tweet:', tweet);
            return { sucess: true, tweet };
        }
    }
};