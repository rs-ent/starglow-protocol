import { getSheetsClient } from "../google-sheets/getSheetsClient";

export async function updateToday(pollId, songsUrl, pollUrl, message) {
    if (!pollId || !songsUrl) {
      throw new Error("Missing pollId or songsUrl");
    }
  
    const sheets = getSheetsClient();
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
      range: "Poll List!A:P",
    });
  
    const rows = readRes.data.values;
    if (!rows || rows.length === 0) {
      throw new Error("No data found in 'Poll List'");
    }
  
    // (1) poll_id 열 찾기
    const idCol = rows[0].findIndex(col => col === "poll_id");
    if (idCol === -1) {
      throw new Error(`No "poll_id" header found in row[0].`);
    }
  
    // (2) pollId 행 찾기
    const rowIndex = rows.findIndex(row => row[idCol] === pollId);
    if (rowIndex === -1) {
      throw new Error(`No row found for pollId: ${pollId}`);
    }
  
    // (3) result_img 열 인덱스
    const imgCol = rows[0].findIndex(col => col === "song_announce_img");
    if (imgCol === -1) {
      throw new Error(`No "song_announce_img" header found in row[0].`);
    }

    const pollCol = rows[0].findIndex(col => col === "poll_announce_img");
    if (pollCol === -1) {
      throw new Error(`No "poll_announce_img" header found in row[0].`);
    }

    const msgCol = rows[0].findIndex(col => col === "announce_today");
    if (msgCol === -1) {
      throw new Error(`No "announce_today" header found in row[0].`);
    }
  
    // (4) 열 인덱스를 A~Z로 (26열 미만 가정)
    const imgColStr = String.fromCharCode(65 + imgCol);
    const pollColStr = String.fromCharCode(65 + pollCol);
    const msgColStr = String.fromCharCode(65 + msgCol);
    
    // (5) 실제 시트 상의 행 번호 = rowIndex + 1 (헤더가 1행)
    const updateData = [
        {
          range: `Poll List!${imgColStr}${rowIndex + 1}`,
          values: [[songsUrl]],
        },
        {
          range: `Poll List!${pollColStr}${rowIndex + 1}`,
          values: [[pollUrl]],
        },
        {
          range: `Poll List!${msgColStr}${rowIndex + 1}`,
          values: [[message]],
        }
    ];
  
    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
        requestBody: {
          data: updateData,
          valueInputOption: "USER_ENTERED",
        },
    });

    /*const rowData = rows[rowIndex];
    const announceResultCol = rows[0].findIndex((col) => col === "announce_result");
    let announcementText = '';
    if (announceResultCol !== -1) {
        const localAnnounceResultText = rowData[announceResultCol] || "";
        announcementText = localAnnounceResultText;
        if (!localAnnounceResultText) {
            const titleCol = rows[0].findIndex(col => col === "title");
        const optionsCol = rows[0].findIndex(col => col === "options");

        
        let titleValue = "";
        let optionsValue = [];

        if (titleCol !== -1) {
            titleValue = rowData[titleCol] || "";
        }
        if (optionsCol !== -1) {
            const rawOptions = rowData[optionsCol] || "";
            optionsValue = rawOptions.split(";"); // ';' 구분
        }

        const votes = pollData?.votes || {};
        const totalVotes = Object.values(votes).reduce((sum, cnt) => sum + cnt, 0);

        let winner = '';
        let winnerCount = -1;
        const resultLines = optionsValue.map((optionText, idx) => {
            const count = votes[idx] || 0;
            const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            if(winnerCount < count){
                winnerCount = count;
                winner = optionText;
            }

            return `⚪️ ${optionText}: ${percent}%`;
        }).join("\n");

        const embellishArr = [
            "Here are the final results—thanks for waiting!",
            "We've tallied all the votes. Check out what happened.",
            "The reveal is here. Let's see the outcome!",
            "We're done counting—here are the final numbers.",
            "The results are in! Take a look.",
            "No more guesses—time to see how it turned out.",
            "All votes are locked. Ready to see the finish?",
            "All ballots are in. Here's the wrap-up.",
            "The poll ended. Let's announce how it finished.",
            "We got the final stats. Want to see the results?",
            "The verdict is ready—take a peek at the results.",
            "All set—these are the final figures.",
            "The votes spoke. Curious about the winner?",
            "That's it. Here’s the outcome you waited for.",
            "It's time to reveal the final scoreboard.",
            "Check out the official results right here.",
            "The totals are confirmed—let’s show them.",
            "We reached the end—here are the final numbers.",
            "No more waiting—this poll is complete.",
            "The big moment is now. See the final tally!",
            "We have the final percentages. Ready to view?",
            "All votes are in—here’s the final presentation.",
            "No more speculation—here’s how it ended!",
            "We’ve recorded everything—see the outcome!",
            "Time to open the results envelope. Here they are!",
            "The day has come—who topped the poll?",
            "Let’s settle this—check out our scoreboard!",
            "We’re unveiling the full breakdown—have a look.",
            "Numbers locked. Take a look at the final summary.",
            "Counting is complete—enjoy the reveal!"
        ];

        const callToActionArr = [
            "🎁 Share your opinion on Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Hop into Starglow to make your voice heard 📣\nhttp://starglow.pro/start",
            "🎁 Starglow is open—join the fun 📣\nhttp://starglow.pro/start",
            "🎁 Speak up on Starglow—tell us your thoughts 📣\nhttp://starglow.pro/start",
            "🎁 Jump in! We appreciate your viewpoint 📣\nhttp://starglow.pro/start",
            "🎁 Another poll awaits—head over to Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Join the Starglow community—every vote counts 📣\nhttp://starglow.pro/start",
            "🎁 We want your feedback! Check Starglow now 📣\nhttp://starglow.pro/start",
            "🎁 A new question is live on Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Keep the conversation going—visit Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Help shape future polls! Head to Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Let’s keep polling—join Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Join us on Starglow—your thoughts matter 📣\nhttp://starglow.pro/start",
            "🎁 Ready to vote again? Starglow is waiting 📣\nhttp://starglow.pro/start",
            "🎁 Make your mark on Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Keep polling! Starglow has more questions 📣\nhttp://starglow.pro/start",
            "🎁 See what’s new on Starglow—have your say 📣\nhttp://starglow.pro/start",
            "🎁 Join the talk—Starglow is your platform 📣\nhttp://starglow.pro/start",
            "🎁 We’re listening—tell us on Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Share your ideas—Starglow awaits 📣\nhttp://starglow.pro/start",
            "🎁 Your voice counts—jump into Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Keep the momentum—Starglow wants your take 📣\nhttp://starglow.pro/start",
            "🎁 Another poll is live—find it on Starglow 📣\nhttp://starglow.pro/start",
            "🎁 More voting fun awaits—check Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Starglow is calling—don’t miss out 📣\nhttp://starglow.pro/start",
            "🎁 More polls soon—stay tuned on Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Step up and vote on Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Keep going—join Starglow 📣\nhttp://starglow.pro/start",
            "🎁 One poll ends, more to come—Starglow 📣\nhttp://starglow.pro/start",
            "🎁 Make your next choice on Starglow 📣\nhttp://starglow.pro/start"
        ];

        const randEmbellish = embellishArr[Math.floor(Math.random() * embellishArr.length)];
        const randCallToAction = callToActionArr[Math.floor(Math.random() * callToActionArr.length)];
        announcementText = `🎉VOTE ENDED!🎉
${randEmbellish}


[${titleValue}]
🏆 ${winner.toUpperCase()} 🏆


${resultLines}


${randCallToAction}`;

        const announceResultColStr = String.fromCharCode(65 + announceResultCol);
        const announceRange = `Poll List!${announceResultColStr}${rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
            range: announceRange,
            valueInputOption: "USER_ENTERED",
            requestBody: {
              values: [[announcementText]],
            },
        });
        } else {
            console.log("'announce_result' column already has a text. Skipping text update.");
        }
    } else {
        console.log("'announce_result' column does not exist. Skipping text update.");
    }*/
  
    return {songsUrl};
}