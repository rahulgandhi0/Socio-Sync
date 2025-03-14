const { OpenAI } = require('openai');

// Using the environment variable for OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock captions for different event types
const MOCK_EVENT_CAPTIONS = [
  "🔥 Don't miss out on {EVENT_TITLE}! Mark your calendars for {EVENT_DATE} and get ready for an unforgettable experience at {EVENT_VENUE}. Tickets selling fast! #MustAttend #EventOfTheYear",
  "✨ Join us for {EVENT_TITLE} on {EVENT_DATE} at {EVENT_VENUE}! Tag a friend you'd bring along to this amazing night of entertainment and fun. Limited spots available! #ExcitingEvent #GetYourTickets",
  "🎉 The countdown begins for {EVENT_TITLE}! This is your chance to be part of something special on {EVENT_DATE} in {EVENT_CITY}. Early bird tickets available now! #SaveTheDate #CantWait",
  "🚀 Ready for the experience of a lifetime? {EVENT_TITLE} is going to be epic! Secure your spot today for {EVENT_DATE} at {EVENT_VENUE}. #DontMissOut #BookNow",
  "⭐ The most anticipated event of the year is here! {EVENT_TITLE} at {EVENT_VENUE} on {EVENT_DATE}. Get your tickets before they're gone. #HotTickets #MustSee"
];

// Mock captions for different image types
const MOCK_IMAGE_CAPTIONS = [
  "✨ Capturing moments that last a lifetime at {IMAGE_TITLE}. What's your favorite memory from an event like this? #PerfectMoment #EventMagic",
  "🔥 When the vibes are just right at {IMAGE_TITLE}! Tag someone you'd bring to this amazing experience. #GoodVibesOnly #EventLife",
  "💫 Some experiences are worth every penny. {IMAGE_TITLE} is definitely one of them! #BucketList #MustExperience",
  "📸 Picture perfect moments from {IMAGE_TITLE}. Double tap if you wish you were here! #EventGoals #InstaWorthy",
  "🎭 Behind every great event is an even greater story. What would yours be at {IMAGE_TITLE}? #EventStories #MemoriesMade"
];

/**
 * Generate a mock caption based on event or image type
 * @param {string} type - Type of caption to generate ('event' or 'image')
 * @param {Object} data - Event details or image information
 * @returns {string} - Generated mock caption
 */
function generateMockCaption(type = 'event', data = {}) {
  const captions = type === 'event' ? MOCK_EVENT_CAPTIONS : MOCK_IMAGE_CAPTIONS;
  const randomIndex = Math.floor(Math.random() * captions.length);
  let caption = captions[randomIndex];
  
  if (type === 'event') {
    const { title, startDate, venue } = data;
    
    // Format the date if available
    let formattedDate = 'soon';
    if (startDate) {
      try {
        const date = new Date(startDate);
        formattedDate = date.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        });
      } catch (e) {
        formattedDate = startDate;
      }
    }
    
    // Replace placeholders with actual data
    caption = caption.replace(/{EVENT_TITLE}/g, title || 'this amazing event');
    caption = caption.replace(/{EVENT_DATE}/g, formattedDate);
    caption = caption.replace(/{EVENT_VENUE}/g, venue?.name || 'the venue');
    caption = caption.replace(/{EVENT_CITY}/g, venue?.city || 'the city');
    
  } else if (type === 'image') {
    const { title } = data;
    caption = caption.replace(/{IMAGE_TITLE}/g, title || 'this amazing event');
  }
  
  return caption;
}

/**
 * Generate a social media caption based on event details or image
 * @param {Object} data - Event details or image information
 * @param {string} type - Type of caption to generate ('event' or 'image')
 * @returns {Promise<string>} - Generated caption
 */
async function generateCaption(data, type = 'event') {
  try {
    let prompt;
    
    if (type === 'event') {
      const { title, description, startDate, venue } = data;
      prompt = `Generate an engaging and creative social media caption for the following event:
      
Event Title: ${title}
Event Description: ${description || 'Not provided'}
Event Date: ${startDate}
Event Location: ${venue?.name || 'Not provided'}, ${venue?.city || 'Not provided'}

The caption should be attention-grabbing, include relevant hashtags, and encourage people to attend the event. Keep it under 280 characters.`;
    } else if (type === 'image') {
      const { title, context } = data;
      prompt = `Generate an engaging and creative social media caption for an image related to:
      
Image Title: ${title}
Image Context: ${context || 'Not provided'}

The caption should be attention-grabbing, include relevant hashtags, and be suitable for Instagram or Twitter. Keep it under 280 characters.`;
    } else {
      throw new Error('Invalid caption type');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a social media expert who creates engaging captions for events and images. Your captions are creative, concise, and optimized for engagement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });
      
      return response.choices[0].message.content.trim();
    } catch (apiError) {
      console.error('OpenAI API error, using mock caption instead:', apiError);
      
      // Use mock caption as fallback with event details
      return generateMockCaption(type, data);
    }
  } catch (error) {
    console.error('Error generating caption with GPT:', error);
    
    // Use mock caption as final fallback
    return generateMockCaption(type, data);
  }
}

module.exports = {
  generateCaption
}; 