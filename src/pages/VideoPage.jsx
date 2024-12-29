import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, IconButton, useTheme, useMediaQuery, Button, Grid, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SettingsIcon from '@mui/icons-material/Settings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';
import { getVideoById, getAllVideos } from '../services/videoService';
import CheckIcon from '@mui/icons-material/Check';

const QUALITY_LEVELS = {
  '1080p': 'Full HD',
  '720p': 'HD',
  '480p': 'SD',
  'auto': 'Auto',
};

function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('episodes');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qualityMenu, setQualityMenu] = useState(null);
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState('auto');

  const handleQualityChange = (quality) => {
    setCurrentQuality(quality);
    setQualityMenu(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch current video
        const videoResponse = await getVideoById(parseInt(id));
        setVideo(videoResponse.data);
        
        // Fetch related videos
        const allVideosResponse = await getAllVideos();
        const filtered = allVideosResponse.data
          .filter(v => v.id !== parseInt(id))
          .filter(v => v.genre === videoResponse.data.genre || v.language === videoResponse.data.language);
        setRelatedVideos(filtered);
      } catch (error) {
        console.error('Error fetching video:', error);
        setError(error.response?.data?.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `-${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href
      }).catch(console.error);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0617',
          flexDirection: 'column',
          gap: 2,
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
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0617',
          flexDirection: 'column',
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
          onClick={() => navigate('/')}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
            mt: 2,
          }}
        >
          Go Back Home
        </Button>
      </Box>
    );
  }

  if (!video) {
    return (
      <Box 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0617',
          flexDirection: 'column',
          gap: 2,
          px: 2,
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 48, color: 'white' }} />
        <Typography color="white" variant="h6">
          Video not found
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
            mt: 2,
          }}
        >
          Go Back Home
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: '#0f0617',
        pt: { xs: 7, sm: 8, md: 9 },
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          backgroundColor: '#000',
          aspectRatio: '16/9',
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 16 },
            left: { xs: 8, sm: 16 },
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 2,
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <VideoPlayer 
          url={video.url}
          onTimeUpdate={setCurrentTime}
          onDurationChange={setDuration}
          onPlayPause={setIsPlaying}
          onMute={setIsMuted}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onFullscreenChange={setIsFullscreen}
          onQualityLevelsChange={setQualities}
          onCurrentQualityChange={setCurrentQuality}
          currentQuality={currentQuality}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': {
                height: 6,
              },
            }}
          >
            <Box
              sx={{
                width: `${(currentTime / duration) * 100}%`,
                height: '100%',
                backgroundColor: '#ff0000',
                borderRadius: 2,
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setIsPlaying(!isPlaying)}
                sx={{ color: 'white' }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton
                onClick={() => {
                  const video = document.querySelector('video');
                  if (video) video.currentTime = 0;
                }}
                sx={{ color: 'white' }}
              >
                <RestartAltIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsMuted(!isMuted)}
                sx={{ color: 'white' }}
              >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {formatTime(duration - currentTime)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                onClick={(e) => setQualityMenu(e.currentTarget)}
                sx={{ color: 'white' }}
              >
                <SettingsIcon />
              </IconButton>
              <IconButton 
                onClick={() => {
                  const video = document.querySelector('video');
                  if (!video) return;
                  
                  if (!isFullscreen) {
                    if (video.requestFullscreen) {
                      video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                      video.webkitRequestFullscreen();
                    }
                  } else {
                    if (document.exitFullscreen) {
                      document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                      document.webkitExitFullscreen();
                    }
                  }
                }}
                sx={{ color: 'white' }}
              >
                <FullscreenIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={qualityMenu}
        open={Boolean(qualityMenu)}
        onClose={() => setQualityMenu(null)}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        <MenuItem disabled sx={{ opacity: 0.7 }}>
          <Typography variant="body2">Quality</Typography>
        </MenuItem>
        {qualities.map((quality) => (
          <MenuItem
            key={quality}
            onClick={() => handleQualityChange(quality)}
            selected={currentQuality === quality}
            sx={{
              fontSize: '0.9rem',
              minWidth: 120,
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Typography sx={{ flexGrow: 1 }}>
                {QUALITY_LEVELS[quality] || quality}
              </Typography>
              {currentQuality === quality && (
                <CheckIcon sx={{ ml: 1, fontSize: 18 }} />
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>

      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 'bold',
                mb: { xs: 1, sm: 2 },
              }}
            >
              {video.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mb: 1,
              }}
            >
              {video.releaseDate} • {video.duration} • {video.language} • {video.genre} • {video.rating}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              WatchList
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Share
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="text"
            onClick={() => setActiveTab('episodes')}
            sx={{
              color: activeTab === 'episodes' ? 'white' : 'rgba(255,255,255,0.7)',
              fontSize: '1.1rem',
              borderBottom: activeTab === 'episodes' ? '2px solid #ff0000' : 'none',
              borderRadius: 0,
              px: 0,
              mr: 2,
            }}
          >
            Episodes
          </Button>
          <Button
            variant="text"
            onClick={() => setActiveTab('more')}
            sx={{
              color: activeTab === 'more' ? 'white' : 'rgba(255,255,255,0.7)',
              fontSize: '1.1rem',
              borderBottom: activeTab === 'more' ? '2px solid #ff0000' : 'none',
              borderRadius: 0,
              px: 0,
            }}
          >
            More Like This
          </Button>
        </Box>

        {activeTab === 'episodes' && (
          <Typography 
            variant="body1" 
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mb: { xs: 2, sm: 3 },
              maxWidth: '800px',
            }}
          >
            {video.description}
          </Typography>
        )}

        {activeTab === 'more' && (
          <Grid container spacing={2}>
            {relatedVideos.map((relatedVideo) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={relatedVideo.id}>
                <VideoCard video={relatedVideo} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default VideoPage;
