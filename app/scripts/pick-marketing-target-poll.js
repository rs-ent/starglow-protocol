import { getSheetsData } from '../scripts/google-sheets-data';
import { CreateMarketingText } from '../scripts/create-marketing-text';

export async function pickMarketingTargetPoll() {
    const pollList = await getSheetsData();
    console.log(pollList);
    const today = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );

    if (today.getHours() === 0){
        console.log('It is 12am');

        const filter = Object.values(pollList).filter((poll) => {
            const endValue = poll.end;
            const endDate = new Date(endValue.trim());
            const endDateYear = endDate.getFullYear();
            const endDateMonth = endDate.getMonth();
            const endDateDate = endDate.getDate();
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();
            return (
                endDateYear === todayYear &&
                endDateMonth === todayMonth &&
                endDateDate === todayDate
            );
        });

        if (filter.length > 0) {
            const poll = filter[0];
            const msg = CreateMarketingText(poll, true, false);
            return {poll, msg};
        }
    } else if (today.getHours() === 5) {
        console.log('It is 5am');
        const filter = Object.values(pollList).filter((poll) => {
            const endValue = poll.end;
            const endDate = new Date(endValue.trim());
            const endDateBeforeTwoDays = new Date(endDate);
            endDateBeforeTwoDays.setDate(endDate.getDate() - 3);
    
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();
    
            return (
                endDateBeforeTwoDays.getFullYear() === todayYear &&
                endDateBeforeTwoDays.getMonth() === todayMonth &&
                endDateBeforeTwoDays.getDate() === todayDate
            );
        });

        if (filter.length > 0) {
            const poll = filter[0];
            const msg = CreateMarketingText(poll, false, true);
            return {poll, msg};
        }
    } else if (today.getHours() === 12) {
        console.log('It is 12pm');
        const filter = Object.values(pollList).filter((poll) => {
            console.log('poll:', poll);
            const endValue = poll.end;
            const endDate = new Date(endValue.trim());
            const endDateBeforeTwoDays = new Date(endDate);
            endDateBeforeTwoDays.setDate(endDate.getDate() - 7);
            console.log('endDateBeforeTwoDays:', endDateBeforeTwoDays);
    
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();
    
            return (
                endDateBeforeTwoDays.getFullYear() === todayYear &&
                endDateBeforeTwoDays.getMonth() === todayMonth &&
                endDateBeforeTwoDays.getDate() === todayDate
            );
        });

        console.log("Filtered Poll: ", filter);

        if (filter.length > 0) {
            const poll = filter[0];
            const msg = CreateMarketingText(poll, false, true);
            return {poll, msg};
        }
    }
};