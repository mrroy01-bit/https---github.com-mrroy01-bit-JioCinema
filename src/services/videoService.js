// Mock video data
const mockVideos = [
  {
    id: 1,
    title: 'Vivian Calls Karan NAKLI!',
    description: 'S1BE85 · Reality · Hindi',
    thumbnailUrl: 'https://v3img.voot.com/resizeMedium,w_914,h_514/v3Storage/assets/vertical-tv-1735492048233.jpg',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    isPremium: true,
    duration: '1 hr 50 min',
    language: 'Hindi',
    genre: 'Reality',
    rating: 'U/A 16+',
    releaseDate: '29 Dec 2024'
  },
  {
    id: 2,
    title: 'AUS vs IND',
    description: 'Cricket · Live',
    thumbnailUrl: 'https://v3img.voot.com/resizeMedium,w_914,h_514/v3Storage/assets/day_4_aus_vs_ind_highlights_clean_ctv-1735467837549.jpg',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    isPremium: false,
    duration: 'Live',
    language: 'English',
    genre: 'Sports',
    rating: 'U',
    releaseDate: 'Live'
  },
  {
    id: 3,
    title: '007: Road to a Million',
    description: 'Action · English · U/A 16+',
    thumbnailUrl: 'https://v3img.voot.com/resizeMedium,w_914,h_514/v3Storage/assets/vertical-carousel-tv-1732258356328.jpg',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    isPremium: true,
    duration: '2 hr 30 min',
    language: 'English',
    genre: 'Action',
    rating: 'U/A 16+',
    releaseDate: '25 Dec 2024'
  }
];

// Get all videos
export const getAllVideos = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockVideos });
    }, 500);
  });
};

// Get video by ID
export const getVideoById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const video = mockVideos.find(v => v.id === parseInt(id));
      if (video) {
        resolve({ data: video });
      } else {
        reject({ response: { data: { message: 'Video not found' } } });
      }
    }, 500);
  });
};

// Get featured videos
export const getFeaturedVideos = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockVideos });
    }, 500);
  });
};

// Search videos
export const searchVideos = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredVideos = mockVideos.filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve({ data: filteredVideos });
    }, 500);
  });
};
