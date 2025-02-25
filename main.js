// DOM Elements
const imageInput = document.getElementById('imageInput');
const uploadBtn = document.getElementById('uploadBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const originalCanvas = document.getElementById('originalCanvas');
const outlineCanvas = document.getElementById('outlineCanvas');
const originalCtx = originalCanvas.getContext('2d');
const outlineCtx = outlineCanvas.getContext('2d');

// Hide buttons initially
resetBtn.style.display = 'none';
downloadBtn.style.display = 'none';

// Set initial canvas size
function setInitialCanvasSize() {
    const width = 500;
    const height = 300;
    originalCanvas.width = width;
    originalCanvas.height = height;
    outlineCanvas.width = width;
    outlineCanvas.height = height;

    // Fill with background color
    originalCtx.fillStyle = '#f5f5f5';
    originalCtx.fillRect(0, 0, width, height);
    outlineCtx.fillStyle = '#f5f5f5';
    outlineCtx.fillRect(0, 0, width, height);
}

// Function to process image
function processImage(img) {
    // Set canvas dimensions to match image
    originalCanvas.width = img.width;
    originalCanvas.height = img.height;
    outlineCanvas.width = img.width;
    outlineCanvas.height = img.height;

    // Draw original image
    originalCtx.drawImage(img, 0, 0);

    // Get image data
    const imageData = originalCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    // Create new ImageData for outline
    const outlineImageData = new ImageData(img.width, img.height);
    const outlineData = outlineImageData.data;

    // Edge detection
    for (let y = 1; y < img.height - 1; y++) {
        for (let x = 1; x < img.width - 1; x++) {
            const idx = (y * img.width + x) * 4;

            // Sobel operator
            const gx = 
                -data[idx - 4 - img.width * 4] +
                data[idx + 4 - img.width * 4] +
                -2 * data[idx - 4] +
                2 * data[idx + 4] +
                -data[idx - 4 + img.width * 4] +
                data[idx + 4 + img.width * 4];

            const gy = 
                -data[idx - img.width * 4 - 4] +
                -2 * data[idx - img.width * 4] +
                -data[idx - img.width * 4 + 4] +
                data[idx + img.width * 4 - 4] +
                2 * data[idx + img.width * 4] +
                data[idx + img.width * 4 + 4];

            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const threshold = 50;
            const value = magnitude > threshold ? 255 : 0;

            outlineData[idx] = value;
            outlineData[idx + 1] = value;
            outlineData[idx + 2] = value;
            outlineData[idx + 3] = 255;
        }
    }

    // Draw outline
    outlineCtx.putImageData(outlineImageData, 0, 0);
}

// Event Listeners
uploadBtn.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                processImage(img);
                resetBtn.style.display = 'inline-block';
                downloadBtn.style.display = 'inline-block';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

resetBtn.addEventListener('click', () => {
    // Clear canvases
    originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
    
    // Reset canvas size
    setInitialCanvasSize();
    
    // Hide buttons
    resetBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
    
    // Reset file input
    imageInput.value = '';
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'outline.png';
    link.href = outlineCanvas.toDataURL();
    link.click();
});

// Initialize canvas
setInitialCanvasSize();

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
    });
}
