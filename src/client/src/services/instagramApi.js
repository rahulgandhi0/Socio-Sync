import axios from 'axios';

const api = axios.create({
  baseURL: '/api/instagram'
});

// Create single image post
export const createSingleImagePost = async (image, caption, userTags, locationId, collaborators) => {
  const response = await api.post('/media/single', {
    image_url: image.link,
    caption,
    user_tags: userTags,
    location_id: locationId,
    collaborators
  });
  return response.data.id;
};

// Create carousel container
export const createCarouselContainer = async (params) => {
  const { containerIds, caption, userTags, locationId, collaborators } = params;
  
  // Validate number of images for carousel
  if (containerIds.length < 2 || containerIds.length > 10) {
    throw new Error('Carousel must have between 2 and 10 images');
  }
  
  const response = await api.post('/media/carousel', {
    children: containerIds,
    caption,
    user_tags: userTags,
    location_id: locationId,
    collaborators
  });
  
  return response.data.id;
};

// Create carousel item container
export const createCarouselItem = async (image) => {
  const response = await api.post('/media/carousel-item', {
    image_url: image.link
  });
  return response.data.id;
};

// Publish media
export const publishMedia = async (containerId) => {
  const response = await api.post('/media_publish', {
    creation_id: containerId
  });
  return response.data;
};

// Search for locations (using Facebook Pages Search API)
export const searchLocations = async (query) => {
  const response = await api.get('/locations/search', {
    params: { query }
  });
  return response.data;
};

// Check publishing status
export const checkPublishingStatus = async (containerId) => {
  const response = await api.get(`/media/${containerId}`, {
    params: {
      fields: 'status_code,status'
    }
  });
  return response.data;
};

// Prepare Instagram post (handles the entire flow)
export const prepareInstagramPost = async (params) => {
  const { images, caption, userTags, locationId, collaborators } = params;
  
  try {
    // Validate number of images
    if (images.length < 1 || images.length > 10) {
      throw new Error('You must select between 1 and 10 images');
    }

    let containerId;
    
    // For single image posts
    if (images.length === 1) {
      containerId = await createSingleImagePost(
        images[0],
        caption,
        userTags,
        locationId,
        collaborators
      );
    } else {
      // For carousel posts (2 or more images)
      const containerIds = await Promise.all(
        images.map(image => createCarouselItem(image))
      );
      
      containerId = await createCarouselContainer({
        containerIds,
        caption,
        userTags,
        locationId,
        collaborators
      });
    }
    
    // Publish the media
    const publishResult = await publishMedia(containerId);
    
    // Check the publishing status
    const status = await checkPublishingStatus(containerId);
    
    return {
      containerId,
      status: status.status_code,
      message: status.status,
      publishResult
    };
  } catch (error) {
    console.error('Error preparing Instagram post:', error);
    throw error;
  }
}; 