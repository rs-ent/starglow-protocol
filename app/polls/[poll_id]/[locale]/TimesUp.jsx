import Image from "next/image";

export default function TimesUp({t}) {
    return (
        <div className="m-4 p-2 flex flex-col min-h-screen items-center justify-center">
            <div className="relative items-center justify-center">
                <h1 className="text-center text-base text-outline-1 mt-10">
                    {t['poll']['checkInX']}
                </h1>
                <h1 className="text-center text-5xl text-outline-1">
                    00:00:00
                </h1>
                <h1 className="text-3xl whitespace-pre-wrap text-center mt-16 px-3">
                    {t['poll']['timesUp']}
                </h1>
                <hr className="border-t border-[rgba(255,255,255,0.4)] my-3 px-3 w-full" />
                <h3 className="text-lg whitespace-pre-wrap text-center px-3">
                    {t['poll']['closedPoll']}
                </h3>
            </div>
            <a
                href="/polls"
                rel="noreferrer"
                className="button-base mt-16"
            >
                <Image 
                    src='/ui/search-icon.png'
                    alt='search-icon'
                    width={17}
                    height={17}
                    className="mr-2"
                />
                {t['poll']['discoverMore']}
            </a>
            <a
                href="https://x.com/StarglowP"
                target="_blank"
                rel="noreferrer"
                className="button-black mt-4 mb-16"
            >
                <Image 
                    src='/ui/x-icon.png'
                    alt='search-icon'
                    width={15}
                    height={15}
                    className="mr-2"
                />
                {t['poll']['followStarglow']}
            </a>

            <div className="mt-auto flex justify-center mb-4">
                <Image src="/sgt_logo.png" alt="STARGLOW LOGO" width={130} height={130} />
            </div>
        </div>
    );
}