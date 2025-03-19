# SocioSync

A full-stack web application that helps create engaging social media content by:
1. Finding events from Ticketmaster's extensive event database
2. Fetching high-quality images from Google Images API
3. Generating social media captions using pre-defined templates

## Features

- Search events by city, category, and date range
- Filter for top concerts and comedy shows
- Select and crop images for Instagram compatibility
- Generate engaging social media captions
- Responsive design for all devices

## Tech Stack

- Frontend: React.js
- Backend: Node.js & Express
- APIs: Ticketmaster API, Google Custom Search API

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm (v6 or higher)
- API keys from:
  - [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
  - [Google Cloud Console](https://console.cloud.google.com/)
  - [Google Programmable Search Engine](https://programmablesearchengine.google.com/)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SocioSync.git
   cd SocioSync
   ```

2. Install dependencies for both server and client:
   ```bash
   npm install
   cd src/client
   npm install
   cd ../..
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your API keys:
     ```
     PORT=3001
     TICKETMASTER_API_KEY=your_ticketmaster_api_key
     GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_api_key
     GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id
     ```

4. Start the development server:
   ```bash
   npm run dev:full
   ```
   This will start both the backend server (port 3001) and frontend client (port 3000).

## Production Deployment

1. Build the client:
   ```bash
   cd src/client
   npm run build
   ```

2. Set environment variables in your production environment
3. Start the server:
   ```bash
   npm start
   ```

## Security Notes

- Never commit your `.env` file or expose API keys
- The application uses environment variables for all sensitive data
- API keys are only used server-side for security
- Input validation is implemented for all API endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 