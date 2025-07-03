import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices } from '../../redux/slices/deviceSlice';

// Helper to set color of status chip
const getStatusColor = (status) => {
  switch (status) {
    case 'Online':
      return 'success';
    case 'Offline':
      return 'error';
    case 'Maintenance':
      return 'warning';
    default:
      return 'default';
  }
};

// Helper to set color for AMC/CMC status chip
const getAMCColor = (status) => {
  if (status === 'Active') return 'success';
  if (status === 'Inactive') return 'error'; // Make inactive red for visibility
  return 'default';
};

const DeviceTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Check if the screen is small (mobile view)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get device data and loading state from Redux store
  const { data: devices, loading } = useSelector((state) => state.devices);

  // Fetch device list when component loads
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  // Show a loading bar while data is loading
  if (loading) return <LinearProgress sx={{ mt: 4 }} />;

  return (
    <Box
      sx={{
        // Full width on mobile, 90% on desktop
        width: isMobile ? '160%' : '90%',

        // No extra spacing on mobile, margin on desktop
        ml: isMobile ? '-60px' : '180px',
        mr: isMobile ? 0 : '240px',
        pb: 3, // Padding at bottom
        backgroundColor: 'transparent',
      }}
    >
      {/* Title */}
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        gutterBottom
        fontWeight="bold"
        sx={{
          textAlign: 'center',
          mb: isMobile ? 1 : 2,
          px: isMobile ? 2 : 0, // Padding only on mobile
          color: 'var(--text-color)',
        }}
      >
        Device Inventory
      </Typography>

      {/* Table wrapper with scroll for small screens */}
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          overflowX: 'auto', // allow horizontal scroll if needed
          borderRadius: isMobile ? 0 : 2, // remove border curve on mobile
          boxShadow: isMobile ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        {/* Actual table */}
        <Table
          size={isMobile ? 'small' : 'medium'}
          sx={{
            minWidth: 650, // ensure table has some base width
            backgroundColor: 'var(--card-bg)',
          }}
        >
          {/* Table header */}
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--bg-color)' }}>
              {/* Column titles */}
              <TableCell sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem', color: 'var(--text-color)' }}>
                Device Type
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem', color: 'var(--text-color)' }}>
                Device ID
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem', color: 'var(--text-color)' }}>
                Facility
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem', color: 'var(--text-color)' }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem', color: 'var(--text-color)' }}>
                Battery %
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem', color: 'var(--text-color)' }}>
                Last Service/Install
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.9rem', color: 'var(--text-color)' }}>
                AMC/CMC Status
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table body - dynamic rows from device data */}
          <TableBody>
            {devices.map((device) => (
              <TableRow
                key={device.id}
                sx={{ '&:hover': { backgroundColor: 'var(--card-bg)' } }} // highlight row on hover
              >
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem', color: 'var(--text-color)' }}>
                  {device.type}
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem', color: 'var(--text-color)' }}>
                  {device.id}
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem', color: 'var(--text-color)' }}>
                  {device.facility}
                </TableCell>

                {/* Status chip */}
                <TableCell>
                  <Chip
                    label={device.status}
                    color={getStatusColor(device.status)}
                    size="small"
                    sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                  />
                </TableCell>

                {/* Battery percentage with progress bar */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress
                      variant="determinate"
                      value={device.battery}
                      sx={{
                        width: isMobile ? 40 : 60,
                        height: 6,
                        borderRadius: 5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem', color: 'var(--text-color)' }}
                    >
                      {device.battery}%
                    </Typography>
                  </Box>
                </TableCell>

                {/* Last service/install date */}
                <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem', color: 'var(--text-color)' }}>
                  {device.lastServiceDate}
                </TableCell>

                {/* AMC/CMC chip */}
                <TableCell>
                  <Chip
                    label={device.amcStatus}
                    color={getAMCColor(device.amcStatus)}
                    size="small"
                    sx={{
                      fontSize: isMobile ? '0.65rem' : '0.75rem',
                      bgcolor: device.amcStatus === 'Inactive' ? '#ffebee' : undefined,
                      color: device.amcStatus === 'Inactive' ? '#d32f2f' : undefined,
                      border: device.amcStatus === 'Inactive' ? '1px solid #d32f2f' : undefined,
                      fontWeight: device.amcStatus === 'Inactive' ? 700 : undefined,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeviceTable;
