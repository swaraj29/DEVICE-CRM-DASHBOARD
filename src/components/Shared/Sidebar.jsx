import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

const drawerWidth = 240;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Installations', icon: <BuildIcon />, path: '/installations' },
  { label: 'Services', icon: <MiscellaneousServicesIcon />, path: '/services' },
  { label: 'Contracts', icon: <AssignmentIcon />, path: '/contracts' },
  { label: 'Alerts', icon: <NotificationsActiveIcon />, path: '/alerts' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <List sx={{ mt: 8 }}>
      {menuItems.map(({ label, icon, path }) => (
        <ListItem key={label} disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              mx: 1,
              borderRadius: '999px',
              backgroundColor:
                location.pathname === path ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#121212', minWidth: 40 }}>{icon}</ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      {/* ✅ Hamburger Icon (Mobile only, aligned right) */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 12,
            right: 40, // changed from left to right
            zIndex: (theme) => theme.zIndex.drawer + 2,
            backgroundColor: '#ffffff',
            border: '1px solid #cccccc',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            width: 40,
            height: 40,
          }}
        >
          <MenuIcon sx={{ color: '#121212' }} />
        </IconButton>
      )}

      {/* ✅ Sidebar Drawer */}
      <Drawer
        anchor={isMobile ? 'right' : 'left'} // open from right on mobile
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#ffffff',
            color: '#121212',
            borderRight: isMobile ? 'none' : '1px solid #000000',
            borderLeft: isMobile ? '1px solid #000000' : 'none',
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
