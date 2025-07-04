import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import { useTheme } from '@mui/material';
import styles from './Topbar.module.scss';

const Topbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    const event = new Event('toggleSidebar');
    window.dispatchEvent(event);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        backgroundColor: 'var(--appbar-bg)',
        color: 'var(--text-color)',
        boxShadow: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '56px',
        justifyContent: 'center',
        borderBottom: `1px solid var(--border-color)`,
      }}
    >
      <Toolbar className={styles.topbar}>
        {/* Left: Brand */}
        <Box className={styles.left}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
            ✦ MediTrack
          </Typography>
        </Box>

        {/* Right: Full icons */}
        <Box className={styles.right}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
              '&:hover': {
                background: 'rgba(255,255,255,0.18)',
              },
            }}
          >
            {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </IconButton>
          <Avatar
            alt="User"
            src="https://i.pravatar.cc/150?img=47"
            sx={{ width: 28, height: 28 }}
          />
        </Box>

        {/* Mobile: Theme toggle + Hamburger (right-aligned) */}
        {isMobile && (
          <Box className={styles.mobileIcons}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.18)',
                },
              }}
            >
              {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>

            <IconButton
              onClick={handleSidebarToggle}
              sx={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
              }}
            >
              <MenuIcon sx={{ color: 'var(--text-color)' }} />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
