# ExtractOutline - Image Outline Extraction Tool

## Overview
ExtractOutline is a lightweight web-based tool that processes an input image and returns a dithered extracted outline of objects in the image. It is designed for artists, designers, and developers who need quick and clean outlines for their projects.


![ExtractOutline-preview](https://github.com/user-attachments/assets/965e0da6-21cb-4bb7-946a-5719311c2bca)



## Features
- ->  **Upload an image** and generate an outline instantly.
- ->  **Edge detection** using a Sobel operator in JavaScript.
- ->  **Canvas-based image processing** for real-time previews.
- ->  **Dark & Light theme support**.
- ->  **Fast and efficient processing** using pure JavaScript.

## Tech Stack
- **Frontend:** HTML, CSS (Custom styling, `@font-face` integration)
- **Image Processing:** JavaScript (`Canvas API`, `Sobel Operator` for edge detection)
- **UI Features:** Custom buttons, file upload handling, theme toggle functionality

## How It Works
1. Upload an image using the **Upload Image** button.
2. The tool processes the image using the **Sobel edge detection algorithm**.
3. The extracted outline is displayed on a second canvas.
4. You can download the processed outline as an image.
5. Reset the tool to process a new image.

## Installation & Usage
### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/verhaxity/ExtractOutline.git
   cd ExtractOutline
   ```
2. Open `index.html` in a web browser.

### How to Use
- Click **Upload Image** to select an image from your device.
- The tool will process the image and generate an outline.
- Use the **Download Outline** button to save the result.
- Click **Reset** to clear the canvases and upload a new image.
- Toggle between **Light and Dark Mode** (if available).

## Contributing
Feel free to contribute by submitting pull requests or reporting issues.

## License
MIT License

