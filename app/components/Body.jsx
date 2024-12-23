// components/body.jsx
'use client';

import Image from "next/image";

export default function Body() {
    return (
        <div
        className=""
        style={{
            position: 'relative',
        }}
        >
            <div className="Desktop" style={{
                overflowX: 'hidden',
            }}>
            <Image
                src="/images/body.png"
                alt="Header Image"
                width={1920}
                height={1080}
                style={{ width: '100%', height: 'auto', transform: 'scale(1.35)', overflowY: 'hidden', display: 'block', paddingTop: '30%'}}
            />
                {/* Gitbook Button
                <a
                href="/pageA"
                style={{
                    position: 'absolute',
                    top: '9%',
                    left: '44.2%',
                    width: '11.6%',
                    height: '1.7%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 255, 0, 0.4)',
                }}
                >
                    
                </a> */}

                {/* Scroll To */}
                <a
                href="#intro"
                style={{
                    position: 'absolute',
                    top: '20.6%',
                    left: '47.9%',
                    width: '4.2%',
                    height: '1.7%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 255, 0, 0.4)',
                }}
                >
                    
                </a>

                {/* Go To Telegram App */}
                <a
                href="https://t.me/starglow_redslippers_bot"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '83.6%',
                    left: '13%',
                    width: '19%',
                    height: '1.75%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 255, 0, 0.3)',
                }}
                >
                    
                </a>

                {/* Book 
                <a
                href="/pageA"
                style={{
                    position: 'absolute',
                    top: '85.2%',
                    left: '41.55%',
                    width: '2%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>*/}

                {/* Twitter */}
                <a
                href="https://x.com/StarglowP"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '100.65%',
                    left: '45.5%',
                    width: '2.2%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>

                {/* Telegram */}
                <a
                href="https://t.me/StarglowP_Ann"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '100.65%',
                    left: '52%',
                    width: '2.5%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>

                {/* Medium */}
                <a
                href="https://medium.com/@starglowP"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '100.65%',
                    left: '58.1%',
                    width: '3.65%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>


                {/* Section : Main */}
                <section
                id='main'
                style={{
                    position: 'absolute',
                    top: '0%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Intro */}
                <section
                id='intro'
                style={{
                    position: 'absolute',
                    top: '27%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Product */}
                <section
                id='product'
                style={{
                    position: 'absolute',
                    top: '71%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Contact */}
                <section
                id='contact'
                style={{
                    position: 'absolute',
                    top: '92%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

            </div>

            <div className="Mobile">
                <Image
                    src="/images/body_mobile.png"
                    alt="Body Image"
                    width={440}
                    height={160}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                {/* Scroll To */}
                <a
                href="#introM"
                style={{
                    position: 'absolute',
                    top: '12.36%',
                    left: '43%',
                    width: '14%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 255, 0, 0.4)',
                }}
                >
                    
                </a>

                {/* Go To Telegram App */}
                <a
                href="https://t.me/starglow_redslippers_bot"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '74%',
                    left: '5%',
                    width: '61.1%',
                    height: '0.95%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 255, 0, 0.3)',
                }}
                >
                    
                </a>

                {/* Book 
                <a
                href="/pageA"
                style={{
                    position: 'absolute',
                    top: '91.9%',
                    left: '17.5%',
                    width: '7.8%',
                    height: '0.6%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>*/}

                {/* Twitter */}
                <a
                href="https://x.com/StarglowP"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '92.45%',
                    left: '36.5%',
                    width: '7.8%',
                    height: '0.6%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>

                {/* Telegram */}
                <a
                href="https://t.me/StarglowP_Ann"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '92.45%',
                    left: '55.5%',
                    width: '7.8%',
                    height: '0.6%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>

                {/* Medium */}
                <a
                href="https://medium.com/@starglowP"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '92.45%',
                    left: '72.5%',
                    width: '12%',
                    height: '0.6%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>

                {/* Section : Main */}
                <section
                id='mainM'
                style={{
                    position: 'absolute',
                    top: '0%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Intro */}
                <section
                id='introM'
                style={{
                    position: 'absolute',
                    top: '16.5%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Product */}
                <section
                id='productM'
                style={{
                    position: 'absolute',
                    top: '65.5%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Contact */}
                <section
                id='contactM'
                style={{
                    position: 'absolute',
                    top: '88%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    //backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>
            </div>
            

            {/* 스타일 분기 */}
            <style jsx>{`
                .Desktop {
                display: block;
                position: relative; /* 앵커 절대 위치 기준 */
                }
                .Mobile {
                display: none;
                position: relative; /* 앵커 절대 위치 기준 */
                }
                @media (max-width: 440px) {
                .Desktop {
                    display: none;
                }
                .Mobile {
                    display: block;
                }
                }
            `}</style>
        </div>
    );
}