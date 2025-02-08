export function CreateAnnouncementText(poll) {
  const pollTitle = poll.title;
  const pollOptions = poll.options.split(";");
  const songs = poll.song_title.split(";");

  const randomReOpens = [
    "Awesome news – the poll is open again! We’re excited to hear your updated thoughts on the Starglow Mini App.",
    "Hey there, the poll’s been reopened. Take a moment to share your latest insights on the Starglow Mini App.",
    "The poll is live again! We’d love to get your feedback—head over to the Starglow Mini App when you can.",
    "Our poll is back up, and we’d really appreciate hearing from you again. Visit the Starglow Mini App and cast your vote!",
    "Great news—if you missed voting earlier, the poll is open again. Drop by the Starglow Mini App and let us know what you think.",
    "It’s reopening time! The poll is available once more on the Starglow Mini App. Your opinion matters, so please join in.",
    "Your chance to share your thoughts is back. The poll has been reopened on the Starglow Mini App—come vote again!",
    "We’re reopening the poll—hop in to the Starglow Mini App and share your perspective.",
    "Reopened and ready for your input! Visit the Starglow Mini App to cast your vote and have your say.",
    "Good news! The poll is live again. We’d love to hear your updated opinion on the Starglow Mini App.",
    "The poll is back, and we can’t wait to hear more from you. Log in to the Starglow Mini App and vote at your convenience.",
    "Missed your chance before? No worries—the poll is open again. Join us on the Starglow Mini App to share your thoughts.",
    "It’s time to vote again! The poll has reopened on the Starglow Mini App, and we’re eager for your feedback.",
    "Your voice matters, and the poll is now open again. Head to the Starglow Mini App and let us know what you think.",
    "We’re excited to announce the poll is reopened. If you have more to say, the Starglow Mini App is waiting for your input.",
    "Time for a comeback—the poll is open again. Please visit the Starglow Mini App and share your perspective.",
    "We’re back to collecting your opinions! The poll has reopened on the Starglow Mini App, so feel free to vote again.",
    "Your feedback drives us, and the poll is now open once more. Log into the Starglow Mini App and cast your vote.",
    "The poll is live again—don’t miss the chance to update your opinion on the Starglow Mini App.",
    "Our voting window is open again! We’d be delighted if you could join us on the Starglow Mini App and share your thoughts.",
    "The poll’s been reactivated! Stop by the Starglow Mini App to update your vote and help shape the conversation.",
    "Good to have you back! The poll is open again on the Starglow Mini App, and we truly value your perspective.",
    "We’ve reopened the poll, and we’d love to hear what’s new with you. Check out the Starglow Mini App and cast your vote again.",
    "Time to update your opinion—the poll is now open again. Join us on the Starglow Mini App for another round of feedback.",
    "We’re reopening the poll for fresh insights. Visit the Starglow Mini App and share your updated views.",
    "It’s your chance to weigh in once more—the poll is open again on the Starglow Mini App. Your feedback is important!",
    "We’re inviting you back to vote—the poll is live again on the Starglow Mini App. We can’t wait to hear your thoughts.",
    "The poll is open again, and your input is always welcome. Please head over to the Starglow Mini App and share your perspective.",
    "If you’ve got more to say, now’s your chance—the poll has been reopened on the Starglow Mini App. We look forward to your vote.",
    "The poll is back in action! Your continued feedback is crucial, so join us on the Starglow Mini App and cast your vote again.",
  ];

  const randomFinales = [
    "Open up the Starglow mini app and let us know! We're waiting for your opinion about it.\n\nJoin Starglow 😀",
    "Explore the Starglow mini app and share your thoughts with us! We can’t wait to hear from you.\n\nJoin Starglow 😃",
    "Dive into the Starglow mini app and tell us what you think! Your feedback is important to us.\n\nJoin Starglow 😄",
    "Try out the Starglow mini app and drop us your comments! We are eager to learn from you.\n\nJoin Starglow 😁",
    "Fire up the Starglow mini app and share your thoughts! We're excited to hear your feedback.\n\nJoin Starglow 😆",
    "Experience the magic of the Starglow mini app – your feedback lights up our day!\n\nJoin Starglow 😊",
    "Step into the world of Starglow and share your thoughts – we value every opinion!\n\nJoin Starglow 🙂",
    "Explore the Starglow mini app and let your voice be heard – your feedback is our inspiration.\n\nJoin Starglow 🥰",
    "Dive into the Starglow mini app and tell us what you love most – we can’t wait to hear from you!\n\nJoin Starglow 😘",
    "Give the Starglow mini app a try and share your experience with us – every thought counts.\n\nJoin Starglow 😙",
    "Uncover the hidden gems of the Starglow mini app and drop us your feedback – we’re excited to listen!\n\nJoin Starglow 😋",
    "Join us in exploring the Starglow mini app and share your perspective – your opinion matters.\n\nJoin Starglow 😝",
    "Check out the new features in the Starglow mini app and let us know what you think – your voice drives us!\n\nJoin Starglow 🤪",
    "Experience the ease of using the Starglow mini app and drop your thoughts – every feedback makes a difference.\n\nJoin Starglow 🥳",
    "Take a moment to explore the Starglow mini app and share your experience – we're eager to hear from you.\n\nJoin Starglow 🤗",
    "Step in and try the Starglow mini app – your honest opinion can spark innovation!\n\nJoin Starglow 😀",
    "Explore, engage, and let us know your thoughts on the Starglow mini app – every feedback is appreciated.\n\nJoin Starglow 😃",
    "Discover the possibilities with the Starglow mini app and tell us what you think – your insights matter.\n\nJoin Starglow 😄",
    "Give the Starglow mini app a spin and share your impressions – we're all ears for your feedback.\n\nJoin Starglow 😁",
    "Engage with the Starglow mini app today and let us know your thoughts – your feedback is our fuel.\n\nJoin Starglow 😆",
    "Experience innovation with the Starglow mini app and drop your feedback – your input makes us better.\n\nJoin Starglow 😆",
    "Try the Starglow mini app now and tell us your thoughts – every opinion counts.\n\nJoin Starglow 🙂",
    "Open the Starglow mini app and share your experience – your feedback brightens our path forward.\n\nJoin Starglow 😆",
    "Discover a new world in the Starglow mini app and let us know what you think – your voice matters.\n\nJoin Starglow 😘",
    "Check out the latest in the Starglow mini app and drop us a comment – we value your feedback.\n\nJoin Starglow 😆",
    "Take a tour of the Starglow mini app and tell us your favorite parts – your opinion guides us!\n\nJoin Starglow 😘",
    "Explore the exciting features of the Starglow mini app and share your insights – every detail counts.\n\nJoin Starglow 😆",
    "Dive into the features of the Starglow mini app and drop your thoughts – your feedback inspires us!\n\nJoin Starglow 😘",
    "Experience the future with the Starglow mini app and let us know what you think – your feedback is key.\n\nJoin Starglow 😆",
    "Step into innovation with the Starglow mini app and share your experience – every opinion shapes our journey.\n\nJoin Starglow 😘",
    "Open the Starglow mini app and give us your take on it – your insights make all the difference.\n\nJoin Starglow 😆",
    "Explore the intuitive design of the Starglow mini app and share your thoughts – we're eager for your feedback.\n\nJoin Starglow 😆",
    "Give the Starglow mini app a try and let us know your impressions – your feedback powers our progress.\n\nJoin Starglow 😆",
    "Experience the simplicity of the Starglow mini app and share your experience – your feedback is invaluable.\n\nJoin Starglow 😁",
    "Take the opportunity to try the Starglow mini app and drop your thoughts – we’re excited to hear from you!\n\nJoin Starglow 😆",
    "Step into the experience of the Starglow mini app and let us know your views – every comment counts.\n\nJoin Starglow 😊",
    "Engage with the innovative Starglow mini app and share what you think – your opinion drives us forward.\n\nJoin Starglow 😘",
    "Explore the creative side of the Starglow mini app and give us your feedback – we’re listening!\n\nJoin Starglow 😆",
    "Check out the Starglow mini app and tell us your thoughts – your feedback sparks our innovation.\n\nJoin Starglow 😁",
    "Open up the Starglow mini app and share your genuine opinion – every feedback helps us grow.\n\nJoin Starglow 😆",
    "Discover the benefits of the Starglow mini app and drop us your insights – your thoughts matter.\n\nJoin Starglow 🤪",
    "Experience a new way of connecting with the Starglow mini app and share your experience – your feedback inspires change.\n\nJoin Starglow 😆",
    "Take a look at the Starglow mini app and let us know your thoughts – your feedback lights our way.\n\nJoin Starglow 😆",
    "Embrace the innovation in the Starglow mini app and drop a comment – we value every opinion.\n\nJoin Starglow 😁",
    "Try out the Starglow mini app and share your honest feedback – your insights drive our creativity.\n\nJoin Starglow 🤪",
  ];

  const randomReOpen =
    poll.reopen === "TRUE"
      ? randomReOpens[Math.floor(Math.random() * randomReOpens.length)]
      : "";

  const randomFinale =
    randomFinales[Math.floor(Math.random() * randomFinales.length)];

  const message = `🎵Today's Song🎵
💿 ${songs.join("\n💿 ")}


🗳Today's Poll🗳
[${pollTitle}]
⚪️ ${pollOptions.join("\n⚪️ ")}

${randomReOpen}
${randomFinale}
http://starglow.pro/start`;

  return message;
}
