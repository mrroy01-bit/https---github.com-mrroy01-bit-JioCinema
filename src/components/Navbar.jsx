import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, Button, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: '400px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  marginRight: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'transparent',
    opacity: 0.8,
  },
}));

function Navbar() {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#0f0617' }}>
      <Toolbar>
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            JioCinema
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{
              ml: 1,
              color: '#FFD700',
              borderColor: '#FFD700',
              borderRadius: '20px',
              textTransform: 'none',
              height: '24px',
            }}
          >
            Upgrade
          </Button>
        </Box>

        <Box sx={{ display: 'flex', ml: 4 }}>
          <NavButton>Home</NavButton>
          <NavButton>Sports</NavButton>
          <NavButton>Movies</NavButton>
          <NavButton>TV Shows</NavButton>
          <NavButton endIcon={<KeyboardArrowDownIcon />}>More</NavButton>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Movies, Shows and more"
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'white' }}>
            <MicIcon />
          </IconButton>
        </Search>

        <IconButton sx={{ ml: 2, color: 'white' }}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
