import React, { useReducer, useState, useEffect } from 'react';
import { useMediaQuery, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch } from 'react-redux';
import { fetchDevices } from '../redux/slices/deviceSlice.js';

import ServiceDataSection from '../components/Services/ServiceDataSection';
import AttachmentUploadSection from '../components/Services/AttachmentUploadSection';
import FormActions from '../components/Services/FormActions';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_DATE':
      return { ...state, date: action.value };
    case 'SET_ATTACHMENT':
      return { ...state, attachment: action.value };
    case 'RESET_FORM':
      return {
        deviceId: '',
        facility: '',
        date: null,
        engineer: '',
        purpose: '',
        notes: '',
        attachment: '',
        isFunctional: '',
      };
    default:
      return state;
  }
};

const Services = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const [form, formDispatch] = useReducer(formReducer, {
    deviceId: '',
    facility: '',
    date: null,
    engineer: '',
    purpose: '',
    notes: '',
    attachment: '',
    isFunctional: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box maxWidth="600px" mx="auto" px={isMobile ? 1 : 3} py={4} pb={10}>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          className="card-white-text-dark"
        >
          New Service Visit
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Service Visits / Log Visit
        </Typography>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Log Field Visit
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Record details of your visit to a facility.
        </Typography>

        {/* Form Sections */}
        <ServiceDataSection form={form} formDispatch={formDispatch} />
        <AttachmentUploadSection form={form} formDispatch={formDispatch} />
        <FormActions
          form={form}
          formDispatch={formDispatch}
          setSnackbar={setSnackbar}
        />

        {/* Snackbar moved here from FormActions */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Services;
