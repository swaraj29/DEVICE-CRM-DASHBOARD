import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
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

  // ✅ Listen to toggle from Topbar (via custom event)
  useEffect(() => {
    const toggleHandler = () => setMobileOpen(prev => !prev);
    window.addEventListener('toggleSidebar', toggleHandler);
    return () => window.removeEventListener('toggleSidebar', toggleHandler);
  }, []);

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
                location.pathname === path ? 'var(--card-bg)' : 'transparent',
              '&:hover': {
                backgroundColor: 'var(--card-bg)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'var(--text-color)', minWidth: 40 }}>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontSize: 14 }}
              sx={{ color: 'var(--text-color)' }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer
      anchor={isMobile ? 'right' : 'left'}
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={() => setMobileOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          backgroundColor: 'var(--appbar-bg)',
          color: 'var(--text-color)',
          borderRight: isMobile ? 'none' : '1px solid var(--border-color)',
          borderLeft: isMobile ? '1px solid var(--border-color)' : 'none',
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
