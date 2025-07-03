import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import styles from './Topbar.module.scss';

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#121212',
        boxShadow: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '56px',
        justifyContent: 'center',
        borderBottom: '1px solid #000000',
      }}
    >
      <Toolbar className={styles.topbar}>
        {/* ✅ Left Side: Logo + Mobile-only Theme Icon */}
        <Box className={styles.left}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
            ✦ MediTrack
          </Typography>

          {/* ✅ Show Theme icon only on mobile */}
          <Box className={styles.mobileIcons}>
            <IconButton sx={{ color: '#121212' }}>
              <Brightness4Icon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* ✅ Right Side: Theme Icon + Avatar (desktop only) */}
        <Box className={styles.right}>
          <IconButton sx={{ color: '#121212' }}>
            <Brightness4Icon fontSize="small" />
          </IconButton>
          <Avatar
            alt="User"
            src="https://i.pravatar.cc/150?img=47"
            sx={{ width: 28, height: 28 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
