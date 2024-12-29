import React from 'react';
import { Card, CardMedia, Box, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function VideoCard({ video }) {
  const navigate = useNavigate();

  if (!video) {
    return null;
  }

  const handleClick = () => {
    navigate(`/video/${video.id}`, { 
      state: { video } 
    });
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        position: 'relative',
        backgroundColor: 'transparent',
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          '& .play-button': {
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '& .content-info': {
            transform: 'translateY(0)',
            opacity: 1,
          },
          '& img': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <CardMedia
        component="img"
        image={video.thumbnailUrl}
        alt={video.title}
        sx={{
          aspectRatio: '16/9',
          transition: 'transform 0.3s ease',
        }}
      />

      {video.isPremium && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#FFD700',
            borderRadius: '50%',
            width: 24,
            height: 24,
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
              fontSize: '10px',
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
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <PlayArrowIcon sx={{ color: 'white', fontSize: 32 }} />
        </IconButton>
      </Box>

      <Box
        className="content-info"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
          padding: 1.5,
          transform: 'translateY(10px)',
          opacity: 0.8,
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {video.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.8rem',
            lineHeight: 1.4,
          }}
        >
          {video.description}
        </Typography>
      </Box>
    </Card>
  );
}

export default VideoCard;
