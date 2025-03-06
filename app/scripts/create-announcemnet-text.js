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

export function CreateAnnouncementText(poll) {
  console.log(poll);
  const pollTitle = poll.title;
  const pollTitleShorten = poll.title_shorten || "";
  const pollTitleHashTag = pollTitleShorten
    ? convertHashTag(pollTitleShorten)
    : "";
  const pollOptions = poll.options.split(";");
  const songs = poll.song_title.split(";");

  const hashTags = songs.map(function (song) {
    const parts = song.split(/\s*-\s*/);
    const artist = parts[0];
    const title = parts[1] || "";
    return (
      convertHashTag(artist) +
      " " +
      convertHashTag(title) +
      " " +
      convertHashTag(song)
    );
  });

  const randomReOpens = [
    "If you missed voting earlier, now's your chance to have your say— the poll is open again!",
    "Didn't get a chance to vote before? There's still time— join in, the poll is open again!",
    "Missed your chance to vote? We're giving you another opportunity— cast your vote now that the poll is open again!",
    "For anyone who skipped voting, it's not too late— take part as the poll is open again!",
    "If you didn't get a chance to vote earlier, worry not— your chance has come as the poll is open again!",
    "No vote yet? The poll is open again—make sure to have your say!",
    "If you haven't voted yet, seize the moment—the poll is open again!",
    "Didn't cast your vote earlier? Here's your second chance—participate now that the poll is open again!",
    "Missed your vote? Don't worry—the poll is open again, ready for your input!",
    "If you haven't had your say yet, now's the time—get involved as the poll is open again!",
    "Didn't get around to voting? Now's your chance—join in, the poll is open again!",
    "If you skipped voting before, you're in luck—the poll is open again for you to make your voice heard!",
    "For those who missed their chance to vote, now is the time—cast your vote while the poll is open again!",
    "Didn't manage to vote earlier? Your opportunity is here—take part as the poll is open again!",
    "If your vote is still pending, now is your moment—get in, the poll is open again!",
    "No worries if you missed voting before—another chance is here as the poll is open again!",
    "If you haven't had the chance to share your opinion, now's the time—jump in while the poll is open again!",
    "Didn't vote before? Now you can catch up— the poll is open again!",
    "If you haven't cast your vote, here's your reminder—it's open again and waiting for you!",
    "Missed out on voting? Don't miss this chance—get involved, the poll is open again!",
    "If you haven't voted yet, the poll is open again—please take a moment to share your opinion.",
    "Didn't get a chance to vote earlier? The poll is open again for you to share your thoughts.",
    "If you missed casting your vote, the poll is open again. Your input is welcome.",
    "Missed your chance to vote before? The poll is open again—feel free to participate.",
    "For those who haven't voted yet, the poll is open again. We invite you to share your perspective.",
    "If you skipped voting earlier, now is a good time—the poll is open again.",
    "If you didn't get around to voting, the poll is open again for your feedback.",
    "No worries if you missed voting earlier; the poll is open again and we value your input.",
    "Didn't vote before? The poll is open again, and we welcome your participation.",
    "If your vote is still pending, please note that the poll is open again.",
  ];

  const randomFinales = [
    "Open Starglow and share your feedback.\n\nJoin #Starglow 😀",
    "Explore Starglow and share your thoughts.\n\nJoin #Starglow 😃",
    "Try out Starglow and let us know what you think. Your feedback matters.\n\nJoin #Starglow 😄",
    "Try out Starglow and share your comments. We value your input.\n\nJoin #Starglow 😁",
    "Launch Starglow and share your thoughts. We're looking forward to your feedback.\n\nJoin #Starglow 😆",
    "Experience Starglow and share your feedback – your input is appreciated.\n\nJoin #Starglow 😊",
    "Explore Starglow and share your thoughts – we value your opinion.\n\nJoin #Starglow 🙂",
    "Explore Starglow and share your voice – we appreciate your feedback.\n\nJoin #Starglow 🥰",
    "Try Starglow and let us know what you love. We look forward to your input.\n\nJoin #Starglow 😘",
    "Give Starglow a try and share your experience – every opinion matters.\n\nJoin #Starglow 😙",
    "Discover Starglow and share your feedback – we welcome your input.\n\nJoin #Starglow 😋",
    "Explore Starglow and share your perspective – your opinion matters.\n\nJoin #Starglow 😝",
    "Check out the new features in Starglow and tell us what you think – your feedback helps us improve.\n\nJoin #Starglow 🤪",
    "Experience using Starglow and share your thoughts – every piece of feedback makes a difference.\n\nJoin #Starglow 🥳",
    "Take a moment to explore Starglow and share your experience – we look forward to your feedback.\n\nJoin #Starglow 🤗",
    "Try Starglow and share your honest opinion – your feedback helps us improve.\n\nJoin #Starglow 😀",
    "Explore Starglow and share your thoughts – we appreciate your feedback.\n\nJoin #Starglow 😃",
    "Discover what Starglow offers and let us know your thoughts – your insights matter.\n\nJoin #Starglow 😄",
    "Try Starglow and share your impressions – we welcome your feedback.\n\nJoin #Starglow 😁",
    "Try Starglow today and let us know your thoughts – your feedback helps us improve.\n\nJoin #Starglow 😆",
    "Experience Starglow and share your feedback – your input helps us improve.\n\nJoin #Starglow 😆",
    "Try Starglow now and share your thoughts – every opinion counts.\n\nJoin #Starglow 🙂",
    "Open Starglow and share your experience – your feedback guides us.\n\nJoin #Starglow 😆",
    "Discover what Starglow has to offer and share your thoughts – your voice matters.\n\nJoin #Starglow 😘",
    "Check out the latest in Starglow and leave a comment – we value your feedback.\n\nJoin #Starglow 😆",
    "Take a tour of Starglow and let us know your favorite features – your opinion guides us.\n\nJoin #Starglow 😘",
    "Explore the features of Starglow and share your insights – every detail counts.\n\nJoin #Starglow 😆",
    "Review the features of Starglow and share your thoughts – your feedback helps us improve.\n\nJoin #Starglow 😘",
    "Experience Starglow and let us know what you think – your feedback is important.\n\nJoin #Starglow 😆",
    "Explore Starglow and share your experience – every opinion helps us improve.\n\nJoin #Starglow 😘",
    "Open Starglow and give us your feedback – your insights make a difference.\n\nJoin #Starglow 😆",
    "Explore the design of Starglow and share your thoughts – we welcome your feedback.\n\nJoin #Starglow 😆",
    "Try Starglow and share your impressions – your feedback helps us progress.\n\nJoin #Starglow 😆",
    "Experience Starglow and share your experience – your feedback is valuable.\n\nJoin #Starglow 😁",
    "Take a moment to try Starglow and share your thoughts – we look forward to your feedback.\n\nJoin #Starglow 😆",
    "Try Starglow and share your views – every comment counts.\n\nJoin #Starglow 😊",
    "Try Starglow and share what you think – your opinion helps us improve.\n\nJoin #Starglow 😘",
    "Explore Starglow and share your feedback – we’re listening.\n\nJoin #Starglow 😆",
    "Check out Starglow and share your thoughts – your feedback encourages us.\n\nJoin #Starglow 😁",
    "Open Starglow and share your genuine opinion – each piece of feedback helps us grow.\n\nJoin #Starglow 😆",
    "Discover the benefits of Starglow and share your insights – your thoughts matter.\n\nJoin #Starglow 🤪",
    "Experience Starglow and share your experience – your feedback helps us improve.\n\nJoin #Starglow 😆",
    "Take a look at Starglow and share your thoughts – your feedback guides us.\n\nJoin #Starglow 😆",
    "Experience Starglow and drop a comment – we value your opinion.\n\nJoin #Starglow 😁",
    "Try Starglow and share your honest feedback – your insights help us improve.\n\nJoin #Starglow 🤪",
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

#KPOP #POLL #VOTING #WEB3 #RWA

${randomReOpen}
${randomFinale}
https://starglow.io/start`;

  return message;
}
