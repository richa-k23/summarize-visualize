
# Summarize & Visualize

A React application that lets users upload or paste text, generates a summary using the Gemini API, and creates visualizations of that summary using Hugging Face's Stability AI image generation model.

## Features

- **Text Input**: Upload a text file or paste text directly
- **AI Summarization**: Generate concise summaries using Google's Gemini API
- **AI Visualization**: Create images based on the summary using Stability AI
- **Edit & Regenerate**: Modify the summary and regenerate images as needed
- **Multiple Images**: Generate multiple visualizations for each summary
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React (with Vite)
- **Styling**: Tailwind CSS
- **APIs**:
  - Google Gemini 2.0 Flash for text summarization
  - Hugging Face's Stability AI for image generation

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root and add your API keys:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Upload a text file by dragging and dropping or clicking the file area
2. Alternatively, paste text directly into the text area
3. Click "Summarize" to generate a summary and images
4. Edit the summary and click "Regenerate Image" to create new images

## Deployment

This application is deployed on Netlify. You can view the live demo at [project-url].

## Future Enhancements

- Add support for more file formats
- Implement theme customization
- Add ability to download generated images
- Include more advanced prompting options

## License

MIT
