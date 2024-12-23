// components/Header.jsx
import Image from "next/image";

export default function Header() {
    return (
        <div style={{ position: 'relative' }}>
            <Image
                src="/images/header_2x.png"
                alt="Header Image"
                width={1920}
                height={80}
                style={{ width: '100%', height: 'auto', display: 'block' }}
            />
                {/* Main */}
                <a
                href="#main"
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: '61.2%',
                    width: '3%',
                    height: '21%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>

                {/* Intro */}
                <a
                href="#intro"
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: '65.7%',
                    width: '3%',
                    height: '21%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>

                {/* Product */}
                <a
                href="#product"
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: '70.1%',
                    width: '4.7%',
                    height: '21%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>

                {/* Contact */}
                <a
                href="#contact"
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: '76.1%',
                    width: '4.5%',
                    height: '21%',
                    display: 'block',
                    // 디버깅
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                }}
                >
                    
                </a>
        </div>
    );
}