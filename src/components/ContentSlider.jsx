import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, Card, CardMedia, useMediaQuery, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getFeaturedVideos } from '../services/videoService';

function ContentSlider() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFeaturedVideos();
        setFeaturedContent(response.data);
      } catch (error) {
        console.error('Error fetching featured content:', error);
        setError(error.response?.data?.message || 'Failed to load featured content');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  const handlePrevSlide = useCallback((e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? featuredContent.length - 1 : prev - 1));
  }, [featuredContent.length]);

  const handleNextSlide = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev === featuredContent.length - 1 ? 0 : prev + 1));
  }, [featuredContent.length]);

  const handleVideoClick = (content) => {
    navigate(`/video/${content.id}`, { 
      state: { video: content } 
    });
  };

  useEffect(() => {
    let slideInterval;
    if (isPlaying && featuredContent.length > 0) {
      slideInterval = setInterval(() => handleNextSlide(), 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isPlaying, handleNextSlide, featuredContent.length]);

  if (loading) {
    return (
      <Box
        sx={{
          height: { 
            xs: 'calc(100vh - 56px)',
            sm: '400px',
            md: '600px' 
          },
          mt: { 
            xs: 7,
            sm: 8,
            md: 9 
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0617',
        }}
      >
        <Typography color="white">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: { 
            xs: 'calc(100vh - 56px)',
            sm: '400px',
            md: '600px' 
          },
          mt: { 
            xs: 7,
            sm: 8,
            md: 9 
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0617',
          gap: 2,
          px: 2,
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 48, color: 'white' }} />
        <Typography color="white" variant="h6">
          {error}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (featuredContent.length === 0) {
    return (
      <Box
        sx={{
          height: { 
            xs: 'calc(100vh - 56px)',
            sm: '400px',
            md: '600px' 
          },
          mt: { 
            xs: 7,
            sm: 8,
            md: 9 
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0617',
          gap: 2,
        }}
      >
        <Typography color="white" variant="h6">
          No featured content available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { 
          xs: 'calc(100vh - 56px)',
          sm: '400px',
          md: '600px' 
        },
        mt: { 
          xs: 7,
          sm: 8,
          md: 9 
        },
        overflow: 'hidden',
        backgroundColor: '#0f0617',
      }}
      onMouseEnter={() => {
        setIsPlaying(false);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        setIsPlaying(true);
        setShowControls(false);
      }}
      onTouchStart={() => setShowControls(true)}
      onTouchEnd={() => setTimeout(() => setShowControls(false), 3000)}
    >
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          transform: `translateX(-${currentSlide * 100}%)`,
          height: '100%',
        }}
      >
        {featuredContent.map((content) => (
          <Card
            key={content.id}
            onClick={() => handleVideoClick(content)}
            sx={{
              minWidth: '100%',
              height: '100%',
              position: 'relative',
              backgroundColor: 'transparent',
              borderRadius: 0,
              cursor: 'pointer',
              '&:hover': {
                '& .content-info': {
                  transform: 'translateY(0)',
                  opacity: 1,
                },
                '& .play-button': {
                  opacity: 1,
                  transform: 'translate(-50%, -50%) scale(1)',
                },
              },
            }}
          >
            <CardMedia
              component="img"
              image={content.thumbnailUrl}
              alt={content.title}
              sx={{
                height: '100%',
                objectFit: 'cover',
                objectPosition: isMobile ? 'center top' : 'center center',
              }}
            />
            
            {content.isPremium && (
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 8, sm: 12, md: 16 },
                  right: { xs: 8, sm: 12, md: 16 },
                  backgroundColor: '#FFD700',
                  borderRadius: '50%',
                  width: { xs: 24, sm: 28, md: 32 },
                  height: { xs: 24, sm: 28, md: 32 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <Typography
                  sx={{
                    color: '#000',
                    fontSize: { xs: '10px', sm: '11px', md: '12px' },
                    fontWeight: 'bold',
                  }}
                >
                  P
                </Typography>
              </Box>
            )}

            <Box
              className="play-button"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.9)',
                opacity: 0,
                transition: 'all 0.3s ease',
                zIndex: 2,
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleVideoClick(content);
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                  width: { xs: 56, sm: 64, md: 80 },
                  height: { xs: 56, sm: 64, md: 80 },
                }}
              >
                <PlayArrowIcon 
                  sx={{ 
                    fontSize: { xs: 40, sm: 48, md: 64 }, 
                    color: 'white',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }} 
                />
              </IconButton>
            </Box>

            <Box
              className="content-info"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)',
                p: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 0.5, sm: 1 },
                transform: isMobile ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobile ? 1 : 0.8,
                transition: 'all 0.3s ease',
              }}
            >
              <Typography 
                variant="h3" 
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: { 
                    xs: '1.25rem',
                    sm: '1.75rem',
                    md: '2.25rem' 
                  },
                  lineHeight: { xs: 1.2, sm: 1.3 },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  mb: { xs: 0.5, sm: 1 },
                }}
              >
                {content.title}
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: { 
                    xs: '0.75rem',
                    sm: '0.875rem',
                    md: '1rem' 
                  },
                  lineHeight: 1.4,
                }}
              >
                {content.description}
              </Typography>
            </Box>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              sx={{
                position: 'absolute',
                bottom: { xs: 12, sm: 16, md: 24 },
                right: { xs: 12, sm: 16, md: 24 },
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
                zIndex: 2,
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                opacity: showControls || isMobile ? 1 : 0,
                transition: 'all 0.3s ease',
              }}
            >
              {isMuted ? <VolumeOffIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <VolumeUpIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
            </IconButton>
          </Card>
        ))}
      </Box>

      {!isMobile && (
        <>
          <IconButton
            onClick={handlePrevSlide}
            sx={{
              position: 'absolute',
              left: { sm: 12, md: 20 },
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              width: { sm: 40, md: 48 },
              height: { sm: 40, md: 48 },
              zIndex: 2,
              opacity: showControls ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
          >
            <NavigateBeforeIcon sx={{ fontSize: { sm: 28, md: 32 } }} />
          </IconButton>

          <IconButton
            onClick={handleNextSlide}
            sx={{
              position: 'absolute',
              right: { sm: 12, md: 20 },
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              width: { sm: 40, md: 48 },
              height: { sm: 40, md: 48 },
              zIndex: 2,
              opacity: showControls ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
          >
            <NavigateNextIcon sx={{ fontSize: { sm: 28, md: 32 } }} />
          </IconButton>
        </>
      )}

      {isMobile && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {featuredContent.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ContentSlider;
