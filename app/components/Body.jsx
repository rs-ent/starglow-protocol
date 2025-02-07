// components/body.jsx
'use client';

import React, { useEffect } from 'react';
import Image from "next/image";

export default function Body() {

    useEffect(() => {
        // 컴포넌트가 마운트된 후(즉, 로딩이 끝난 시점)
        window.scrollTo(0, 0);
    }, []);

    const bgDebug = 'rgba(0, 255, 0, 0.0)';

    return (
        <div
        className=""
        style={{
            position: 'relative',
        }}
        >
            <div className="Desktop" style={{
                position: 'relative',
            }}>
            <Image
                src="/images/body2x.png"
                alt="Header Image"
                width={1920}
                height={1080}
                style={{ width: '100%', height: 'auto', transform: 'scale(1.35)', display: 'block', transformOrigin: 'top',}}
            />
                {/* Gitbook Button */}
                <a
                href="https://s-organization-687.gitbook.io/starglow.pro"
                target="_blank"
                style={{
                    position: 'absolute',
                    top: '14.6%',
                    left: '42.3%',
                    width: '15.5%',
                    height: '2.45%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                >
                    
                </a>

                {/* Scroll To */}
                <a
                href="#intro"
                style={{
                    position: 'absolute',
                    top: '21.3%',
                    left: '47.9%',
                    width: '4.2%',
                    height: '1.8%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
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
                    top: '93.3%',
                    left: '13%',
                    width: '19%',
                    height: '1.75%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                >
                    
                </a>

                {/* GitBook */}
                <a
                href="https://s-organization-687.gitbook.io/starglow.pro"
                target="_blank"
                style={{
                    position: 'absolute',
                    top: '116.15%',
                    left: '38.95%',
                    width: '2%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                >
                </a>

                {/* Twitter */}
                <a
                href="https://x.com/StarglowP"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: '116.15%',
                    left: '45.5%',
                    width: '2.2%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
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
                    top: '116.15%',
                    left: '52%',
                    width: '2.5%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
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
                    top: '116.15%',
                    left: '58.1%',
                    width: '3.65%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
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
                    backgroundColor: bgDebug,
                }}
                ></section>

                {/* Section : Intro */}
                <section
                id='intro'
                style={{
                    position: 'absolute',
                    top: '22.5%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                ></section>

                {/* Section : Product */}
                <section
                id='product'
                style={{
                    position: 'absolute',
                    top: '76.5%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                ></section>

                {/* Section : Contact */}
                <section
                id='contact'
                style={{
                    position: 'absolute',
                    top: '102%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                ></section>

            </div>

            <div className="Mobile">
                <Image
                    src="/images/body_mobile3x.png"
                    alt="Body Image"
                    width={440}
                    height={160}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                {/* Gitbook Button */}
                <a
                href="https://s-organization-687.gitbook.io/starglow.pro"
                target="_blank"
                style={{
                    position: 'absolute',
                    top: '9.55%',
                    left: '28.0%',
                    width: '44.25%',
                    height: '0.9%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                ></a>

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
                    backgroundColor: bgDebug,
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
                    backgroundColor: bgDebug,
                }}
                >
                    
                </a>

                {/* GitBook */}
                <a
                href="https://s-organization-687.gitbook.io/starglow.pro"
                target="_blank"
                style={{
                    position: 'absolute',
                    top: '92.45%',
                    left: '17.5%',
                    width: '7.8%',
                    height: '0.6%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                >
                    
                </a>

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
                    backgroundColor: bgDebug,
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
                    backgroundColor: bgDebug,
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
                    backgroundColor: bgDebug,
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
                    backgroundColor: bgDebug,
                }}
                ></section>

                {/* Section : Intro */}
                <section
                id='introM'
                style={{
                    position: 'absolute',
                    top: '17.2%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
                }}
                ></section>

                {/* Section : Product */}
                <section
                id='productM'
                style={{
                    position: 'absolute',
                    top: '67.7%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: bgDebug,
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
                    backgroundColor: bgDebug,
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