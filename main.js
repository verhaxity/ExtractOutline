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
    // Make initial canvas size more suitable for mobile
    const containerWidth = Math.min(500, window.innerWidth - 20); // 20px for padding
    const containerHeight = Math.min(300, window.innerHeight * 0.3);
    
    // Set both canvases to the same size
    [originalCanvas, outlineCanvas].forEach(canvas => {
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, containerWidth, containerHeight);
    });
}

// Function to process image
function processImage(img) {
    // Calculate aspect ratio
    const aspectRatio = img.width / img.height;
    
    // Set maximum dimensions
    let maxWidth = Math.min(500, window.innerWidth - 20);
    let maxHeight = window.innerHeight * 0.4;
    
    // Calculate new dimensions maintaining aspect ratio
    let newWidth = maxWidth;
    let newHeight = newWidth / aspectRatio;
    
    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
    }
    
    // Set canvas dimensions
    [originalCanvas, outlineCanvas].forEach(canvas => {
        canvas.width = newWidth;
        canvas.height = newHeight;
    });

    // Draw and process image
    originalCtx.drawImage(img, 0, 0, newWidth, newHeight);

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

// Add window resize handler
window.addEventListener('resize', () => {
    if (!imageInput.files.length) {  // Only resize if no image is uploaded
        setInitialCanvasSize();
    }
});
