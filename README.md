# WesAI Image Generator

A powerful and intuitive web application for generating high-quality images from text prompts using Google's state-of-the-art AI models. This tool is designed for creatives, marketers, and developers to bring their ideas to life visually.

<img width="1070" height="987" alt="image" src="https://github.com/user-attachments/assets/42709973-c262-44c3-be28-c51ffc5a5b5c" />

---

## ✨ Features

- **AI-Powered Image Generation**: Utilizes Google's `Gemini Flash Image` and `Imagen 4` models to create stunning visuals from simple text descriptions.
- **Model Selection**: Seamlessly switch between different AI models to find the perfect style for your creation.
- **Custom Aspect Ratios**: Generate images in various formats, including `1:1`, `16:9`, `9:16`, `4:3`, and `3:4`, perfect for social media, presentations, or artwork.
- **A+ Content Mockup**: Automatically generate an e-commerce-ready "A+ Content" mockup from your generated image, ideal for product listings.
- **Sleek, Responsive UI**: A modern and clean user interface that works beautifully on both desktop and mobile devices.
- **Light & Dark Mode**: A comfortable viewing experience in any lighting condition with a polished theme switcher.
- **Secure API Key Handling**: API keys are stored securely in your browser's local storage and are never exposed on the client-side for backend operations.
- **Inspiration Prompts**: Get started quickly with a curated list of sample prompts.

## 🛠️ Tech Stack

This project is built with a modern, scalable, and efficient technology stack:

- **Frontend**: [React](https://reactjs.org/) (with TypeScript)
- **AI Backend**: [Google Gemini API](https://ai.google.dev/docs/gemini_api_overview) (`@google/genai`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Serverless Functions**: Vercel Edge Functions
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or later)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/wesai-image-generator.git
    cd wesai-image-generator
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add your Google AI Studio API key. You can get one from [Google AI Studio](https://makersuite.google.com/app/apikey).
    ```env
    # .env.local
    API_KEY="YOUR_GOOGLE_API_KEY"
    ```
    This key is used by the backend Vercel Edge Function (`/api/generate`) to communicate with the Gemini API securely.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or your configured port) to view it in the browser.

## ⚙️ Configuration

The application is configured to use the Google Gemini API via a secure backend endpoint.

-   **Frontend**: The React application collects the user's prompt, selected model, and aspect ratio.
-   **Backend (`/api/generate`)**: A Vercel Edge Function receives the request from the frontend, securely attaches the `API_KEY` from environment variables, and calls the appropriate Google Gemini model. This ensures your API key is never exposed to the client.

*Note: The initial version of this application used the Hugging Face API directly on the client. The current architecture has been upgraded to use a more secure and powerful backend-for-frontend (BFF) pattern with the Gemini API.*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/wesai-image-generator/issues).

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Built with passion by **John Wesley Quintero**.
