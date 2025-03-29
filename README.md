# SocioSync

SocioSync is a web application that helps you create and manage social media content for events. It integrates with Ticketmaster for event discovery, Google Images for visual content, and Instagram for publishing.

## Features

- Search for events using Ticketmaster API
- Find and upload images for your posts
- Crop and adjust images for Instagram
- Generate engaging captions
- Publish directly to Instagram
- Support for both single images and carousels

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Instagram Business Account
- Google Custom Search API credentials
- Ticketmaster API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Port
PORT=3001

# Ticketmaster API
TICKETMASTER_API_KEY=your_api_key

# Google Custom Search
GOOGLE_CUSTOM_SEARCH_API_KEY=your_api_key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_engine_id

# Instagram API
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_USER_ID=your_user_id
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Socio-Sync.git
cd Socio-Sync
```

2. Install dependencies:
```bash
npm install
cd src/client
npm install
cd ../..
```

3. Start the development server:
```bash
# Start the backend server
npm start

# In a new terminal, start the client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Usage

1. Search for an event using the event search feature
2. Select or upload images for your post
3. Crop and adjust images as needed
4. Generate or write your caption
5. Preview and publish to Instagram

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/) 