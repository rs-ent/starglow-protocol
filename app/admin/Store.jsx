const { data: session } = useSession();
  const [telegramUser, setTelegramUser] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    // session이 존재하고 telegramUser 값이 있을 경우에만 파싱합니다.
    if (session?.user) {
      try {
        setTelegramUser(JSON.parse(session.user));
      } catch (error) {
        console.error("Failed to parse telegramUser:", error);
        setTelegramUser(null);
      }
    } else {
      setTelegramUser(null);
    }
  }, [session]);

  const handlePurchase = async () => {
    if (!telegramUser || !telegramUser.username) {
      alert("구매를 진행하려면 먼저 Telegram 로그인을 해주세요.");
      return;
    }
  };

  return (
    <>
      <Header />
      <div
        className="
          bg-[url('/poll-bg-dt.png')] bg-top bg-no-repeat bg-fixed
          bg-black bg-blend-multiply bg-opacity-15
          items-center justify-center pb-64
        "
      >
        <div className="container mx-auto px-6 py-12 justify-center">
          <h1 className="text-4xl font-bold text-center mb-10 mt-20">Store</h1>
          <div className="my-4 flex justify-center items-center p-4 text-center text-white text-sm">
            <TelegramLoginButton />
          </div>
          <div className="flex flex-col items-center">
            {/* 이미지 노출 */}
            <div className="mb-10">
              <Image
                src="/voting.png"
                alt="Voting Ticket"
                width={600}
                height={400}
                className="rounded shadow-lg"
              />
            </div>

            {/* Voting Ticket 구매 섹션 */}
            <div className="bg-gray-900 bg-opacity-75 p-8 rounded shadow-lg w-full md:w-1/2">
              <h2 className="text-3xl font-semibold mb-6 text-center">
                Voting Ticket
              </h2>
              <p className="mb-6 text-center">
                Purchase your Voting Ticket to participate in K-POP POLLS!
              </p>
              <div className="flex items-center justify-center mb-6">
                <label htmlFor="ticketCount" className="mr-3 text-lg font-main">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="ticketCount"
                  name="ticketCount"
                  min="1"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="w-20 border border-gray-300 rounded p-2 text-center text-black"
                />
              </div>
              <button
                onClick={handlePurchase}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded font-main"
              >
                Purchase Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer device="desktop" />
    </>
  );