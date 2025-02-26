import LocaleNavigator from "./LocaleNavigator";
import { getSheetsData } from "../../scripts/google-sheets-data";
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

async function optimizeImageFromBuffer(buffer, outputPath) {
    try {
      await sharp(buffer)
        .resize(1200, 630, {
          fit: 'cover', // 이미지 중심 기준 자르기
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath);
  
      console.log('이미지 최적화 완료 (Buffer):', outputPath);
      return outputPath;
    } catch (error) {
      console.error('이미지 최적화 중 오류 발생 (Buffer):', error);
      throw error;
    }
  }
  

export async function generateMetadata({ params }) {
    const { poll_id } = params;
    const pollData = await getSheetsData();
    const poll = pollData?.[poll_id];

    const title = poll?.title
        ? `[POLL #${poll_id.slice(1)}] ${poll.title}`
        : `Starglow K-POP Poll #${poll_id.slice(1)}`;

    const description = poll?.options
        ? `#${poll.options.split(';').join(' #')}`
        : "Participate in our K-POP Poll!";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://starglow-protocol.vercel.app';
    // image는 poll의 poll_announce_img 또는 img가 절대 URL로 제공됨
    let image = poll?.poll_announce_img || poll?.img;

    try {
        // 외부 이미지 fetch
        const response = await fetch(image);
        if (response.ok) {
            // 배열 버퍼를 Buffer 객체로 변환
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 파일 크기가 5MB 이상이면 최적화 진행 (5MB = 5 * 1024 * 1024 바이트)
            if (buffer.length > 5 * 1024 * 1024) {
                // URL에서 파일명 추출
                const urlObj = new URL(image);
                const fileName = path.basename(urlObj.pathname);
                // 최적화된 이미지를 저장할 디렉토리 (public/optimized)
                const optimizedDir = path.join(process.cwd(), 'public', 'optimized');
                await fs.mkdir(optimizedDir, { recursive: true });
                const optimizedFileName = `optimized-${fileName}`;
                const optimizedImagePath = path.join(optimizedDir, optimizedFileName);

                await optimizeImageFromBuffer(buffer, optimizedImagePath);
                // 메타데이터에 사용할 이미지 URL 업데이트 (최적화된 이미지는 우리 도메인에서 제공)
                image = baseUrl + '/optimized/' + optimizedFileName;
            }
        } else {
            console.error(`외부 이미지 불러오기 실패: ${image}`);
        }
    } catch (error) {
        console.error('외부 이미지 fetch/최적화 오류:', error);
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${baseUrl}/polls/${poll_id}`,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            siteName: "Starglow Protocol",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            image,
        },
    };
}

export default async function PollHome({ params }) {
    const { poll_id } = await params;

    return <LocaleNavigator poll_id={poll_id} />;
};