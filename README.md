# SocioSync

A full-stack web application that helps prepare social media content by:
1. Finding events from Eventbrite based on city, date range, and category
2. Fetching high-quality images from Google Images API
3. Generating social media captions using OpenAI's GPT

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   cd src/client
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   EVENTBRITE_API_KEY=your_eventbrite_api_key
   GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_api_key
   GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the development server:
   ```
   npm run dev:full
   ```

## API Keys Required

- Eventbrite API Key: [Eventbrite Developer Portal](https://www.eventbrite.com/platform/api)
- Google Custom Search API Key: [Google Cloud Console](https://console.cloud.google.com/)
- Google Custom Search Engine ID: [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
- OpenAI API Key: [OpenAI Platform](https://platform.openai.com/) 