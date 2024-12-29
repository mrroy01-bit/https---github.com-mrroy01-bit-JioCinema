import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Box } from '@mui/material';

const QUALITY_LEVELS = {
  '1080p': 'Full HD',
  '720p': 'HD',
  '480p': 'SD',
  '360p': 'Low',
  'auto': 'Auto'
};

function VideoPlayer({ 
  url, 
  onTimeUpdate, 
  onDurationChange, 
  onPlayPause,
  onMute,
  isPlaying,
  isMuted,
  onFullscreenChange,
  onQualityLevelsChange,
  onCurrentQualityChange,
  currentQuality
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported() && url) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsRef.current = hls;
      // Store hls instance on video element for external access
      video.hlsInstance = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const levels = data.levels.map(level => ({
          height: level.height,
          bitrate: level.bitrate
        }));
        
        const availableQualities = levels.map(level => 
          `${level.height}p`
        ).filter(q => QUALITY_LEVELS[q]);

        if (!availableQualities.includes('auto')) {
          availableQualities.unshift('auto');
        }
        
        onQualityLevelsChange?.(availableQualities);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const newQuality = data.level === -1 
          ? 'auto'
          : `${hls.levels[data.level].height}p`;
        onCurrentQualityChange?.(newQuality);
      });

      return () => {
        video.hlsInstance = null;
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    }
  }, [url, onQualityLevelsChange, onCurrentQualityChange]);

  // Update quality when changed externally
  useEffect(() => {
    const hls = hlsRef.current;
    if (!hls) return;

    const levelIndex = currentQuality === 'auto' 
      ? -1 
      : hls.levels.findIndex(
          level => `${level.height}p` === currentQuality
        );

    if (levelIndex !== hls.currentLevel) {
      hls.currentLevel = levelIndex;
    }
  }, [currentQuality]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };

    const handleDurationChange = () => {
      onDurationChange?.(video.duration);
    };

    const handlePlay = () => {
      onPlayPause?.(true);
    };

    const handlePause = () => {
      onPlayPause?.(false);
    };

    const handleVolumeChange = () => {
      onMute?.(video.muted);
    };

    const handleFullscreenChange = () => {
      const isFullscreenNow = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      onFullscreenChange?.(isFullscreenNow);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [onTimeUpdate, onDurationChange, onPlayPause, onMute, onFullscreenChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
  }, [isMuted]);

  return (
    <Box 
      sx={{ 
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#000',
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        playsInline
        onClick={() => onPlayPause?.(!isPlaying)}
      />
    </Box>
  );
}

export default VideoPlayer;
