import React from 'react';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addService } from '../../redux/slices/serviceSlice.js';
import { updateDevice, fetchDevices } from '../../redux/slices/deviceSlice.js';
import dayjs from 'dayjs';

const FormActions = ({ form, formDispatch, setSnackbar }) => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.data);

  const handleSubmit = async () => {
    const { deviceId, facility, date, engineer, purpose, isFunctional } = form;

    // Validation
    if (!deviceId || !facility || !date || !engineer || !purpose) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields.',
        severity: 'error',
      });
      return;
    }

    if (purpose === 'Breakdown' && !isFunctional) {
      setSnackbar({
        open: true,
        message: 'Please specify if the device is functional.',
        severity: 'error',
      });
      return;
    }

    const formattedDate = dayjs(form.date).format('YYYY-MM-DD');
    const payload = { ...form, date: formattedDate };

    try {
      // Add Service
      await dispatch(addService(payload)).unwrap();

      // Update Device Info
      const device = devices.find((d) => d.id === deviceId);
      if (device) {
        const updatedDevice = {
          ...device,
          lastServiceDate: formattedDate,
        };

        if (purpose === 'Preventive') {
          updatedDevice.status = 'Online';
        } else if (purpose === 'Breakdown') {
          updatedDevice.status = isFunctional === 'Yes' ? 'Online' : 'Offline';
        } else if (purpose === 'Maintenance') {
          updatedDevice.status = 'Maintenance';
        }

        try {
          await dispatch(updateDevice({ id: deviceId, data: updatedDevice })).unwrap();
          dispatch(fetchDevices());
        } catch (deviceError) {
          console.error('Device update failed:', deviceError);
          setSnackbar({
            open: true,
            message: 'Service logged, but device update failed.',
            severity: 'warning',
          });
        }
      }

      // Success
      setSnackbar({
        open: true,
        message: 'Service visit logged successfully!',
        severity: 'success',
      });

      // Reset form
      formDispatch({ type: 'RESET_FORM' });
    } catch (error) {
      console.error('Add service failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to log service visit.',
        severity: 'error',
      });
    }
  };

  return (
    <Box mt={4} display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        sx={{
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: 3,
          transition: 'background 0.3s',
        }}
      >
        Save Visit
      </Button>
    </Box>
  );
};

export default FormActions;
