# WesAI Image Generator

A simple and elegant web application to generate images from text prompts using state-of-the-art AI models. This version features a resilient, multi-provider architecture powered by **Google Gemini** and **Hugging Face**.

<img width="1070" height="987" alt="image" src="https://github.com/user-attachments/assets/42709973-c262-44c3-be28-c51ffc5a5b5c" />

---

## ✨ Features

- **Multi-Provider AI Engine**: Choose between Google's powerful `imagen-4.0-generate-001` model (recommended) or Hugging Face's `stabilityai/stable-diffusion-xl-base-1.0`.
- **Smart Failover**: If the primary model (Gemini) hits a quota limit, the app automatically switches to the fallback provider to ensure uninterrupted creativity.
- **Persistent Image Library**: All your generated images are saved in your browser's local storage. Review, download, or delete your creations at any time.
- **Client-Side Focused**: Runs directly in the browser, making it easy to deploy on any static hosting platform.
- **Dual API Key Management**: A clean, tabbed settings modal allows you to securely save both your Google and Hugging Face API keys.
- **A+ Content Mockup**: Automatically generate an e-commerce-ready "A+ Content" mockup from your generated image.
- **Sleek, Responsive UI**: A modern interface with light and dark modes, designed to work beautifully on any device.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (with TypeScript)
- **AI Providers**: 
    - [Google Gemini API](https://ai.google.dev/)
    - [Hugging Face Inference API](https://huggingface.co/inference-api)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Any static web host (e.g., Vercel, Netlify, GitHub Pages)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or later)
- A Google API Key for Gemini
- A Hugging Face User Access Token (API Key)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/wesai-image-generator.git
    cd wesai-image-generator
    ```

2.  **Get your API Keys:**
    - **Google Gemini:**
        - Go to [ai.google.dev](https://ai.google.dev/) to create your API key.
    - **Hugging Face:**
        - Go to your Hugging Face profile settings: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
        - Create a new User Access Token with the "read" role.

3.  **Run the application:**
    This project is set up to run in a development environment like AI Studio. Once running, click the "Settings" icon in the top right corner to enter and save your API keys in their respective tabs. Keys are stored only in your browser's local storage.

4.  **Start generating!**
    With the keys saved, you can now select a model, enter a prompt, and generate images.

## ⚙️ How It Works

This application communicates directly with the Google and Hugging Face APIs from the client-side.

-   When you enter your API keys, they are saved securely in your browser's `localStorage`.
-   When you submit a prompt, the application sends a `fetch` request to the selected API provider, including your prompt and the corresponding API key.
-   The API returns an image, which is then converted into a data URL and displayed on the page.
-   The smart failover logic provides a seamless experience by automatically retrying with the alternate provider if a quota error is detected.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is licensed under the MIT License.
