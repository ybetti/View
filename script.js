function detectDefects() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const sobelData = [];
    const grayscaleData = [];

    // 画像をグレースケールに変換
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        grayscaleData.push(avg, avg, avg, 255);
    }

    // Sobelオペレーターを適用
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = (y * width + x) * 4;

            const gx = (
                -1 * grayscaleData[((y - 1) * width + (x - 1)) * 4] +
                -2 * grayscaleData[(y * width + (x - 1)) * 4] +
                -1 * grayscaleData[((y + 1) * width + (x - 1)) * 4] +
                1 * grayscaleData[((y - 1) * width + (x + 1)) * 4] +
                2 * grayscaleData[(y * width + (x + 1)) * 4] +
                1 * grayscaleData[((y + 1) * width + (x + 1)) * 4]
            );

            const gy = (
                -1 * grayscaleData[((y - 1) * width + (x - 1)) * 4] +
                -2 * grayscaleData[((y - 1) * width + x) * 4] +
                -1 * grayscaleData[((y - 1) * width + (x + 1)) * 4] +
                1 * grayscaleData[((y + 1) * width + (x - 1)) * 4] +
                2 * grayscaleData[((y + 1) * width + x) * 4] +
                1 * grayscaleData[((y + 1) * width + (x + 1)) * 4]
            );

            const magnitude = Math.sqrt(gx * gx + gy * gy) >>> 0;
            sobelData[index] = magnitude;
            sobelData[index + 1] = magnitude;
            sobelData[index + 2] = magnitude;
            sobelData[index + 3] = 255;
        }
    }

    // 新しい画像データを作成してキャンバスに表示
    const newImageData = new ImageData(new Uint8ClampedArray(sobelData), width, height);
    ctx.putImageData(newImageData, 0, 0);
}
