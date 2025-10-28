# WesAI Image Generator

A simple and elegant web application to generate images from text prompts using Hugging Face's Stable Diffusion model. Enter a descriptive prompt, and the AI will create a visual representation. This project is designed to be straightforward to set up and run entirely on the client-side.

<img width="1070" height="987" alt="image" src="https://github.com/user-attachments/assets/42709973-c262-44c3-be28-c51ffc5a5b5c" />

---

## ✨ Features

- **AI-Powered Image Generation**: Leverages the Hugging Face Inference API with a Stable Diffusion model to create images from text.
- **Client-Side Focused**: Runs directly in the browser, making it easy to deploy on any static hosting platform.
- **API Key Management**: A simple settings modal allows you to securely save your Hugging Face API key in your browser's local storage.
- **A+ Content Mockup**: Automatically generate an e-commerce-ready "A+ Content" mockup from your generated image, ideal for product listings.
- **Sleek, Responsive UI**: A modern and clean user interface that works beautifully on both desktop and mobile devices.
- **Light & Dark Mode**: A comfortable viewing experience in any lighting condition with a polished theme switcher.
- **Inspiration Prompts**: Get started quickly with a curated list of sample prompts.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (with TypeScript)
- **AI Backend**: [Hugging Face Inference API](https://huggingface.co/inference-api)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Any static web host (e.g., Vercel, Netlify, GitHub Pages)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or later)
- A Hugging Face User Access Token (API Key).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/wesai-image-generator.git
    cd wesai-image-generator
    ```

2.  **Get your Hugging Face API Key:**
    - Go to your Hugging Face profile settings: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
    - Create a new User Access Token with the "read" role. This will be your API key.

3.  **Run the application:**
    This project is set up to run in a development environment like AI Studio. Once running, click the "Settings" icon in the top right corner to enter and save your Hugging Face API key. The key will be stored in your browser's local storage for future visits.

4.  **Start generating!**
    With the key saved, you can now enter a prompt and generate images.

## ⚙️ How It Works

This application communicates directly with the Hugging Face Inference API from the client-side (your browser).

-   When you enter your API key, it is saved securely in your browser's `localStorage`.
-   When you submit a prompt, the application sends a `fetch` request to the Hugging Face API, including your prompt and the API key in the authorization header.
-   The API returns an image blob, which is then converted into a data URL and displayed on the page.

This client-side approach simplifies deployment, as there is no backend to manage.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is licensed under the MIT License.
