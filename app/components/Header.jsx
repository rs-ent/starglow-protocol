// components/Header.jsx
'use client';

import Image from "next/image";

export default function Header() {
    const debugColor = 'rgba(150, 255, 0, 0)';

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 999,
                overflowY: 'hidden',
            }}
        >
            <div className="Desktop" style={{
                overflow: 'hidden',
            }}>
                <Image
                    src="/images/header2.png"
                    alt="Header Image"
                    width={1920}
                    height={80}
                    style={{ width: '100%', height: 'auto', transform: 'scale(1.1)', overflowY: 'hidden', display: 'block' }}
                />
                    {/* Main */}
                    <a
                    href="/#main"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '70.45%',
                        width: '3.0%',
                        height: '21%',
                        display: 'block',
                        // 디버깅
                        backgroundColor: debugColor,
                    }}
                    >
                        
                    </a>

                    {/* Intro */}
                    <a
                    href="/#intro"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '75.05%',
                        width: '3.5%',
                        height: '21%',
                        display: 'block',
                        // 디버깅
                        backgroundColor: debugColor,
                    }}
                    >
                        
                    </a>

                    {/* Product */}
                    <a
                    href="/#product"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '79.95%',
                        width: '5.1%',
                        height: '21%',
                        display: 'block',
                        // 디버깅
                        backgroundColor: debugColor,
                    }}
                    >
                        
                    </a>

                    {/* Polls */}
                    <a
                    href="/polls"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '86.5%',
                        width: '6.5%',
                        height: '21%',
                        display: 'block',
                        // 디버깅
                        backgroundColor: debugColor,
                    }}
                    >
                        
                    </a>
            </div>

            <div className="Mobile">
                <Image
                    src="/images/header2_mobile.png"
                    alt="Header Image"
                    width={440}
                    height={160}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                {/* Main */}
                <a
                    href="/#mainM"
                    style={{
                        position: 'absolute',
                        top: '71.5%',
                        left: '5.8%',
                        width: '11%',
                        height: '14%',
                        display: 'block',
                        // 디버깅
                        backgroundColor: debugColor,
                    }}
                    >
                        
                    </a>

                    {/* Intro */}
                    <a
                    href="/#introM"
                    style={{
                        position: 'absolute',
                        top: '71.5%',
                        left: '24.8%',
                        width: '11%',
                        height: '14%',
                        display: 'block',
                        // 디버깅
                        backgroundColor: debugColor,
                    }}
                    >
                        
                    </a>

                    {/* Product */}
                    <a
                    href="/#productM"
                    style={{
                        position: 'absolute',
                        top: '71.5%',
                        left: '44.1%',
                        width: '18%',
                        height: '14%',
                        display: 'block',
                        // 디버깅
                        backgroundColor: debugColor,
                    }}
                    >
                        
                    </a>

                    {/* Contact */}
                    <a
                    href="/polls"
                    style={{
                        position: 'absolute',
                        top: '71.5%',
                        left: '70.1%',
                        width: '24%',
                        height: '14%',
                        display: 'block',
                        // 디버깅
                        backgroundColor: debugColor,
                    }}
                    >
                        
                    </a>
            </div>

            {/* 스타일 분기 */}
            <style jsx>{`
                .Desktop {
                display: block;
                position: relative;
                }
                .Mobile {
                display: none;
                position: relative;
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