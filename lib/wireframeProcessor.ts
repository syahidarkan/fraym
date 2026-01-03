import { ElementType } from '@/store/canvasStore';
import { createWorker } from 'tesseract.js';

export interface CanvasElement {
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    content?: string;
    props?: Record<string, any>;
}

function toGrayscale(imageData: ImageData): Uint8ClampedArray {
    const { data, width, height } = imageData;
    const gray = new Uint8ClampedArray(width * height);
    for (let i = 0; i < data.length; i += 4) {
        gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    return gray;
}

function threshold(gray: Uint8ClampedArray, t: number): Uint8ClampedArray {
    const binary = new Uint8ClampedArray(gray.length);
    for (let i = 0; i < gray.length; i++) {
        binary[i] = gray[i] < t ? 1 : 0;
    }
    return binary;
}

function findBlobs(binary: Uint8ClampedArray, width: number, height: number) {
    const visited = new Uint8Array(binary.length);
    const blobs: Array<{ x: number; y: number; w: number; h: number }> = [];

    for (let i = 0; i < binary.length; i++) {
        if (binary[i] === 1 && visited[i] === 0) {
            let minX = width, maxX = 0, minY = height, maxY = 0;
            const stack = [i];
            visited[i] = 1;
            let count = 0;

            while (stack.length > 0) {
                const idx = stack.pop()!;
                const x = idx % width;
                const y = Math.floor(idx / width);
                count++;

                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;

                const neighbors = [idx - 1, idx + 1, idx - width, idx + width];
                for (const n of neighbors) {
                    if (n >= 0 && n < binary.length && binary[n] === 1 && visited[n] === 0) {
                        visited[n] = 1;
                        stack.push(n);
                    }
                }
            }

            const w = maxX - minX;
            const h = maxY - minY;

            if (w > 20 && h > 20 && count > 100) {
                blobs.push({ x: minX, y: minY, w, h });
            }
        }
    }
    return blobs;
}

export async function processWireframeImage(file: File): Promise<CanvasElement[]> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = async () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;

                const targetWidth = 1000;
                const scale = targetWidth / img.width;
                canvas.width = targetWidth;
                canvas.height = img.height * scale;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const gray = toGrayscale(imageData);
                const binary = threshold(gray, 180);
                const shapes = findBlobs(binary, canvas.width, canvas.height);

                console.log(`✓ Detected ${shapes.length} shapes`);

                const worker = await createWorker('eng');
                const result = await worker.recognize(canvas);
                const data: any = result.data;

                console.log('=== OCR ===');
                console.log('Words:', data.words?.length || 0);
                console.log('Lines:', data.lines?.length || 0);

                const texts: Array<{ text: string; x: number; y: number; w: number; h: number }> = [];

                // Strategy 1: Try lines with bbox
                if (data.lines && data.lines.length > 0) {
                    console.log('Using LINES with bbox');
                    data.lines.forEach((line: any) => {
                        if (line.text && line.text.trim().length > 0 && line.bbox) {
                            console.log(`Line: "${line.text}" at (${line.bbox.x0}, ${line.bbox.y0})`);
                            texts.push({
                                text: line.text.trim(),
                                x: line.bbox.x0,
                                y: line.bbox.y0,
                                w: line.bbox.x1 - line.bbox.x0,
                                h: line.bbox.y1 - line.bbox.y0
                            });
                        }
                    });
                }

                // Strategy 2: Try words with bbox
                if (texts.length === 0 && data.words && data.words.length > 0) {
                    console.log('Using WORDS with bbox');
                    data.words.forEach((word: any) => {
                        if (word.text && word.text.trim().length > 0 && word.bbox) {
                            console.log(`Word: "${word.text}" at (${word.bbox.x0}, ${word.bbox.y0})`);
                            texts.push({
                                text: word.text.trim(),
                                x: word.bbox.x0,
                                y: word.bbox.y0,
                                w: word.bbox.x1 - word.bbox.x0,
                                h: word.bbox.y1 - word.bbox.y0
                            });
                        }
                    });
                }

                // Strategy 3: FALLBACK - Manual parsing from raw text
                if (texts.length === 0 && data.text && data.text.trim().length > 0) {
                    console.log('!!! FALLBACK: Manual text parsing from data.text');
                    console.log('Raw text:', data.text);
                    const lines = data.text.split('\n').filter((line: string) => line.trim().length > 0);
                    let yOffset = 100;

                    lines.forEach((line: string) => {
                        const trimmed = line.trim();
                        if (trimmed.length > 0) {
                            console.log(`Creating text: "${trimmed}" at (100, ${yOffset})`);
                            texts.push({
                                text: trimmed,
                                x: 100,
                                y: yOffset,
                                w: trimmed.length * 15,
                                h: 30
                            });
                            yOffset += 60;
                        }
                    });
                }

                console.log(`✓ Extracted ${texts.length} texts`);

                const elements: CanvasElement[] = [{
                    type: 'container',
                    x: 0,
                    y: 0,
                    width: canvas.width,
                    height: canvas.height,
                    props: { backgroundColor: '#ffffff' }
                }];

                for (const shape of shapes) {
                    if (shape.w > canvas.width * 0.95) continue;

                    let type: ElementType = 'container';
                    const ratio = shape.w / shape.h;

                    if (ratio > 5) type = 'input';
                    else if (shape.w * shape.h < 8000) type = 'image';

                    elements.push({
                        type,
                        x: shape.x,
                        y: shape.y,
                        width: shape.w,
                        height: shape.h,
                        props: {}
                    });
                }

                texts.forEach(t => {
                    elements.push({
                        type: 'text',
                        x: t.x,
                        y: t.y,
                        width: t.w,
                        height: t.h,
                        content: t.text,
                        props: { label: t.text, fontSize: 18 }
                    });
                });

                await worker.terminate();
                console.log(`✓ Total: ${elements.length} elements`);
                resolve(elements);

            } catch (err) {
                reject(err);
            }
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}
