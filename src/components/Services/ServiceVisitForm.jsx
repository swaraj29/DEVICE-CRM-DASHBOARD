import React, { useReducer, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  FormControl,
  Select,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { addService } from '../../redux/slices/serviceSlice';
import { updateDevice, fetchDevices } from '../../redux/slices/deviceSlice';

// Styled components use only CSS variables for theme support
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed var(--border-color, #d1d5db)`,
  padding: theme.spacing(6),
  borderRadius: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: 'var(--card-bg, #fafafa)',
  marginTop: theme.spacing(1),
  color: 'var(--text-color, #666)',
  minHeight: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledTextField = styled(TextField)(() => ({
  // All color/background handled by global CSS and .card-white-text-dark
}));

const StyledFormControl = styled(FormControl)(() => ({
  // All color/background handled by global CSS and .card-white-text-dark
}));

const SaveButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  transition: 'box-shadow 0.35s cubic-bezier(.4,0,.2,1)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
  },
}));

const engineers = ['John Doe', 'Alice Smith', 'Ravi Kumar'];
const purposes = ['Preventive', 'Breakdown', 'Maintenance'];
const conditions = ['Yes', 'No'];

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

const ServiceVisitForm = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.data);

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

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    formDispatch({ type: 'SET_FIELD', field, value });

    if (field === 'deviceId') {
      const selectedDevice = devices.find((d) => d.id === value);
      if (selectedDevice) {
        formDispatch({
          type: 'SET_FIELD',
          field: 'facility',
          value: selectedDevice.facility,
        });
      }
    }
  };

  const handleDateChange = (newValue) => {
    formDispatch({ type: 'SET_DATE', value: newValue });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      formDispatch({ type: 'SET_ATTACHMENT', value: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const { deviceId, facility, date, engineer, purpose, isFunctional } = form;
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
      await dispatch(addService(payload)).unwrap();
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
        await dispatch(updateDevice({ id: deviceId, data: updatedDevice })).unwrap();
        dispatch(fetchDevices());
      }
      setSnackbar({
        open: true,
        message: 'Service visit logged and device updated!',
        severity: 'success',
      });
      formDispatch({ type: 'RESET_FORM' });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Failed to log visit or update device.',
        severity: 'error',
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box maxWidth="600px" mx="auto" px={3} pt={4} pb={12} className="card-white-text-dark">
        <Typography variant="body2" color="text.secondary" mb={2}>
          Service Visits / Log Visit
        </Typography>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Log Field Visit
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Record details of your visit to a facility.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Device ID */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              Device ID
            </Typography>
            <StyledFormControl fullWidth className="card-white-text-dark">
              <Select
                value={form.deviceId}
                onChange={handleChange('deviceId')}
                displayEmpty
                sx={{ minHeight: '56px' }}
                MenuProps={{
                  PaperProps: {
                    className: 'card-white-text-dark',
                  },
                }}
              >
                <MenuItem value="" disabled className="card-white-text-dark">
                  Select device
                </MenuItem>
                {devices.map((d) => (
                  <MenuItem key={d.id} value={d.id} className="card-white-text-dark">
                    {d.id} — {d.type}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Box>

          {/* Facility - ReadOnly */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              Facility
            </Typography>
            <StyledTextField
              className="card-white-text-dark"
              fullWidth
              value={form.facility}
              placeholder="Facility auto-filled"
              InputProps={{ readOnly: true }}
            />
          </Box>

          {/* Date */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              Date
            </Typography>
            <DatePicker
              value={form.date}
              onChange={handleDateChange}
              renderInput={(params) => <StyledTextField className="card-white-text-dark" fullWidth {...params} />}
            />
          </Box>

          {/* Engineer */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              Responsible Engineer
            </Typography>
            <StyledFormControl fullWidth className="card-white-text-dark">
              <Select
                value={form.engineer}
                onChange={handleChange('engineer')}
                displayEmpty
                sx={{ minHeight: '56px' }}
                MenuProps={{
                  PaperProps: {
                    className: 'card-white-text-dark',
                  },
                }}
              >
                <MenuItem value="" disabled className="card-white-text-dark">
                  Select engineer
                </MenuItem>
                {engineers.map((e) => (
                  <MenuItem key={e} value={e} className="card-white-text-dark">
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Box>

          {/* Purpose */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              Purpose of Visit
            </Typography>
            <StyledFormControl fullWidth className="card-white-text-dark">
              <Select
                value={form.purpose}
                onChange={handleChange('purpose')}
                displayEmpty
                sx={{ minHeight: '56px' }}
                MenuProps={{
                  PaperProps: {
                    className: 'card-white-text-dark',
                  },
                }}
              >
                <MenuItem value="" disabled className="card-white-text-dark">
                  Select purpose
                </MenuItem>
                {purposes.map((p) => (
                  <MenuItem key={p} value={p} className="card-white-text-dark">
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Box>

          {/* Functional Status */}
          {form.purpose === 'Breakdown' && (
            <Box>
              <Typography variant="subtitle1" fontWeight="600" mb={1}>
                Is Device Functional?
              </Typography>
              <StyledFormControl fullWidth className="card-white-text-dark">
                <Select
                  value={form.isFunctional}
                  onChange={handleChange('isFunctional')}
                  displayEmpty
                  sx={{ minHeight: '56px' }}
                  MenuProps={{
                    PaperProps: {
                      className: 'card-white-text-dark',
                    },
                  }}
                >
                  <MenuItem value="" disabled className="card-white-text-dark">
                    Select condition
                  </MenuItem>
                  {conditions.map((c) => (
                    <MenuItem key={c} value={c} className="card-white-text-dark">
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Box>
          )}

          {/* Notes */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              Notes
            </Typography>
            <StyledTextField
              className="card-white-text-dark"
              fullWidth
              multiline
              rows={4}
              placeholder="Enter notes about the visit"
              value={form.notes}
              onChange={handleChange('notes')}
            />
          </Box>

          {/* Attachment */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              Attachments
            </Typography>
            <UploadBox className="card-white-text-dark">
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Drag and drop files here
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Or click to browse your files
              </Typography>
              <input
                type="file"
                onChange={handleUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
              {form.attachment && (
                <Typography variant="body2" mt={1} color="success.main">
                  ✓ File selected
                </Typography>
              )}
            </UploadBox>
          </Box>
        </Box>

        {/* Save Visit button moved to the bottom of the form, not fixed */}
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

export default ServiceVisitForm;
