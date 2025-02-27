function convertHashTag(str) {
    // 알파벳, 숫자가 아닌 문자들을 기준으로 단어 분리
    const words = str.split(/[^a-zA-Z0-9]+/);

    // 빈 문자열 제거 및 각 단어의 첫 글자만 대문자로 변환
    const formattedWords = words
        .filter((word) => word.length > 0)
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase());

    // 해시태그 생성
    return "#" + formattedWords.join("");
}

function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

export function CreateMarketingText(poll, endDateClose = false, dontForget = false) {
    const pollId = poll.poll_id;
    const pollTitle = poll.title;
    const pollOptions = poll.options.split(";");
    const hashTags = pollOptions.map((tag) => convertHashTag(tag));

    const endDateCloseMsg = [
        "⏰ Only a few hours left to cast your vote!",
        "🚨 Voting closes soon—make your voice heard now!",
        "🕒 Hurry! The poll is about to close!",
        "⏳ Time is running out—vote before it's too late!",
        "⌛ Last chance to participate in the poll!",
        "⏰ Deadline approaching fast—submit your vote!",
        "🚨 Final call for votes—don't miss out!",
        "🕒 Just a little time left to have your say!",
        "⏳ The poll is closing soon—act now!",
        "⌛ Don't wait—vote before the poll ends!",
        "⏰ Voting period ending shortly—get involved!",
        "🚨 Last opportunity to cast your vote!",
        "🕒 Time's almost up—make your choice!",
        "⏳ Poll closing imminently—vote now!",
        "⌛ Final moments to participate—don't miss your chance!",
        "⏰ Hurry up! Voting ends soon!",
        "🚨 The clock is ticking—cast your vote!",
        "🕒 Last few minutes to have your say!",
        "⏳ Voting deadline near—act fast!",
        "⌛ Don't delay—vote before it's over!",
        "⏰ Time's running out—submit your vote now!",
        "🚨 Poll closing soon—make your voice count!",
        "🕒 Just moments left to vote!",
        "⏳ Last call for votes—participate now!",
        "⌛ The poll is ending—don't miss out!",
        "⏰ Final hours to cast your vote!",
        "🚨 Voting wraps up soon—get your vote in!",
        "🕒 Hurry! Poll closes shortly!",
        "⏳ Time is almost up—vote today!",
        "⌛ Last chance—make your vote count!"
    ];
    
    const dontForgetMsg = [
        "📢 Don't forget to cast your vote today!",
        "🔔 Your opinion matters—vote now!",
        "🗳️ Participate in the poll and have your say!",
        "📢 Remember to vote—every voice counts!",
        "🔔 Join the discussion—submit your vote!",
        "🗳️ Make your choice known—vote today!",
        "📢 Have you voted yet? Do it now!",
        "🔔 Don't miss out—cast your vote!",
        "🗳️ Your vote can make a difference—participate!",
        "📢 Be heard—submit your vote today!",
        "🔔 Take a moment to vote—it's important!",
        "🗳️ Voting is open—have your say now!",
        "📢 Don't miss your chance to vote!",
        "🔔 Participate now—your vote matters!",
        "🗳️ Share your opinion—cast your vote!",
        "📢 Voting is live—join in!",
        "🔔 Make an impact—vote today!",
        "🗳️ Don't forget—submit your vote!",
        "📢 Your input is valuable—vote now!",
        "🔔 Stand up and be counted—cast your vote!",
        "🗳️ Engage in the poll—vote today!",
        "📢 Reminder: Voting is ongoing—participate!",
        "🔔 Have your say—submit your vote now!",
        "🗳️ Don't miss the poll—vote today!",
        "📢 Your voice matters—cast your vote!",
        "🔔 Join the conversation—vote now!",
        "🗳️ Make your opinion count—participate!",
        "📢 Act now—submit your vote!",
        "🔔 Don't delay—vote today!",
        "🗳️ Be a part of the decision—cast your vote!"
    ];    

    let openerMessage = '';
    if (endDateClose) {
        openerMessage = getRandomMessage(endDateCloseMsg) + '\n';
    } else if (dontForget) {
        openerMessage = getRandomMessage(dontForgetMsg) + '\n';
    }

    const finaleMsg = [
        "🎁Cast your vote now on #Starglow! 🌟",
        "🎁Make your voice heard—vote now on #Starglow! 🌟",
        "🎁Your opinion matters! Cast your ballot today on #Starglow. 🗳️",
        "🎁Don't miss out—participate in the poll on #Starglow! 🚀",
        "🎁Join the community and vote on #Starglow now! 🌐",
        "🎁Have your say—submit your vote on #Starglow today! 🗣️",
        "🎁Time to decide! Vote on #Starglow. ⏳",
        "🎁Your vote counts! Head over to #Starglow and participate. 🗳️",
        "🎁Be part of the change—cast your vote on #Starglow! 🌟",
        "🎁Stand up and be counted—vote today on #Starglow. 📢",
        "🎁Shape the future—participate in the poll on #Starglow! 🌠",
        "🎁Express yourself—vote on #Starglow today! 💬",
        "🎁Join the movement—cast your ballot on #Starglow. 🚀",
        "🎁Participate and make a difference on #Starglow. 🌟",
        "🎁Let your voice be heard—vote today on #Starglow! 📣",
        "🎁Take action—cast your vote on #Starglow now! 🗳️",
        "🎁Make an impact—vote today on #Starglow! 🌠",
        "🎁Get involved—vote now on #Starglow! 🌟",
        "🎁Don't miss your chance—participate on #Starglow today! 🚀",
        "🎁Make a difference—vote on #Starglow now! 🗳️",
        "🎁Take your stand—participate in the poll on #Starglow. 📢"
    ];
    
    const finale = getRandomMessage(finaleMsg);
    const message = `${openerMessage}  
  
🗳${pollTitle}🗳

⚪️ ${pollOptions.join("\n⚪️ ")}
  
${hashTags.join(" ")}
#KPOP #POLL #VOTE #VOTING #WEB3 #RWA #KpopRWA #StarglowVoting
  
${finale}
https://starglow-protocol.vercel.app/polls/${pollId}`;

    return message;
}
