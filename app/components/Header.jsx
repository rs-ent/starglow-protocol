// components/Header.jsx
'use client';

import Image from "next/image";

export default function Header() {
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
                    src="/images/header.png"
                    alt="Header Image"
                    width={1920}
                    height={80}
                    style={{ width: '100%', height: 'auto', transform: 'scale(1.35)', overflowY: 'hidden', display: 'block' }}
                />
                    {/* Main */}
                    <a
                    href="/#main"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '65.7%',
                        width: '3.2%',
                        height: '21%',
                        display: 'block',
                        // 디버깅
                        //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    }}
                    >
                        
                    </a>

                    {/* Intro */}
                    <a
                    href="/#intro"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '71.3%',
                        width: '3.7%',
                        height: '21%',
                        display: 'block',
                        // 디버깅
                        //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    }}
                    >
                        
                    </a>

                    {/* Product */}
                    <a
                    href="/#product"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '77.1%',
                        width: '5.8%',
                        height: '21%',
                        display: 'block',
                        // 디버깅
                        //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    }}
                    >
                        
                    </a>

                    {/* Contact */}
                    <a
                    href="/polls"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '85.3%',
                        width: '5.7%',
                        height: '21%',
                        display: 'block',
                        // 디버깅
                        //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    }}
                    >
                        
                    </a>
            </div>

            <div className="Mobile">
                <Image
                    src="/images/header_mobile.png"
                    alt="Header Image"
                    width={440}
                    height={160}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                {/* Main */}
                <a
                    href="#mainM"
                    style={{
                        position: 'absolute',
                        top: '72%',
                        left: '9%',
                        width: '11%',
                        height: '12%',
                        display: 'block',
                        // 디버깅
                        //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    }}
                    >
                        
                    </a>

                    {/* Intro */}
                    <a
                    href="#introM"
                    style={{
                        position: 'absolute',
                        top: '72%',
                        left: '28.3%',
                        width: '11%',
                        height: '12%',
                        display: 'block',
                        // 디버깅
                        //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    }}
                    >
                        
                    </a>

                    {/* Product */}
                    <a
                    href="#productM"
                    style={{
                        position: 'absolute',
                        top: '72%',
                        left: '47.5%',
                        width: '18%',
                        height: '12%',
                        display: 'block',
                        // 디버깅
                        //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    }}
                    >
                        
                    </a>

                    {/* Contact */}
                    <a
                    href="#contactM"
                    style={{
                        position: 'absolute',
                        top: '72%',
                        left: '73.5%',
                        width: '17%',
                        height: '12%',
                        display: 'block',
                        // 디버깅
                        //backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    }}
                    >
                        
                    </a>
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