import React from 'react';
import { Box, Chip, styled } from '@mui/material';

const categories = [
  'For You',
  'Premium',
  'Bigg Boss',

  'MTV Hustle 4',
  'Cricket',
  'AUS vs IND',
  'Kids & Family',
  'FREE Anime',
  'ISL',
  'Reality',
  'Studios',
  'TATA IPL',

];

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&.MuiChip-clickable': {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
}));

function CategoryTabs() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        p: 2,
        backgroundColor: '#0f0617',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'fixed',
        width: '100%',
        top: 64, // Height of navbar
        zIndex: 1000,
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {categories.map((category) => (
        <StyledChip
          key={category}
          label={category}
          onClick={() => {}}
          clickable
        />
      ))}
    </Box>
  );
}

export default CategoryTabs;
