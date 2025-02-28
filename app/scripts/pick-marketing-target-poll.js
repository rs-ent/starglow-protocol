import { getSheetsData } from '../scripts/google-sheets-data';
import { CreateMarketingText } from '../scripts/create-marketing-text';

export async function pickMarketingTargetPoll() {
    const pollList = await getSheetsData();
    console.log(pollList);
    const today = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );

    if (today.getHours() === 23){
        console.log('It is 11pm');

        const filter = Object.values(pollList).filter((poll) => {
            const endValue = poll.end;
            const endDate = new Date(endValue.trim());
            const endDateBeforeTwoDays = new Date(endDate);
            endDateBeforeTwoDays.setDate(endDate.getDate() - 2);

            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();
            return (
                endDateBeforeTwoDays.getFullYear() === todayYear &&
                endDateBeforeTwoDays.getMonth() === todayMonth &&
                endDateBeforeTwoDays.getDate() === todayDate
            )
        });

        if (filter.length > 0) {
            const poll = filter[0];
            const msg = CreateMarketingText(poll, true, false);
            return {poll, msg};
        }
    } else if (today.getHours() === 9) {
        console.log('It is 9am');
        const filter = Object.values(pollList).filter((poll) => {
            console.log('poll:', poll);
            const endValue = poll.end;
            const endDate = new Date(endValue.trim());
    
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();
    
            return (
                endDate.getFullYear() === todayYear &&
                endDate.getMonth() === todayMonth &&
                endDate.getDate() === todayDate
            );
        });

        console.log("Filtered Poll: ", filter);

        if (filter.length > 0) {
            const poll = filter[0];
            const msg = CreateMarketingText(poll, true, false);
            return {poll, msg};
        }
    }
};