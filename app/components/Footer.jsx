import Image from "next/image";
import Link from "next/link";

export default function Footer({device}) {

    if (device === 'desktop') {
        const socialMediaIconSize = 28;
        return (
            <div className="bg-[rgba(22,22,22,1)]">
            <div className="flex items-center justify-between py-10 px-28">
                <div>
                    <Image 
                        src='/ui/starglow-horizontal.png'
                        alt='starglow-logo'
                        width={220}
                        height={34}
                        className="mb-2"
                    />
                    <p className="text-[0.6rem] text-[rgba(255,255,255,0.5)]">
                        Copyright ©Starglow. All rights reserved.
                    </p>
                </div>
                <div>
                    <h1 className="text-xs">
                        FOLLOW US ON SOCIAL MEDIA
                    </h1>
                    <div className="flex justify-between py-2 px-4">
                            <Image 
                                src='/ui/gitbook-icon-black-round.png'
                                alt='starglow-logo'
                                width={socialMediaIconSize}
                                height={socialMediaIconSize}
                            />

                        <Link href="https://x.com/StarglowP" target="_blank">
                        <Image 
                            src='/ui/x-icon-black-round.png'
                            alt='starglow-logo'
                            width={socialMediaIconSize}
                            height={socialMediaIconSize}
                        />
                        </Link>

                        <Link href="https://t.me/StarglowP_Ann" target="_blank">
                        <Image 
                            src='/ui/telegram-icon-black-round.png'
                            alt='starglow-logo'
                            width={socialMediaIconSize}
                            height={socialMediaIconSize}
                        />
                        </Link>

                        <Link href="https://medium.com/@starglowP" target="_blank">
                        <Image 
                            src='/ui/medium-icon-black-round.png'
                            alt='starglow-logo'
                            width={socialMediaIconSize}
                            height={socialMediaIconSize}
                        />
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        )
    } else {
        const socialMediaIconSize = 22;
        return (
            <div className="bg-[rgba(22,22,22,1)]">
            <div className="inline-flex flex-col items-left p-8">
                <div>
                    <Image 
                        src='/ui/starglow-horizontal.png'
                        alt='starglow-logo'
                        width={160}
                        height={30}
                        className="mb-2"
                    />
                    <p className="text-[0.5rem] text-[rgba(255,255,255,0.5)]">
                        Copyright ©Starglow. All rights reserved.
                    </p>
                </div>
                <div>
                    <div className="grid grid-cols-4 justify-between mt-2 pt-2">
                            <Image 
                                src='/ui/gitbook-icon-black-round.png'
                                alt='starglow-logo'
                                width={socialMediaIconSize}
                                height={socialMediaIconSize}
                            />

                        <Link href="https://x.com/StarglowP" target="_blank">
                        <Image 
                            src='/ui/x-icon-black-round.png'
                            alt='starglow-logo'
                            width={socialMediaIconSize}
                            height={socialMediaIconSize}
                        />
                        </Link>

                        <Link href="https://t.me/StarglowP_Ann" target="_blank">
                        <Image 
                            src='/ui/telegram-icon-black-round.png'
                            alt='starglow-logo'
                            width={socialMediaIconSize}
                            height={socialMediaIconSize}
                        />
                        </Link>

                        <Link href="https://medium.com/@starglowP" target="_blank">
                        <Image 
                            src='/ui/medium-icon-black-round.png'
                            alt='starglow-logo'
                            width={socialMediaIconSize}
                            height={socialMediaIconSize}
                        />
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        )
    }
};