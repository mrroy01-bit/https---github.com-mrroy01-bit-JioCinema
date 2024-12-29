import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ContentSlider from '../components/ContentSlider';
import VideoCard from '../components/VideoCard';
import { getAllVideos } from '../services/videoService';

const contentSections = [
  {
    title: 'Trending Movies',
    type: 'movies',
  },
  {
    title: 'Popular TV Shows',
    type: 'shows',
  },
  {
    title: 'Latest Sports',
    type: 'sports',
  },
];

function HomePage() {
  const [videos, setVideos] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getAllVideos();
        // Group videos by type
        const groupedVideos = response.data.reduce((acc, video) => {
          if (!acc[video.type]) {
            acc[video.type] = [];
          }
          acc[video.type].push(video);
          return acc;
        }, {});
        setVideos(groupedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Box sx={{ backgroundColor: '#0f0617', minHeight: '100vh', pb: 4 }}>
      <ContentSlider />
      
      {contentSections.map((section) => (
        <Box key={section.type} sx={{ px: { xs: 2, sm: 4, md: 6 }, mt: 4 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              pl: 1
            }}
          >
            {section.title}
          </Typography>
          
          <Grid
            container
            spacing={2}
            sx={{
              overflowX: 'auto',
              flexWrap: 'nowrap',
              pb: 2,
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {videos[section.type]?.map((video) => (
              <Grid item key={video.id} sx={{ minWidth: 250 }}>
                <VideoCard video={video} />
              </Grid>
            )) || Array(6).fill(null).map((_, index) => (
              <Grid item key={index} sx={{ minWidth: 250 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 141,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export default HomePage;
