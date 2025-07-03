import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
  useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled, useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { addInstallation } from '../../redux/slices/installationSlice';
import { updateDevice } from '../../redux/slices/deviceSlice';

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #d1d5db',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: '#f1f5f9',
  color: '#1e293b',
}));

const checklistItems = [
  'Verify device functionality',
  'Confirm network connectivity',
  'Calibrate device settings',
];

const facilities = ['Apollo Hospital', 'AIIMS', 'Fortis', 'Medanta'];

const InstallationForm = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    serialNumber: '',
    facility: '',
    installDate: null,
    installedBy: '',
    checklist: [],
    trainer: '',
    trainees: '',
    trainingDate: null,
    notes: '',
    image: '',
  });

  const [completion, setCompletion] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleChecklistChange = (item) => (e) => {
    const updated = e.target.checked
      ? [...form.checklist, item]
      : form.checklist.filter((i) => i !== item);
    setForm({ ...form, checklist: updated });
    calculateCompletion(updated);
  };

  const handleDateChange = (field) => (newValue) => {
    setForm({ ...form, [field]: newValue });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = (checklist) => {
    const percent = Math.round((checklist.length / checklistItems.length) * 100);
    setCompletion(percent);
  };

  const handleSubmit = async () => {
    if (!form.serialNumber || !form.facility || !form.installDate) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields.',
        severity: 'error',
      });
      return;
    }

    const payload = {
      ...form,
      installDate: form.installDate ? dayjs(form.installDate).format('YYYY-MM-DD') : null,
      trainingDate: form.trainingDate ? dayjs(form.trainingDate).format('YYYY-MM-DD') : null,
    };

    try {
      // 1. Add installation record
      await dispatch(addInstallation(payload)).unwrap();

      // 2. Update only relevant fields in device
      await dispatch(
        updateDevice({
          id: form.serialNumber,
          data: {
            status: 'Online',
            lastServiceDate: dayjs(form.installDate).format('YYYY-MM-DD'),
            facility: form.facility,
          },
        })
      ).unwrap();

      setSnackbar({
        open: true,
        message: 'Installation submitted successfully!',
        severity: 'success',
      });

      // 3. Reset form
      setForm({
        serialNumber: '',
        facility: '',
        installDate: null,
        installedBy: '',
        checklist: [],
        trainer: '',
        trainees: '',
        trainingDate: null,
        notes: '',
        image: '',
      });
      setCompletion(0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit installation.',
        severity: 'error',
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box maxWidth="md" mx="auto" px={isMobile ? 1 : 3} py={4} pb={10}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          New Installation
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Device Serial Number"
              value={form.serialNumber}
              onChange={handleChange('serialNumber')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              label="Facility"
              value={form.facility}
              onChange={handleChange('facility')}
            >
              {facilities.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Installation Date"
              value={form.installDate}
              onChange={handleDateChange('installDate')}
              renderInput={(params) => <TextField fullWidth required {...params} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Installed By"
              value={form.installedBy}
              onChange={handleChange('installedBy')}
            />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography fontWeight="bold" mb={1}>
            Unboxing Photos
          </Typography>
          <UploadBox>
            <Typography fontWeight="bold">Upload Photos</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Drag and drop or browse to upload unboxing photos
            </Typography>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {form.image && (
              <Box mt={2}>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>
            )}
          </UploadBox>
        </Box>

        <Box mt={4}>
          <Typography fontWeight="bold" mb={1}>
            Installation Checklist
          </Typography>
          <FormGroup>
            {checklistItems.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={form.checklist.includes(item)}
                    onChange={handleChecklistChange(item)}
                  />
                }
                label={item}
              />
            ))}
          </FormGroup>
        </Box>

        <Box mt={4}>
          <Typography fontWeight="bold" mb={1}>
            Training Info
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trainer Name"
                value={form.trainer}
                onChange={handleChange('trainer')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trainee Names"
                value={form.trainees}
                onChange={handleChange('trainees')}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Training Date"
                value={form.trainingDate}
                onChange={handleDateChange('trainingDate')}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Training Notes"
                value={form.notes}
                onChange={handleChange('notes')}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={4}>
          <Typography variant="body2" mb={1}>
            Completion Status
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completion}
            sx={{ height: 8, borderRadius: 5 }}
          />
          <Typography variant="caption" color="text.secondary">
            {completion}% Complete
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 999,
          }}
        >
          <Button variant="contained" size="large" onClick={handleSubmit}>
            Submit Installation
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default InstallationForm;
