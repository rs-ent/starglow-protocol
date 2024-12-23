// components/body.jsx
import Image from "next/image";

export default function Body() {
    return (
        <div style={{ position: 'relative' }}>
            <Image
                src="/images/body_2x.png"
                alt="Header Image"
                width={1920}
                height={1080}
                style={{ width: '100%', height: 'auto', display: 'block' }}
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
                    top: '13.53%',
                    left: '48.2%',
                    width: '3.55%',
                    height: '1.7%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 255, 0, 0.4)',
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
                    top: '70.4%',
                    left: '22.6%',
                    width: '14%',
                    height: '1.5%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 255, 0, 0.3)',
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
                    top: '85.2%',
                    left: '46.45%',
                    width: '2%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
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
                    top: '85.2%',
                    left: '51.45%',
                    width: '2%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
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
                    top: '85.2%',
                    left: '56.1%',
                    width: '2.65%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
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
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Intro */}
                <section
                id='intro'
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Product */}
                <section
                id='product'
                style={{
                    position: 'absolute',
                    top: '60%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

                {/* Section : Contact */}
                <section
                id='contact'
                style={{
                    position: 'absolute',
                    top: '80%',
                    left: '0%',
                    width: '100%',
                    height: '1%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                }}
                ></section>

        </div>
    );
}