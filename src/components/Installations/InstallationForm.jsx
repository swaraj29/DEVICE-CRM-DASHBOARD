import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled, useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { addInstallation } from '../../redux/slices/installationSlice';
import { updateDevice } from '../../redux/slices/deviceSlice';

// Themed components for consistent palette/variable usage
const ThemedTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: 'var(--card-bg, ' + theme.palette.background.paper + ')',
    color: 'var(--text-color, ' + theme.palette.text.primary + ')',
    borderRadius: 8,
    transition: 'background 0.3s, color 0.3s, border-color 0.3s',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--border-color, ' + theme.palette.divider + ')',
    transition: 'border-color 0.3s',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--border-color, ' + theme.palette.primary.main + ')',
  },
  '& label': {
    color: 'var(--text-color, ' + theme.palette.text.secondary + ')',
    transition: 'color 0.3s',
  },
  '& label.Mui-focused': {
    color: 'var(--text-color, ' + theme.palette.primary.main + ')',
  },
  '& .MuiInputBase-input': {
    color: 'var(--text-color, ' + theme.palette.text.primary + ')',
  },
  '& .Mui-disabled': {
    background: 'var(--card-bg, ' + theme.palette.action.disabledBackground + ')',
    color: 'var(--text-color, ' + theme.palette.text.disabled + ')',
  },
}));

const ThemedSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'var(--text-color, ' + theme.palette.primary.main + ')',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var(--border-color, ' + theme.palette.primary.main + ')',
  },
  '& .MuiSwitch-track': {
    backgroundColor: 'var(--border-color, ' + theme.palette.divider + ')',
    transition: 'background-color 0.3s',
  },
}));

const ThemedFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: 'var(--text-color, ' + theme.palette.text.primary + ')',
    fontWeight: 500,
    transition: 'color 0.3s',
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed var(--border-color, ${theme.palette.divider})`,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: 'var(--card-bg, ' + theme.palette.background.paper + ')',
  color: 'var(--text-color, ' + theme.palette.text.primary + ')',
  cursor: 'pointer',
  transition: 'background-color 0.3s, border-color 0.3s',
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
  '&:hover': {
    backgroundColor: 'var(--appbar-bg, ' + theme.palette.action.hover + ')',
    borderColor: 'var(--border-color, ' + theme.palette.primary.main + ')',
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  background: 'var(--card-bg, ' + theme.palette.background.paper + ')',
  borderRadius: 16,
  boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  transition: 'background 0.3s, box-shadow 0.3s',
}));

const checklistItems = [
  'Verify device functionality',
  'Confirm network connectivity',
  'Calibrate device settings',
];

const facilities = ['Apollo Hospital', 'AIIMS', 'Fortis', 'Medanta'];

// Utility function to force white text in dark mode
const forceWhiteText = (theme) => theme.palette.mode === 'dark' ? { color: '#fff !important' } : {};

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
        <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
          New Installation
        </Typography>

        <SectionCard className="card-white-text-dark">
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" className="card-white-text-dark" sx={{ mr: 1, display: 'flex', alignItems: 'center', ...forceWhiteText(theme) }}>
              <span role="img" aria-label="device" style={{ fontSize: 22, marginRight: 8, color: theme.palette.mode === 'dark' ? '#fff' : undefined }}>🔧</span>
              Installation Data
            </Typography>
            <Box flex={1}>
              <Box component="hr" sx={{ border: 0, borderTop: '1.5px solid var(--border-color, ' + theme.palette.divider + ')', my: 0 }} />
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ThemedTextField
                className="card-white-text-dark"
                fullWidth
                required
                label="Device Serial Number"
                value={form.serialNumber}
                onChange={handleChange('serialNumber')}
                autoComplete="off"
                helperText="Required. Unique device identifier."
                aria-label="Device Serial Number"
                InputLabelProps={{ required: false, style: forceWhiteText(theme) }}
                sx={forceWhiteText(theme)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ThemedTextField
                className="card-white-text-dark"
                fullWidth
                required
                select
                label="Facility"
                value={form.facility}
                onChange={handleChange('facility')}
                helperText="Required. Select facility."
                aria-label="Facility"
                InputLabelProps={{ required: false, style: forceWhiteText(theme) }}
                sx={forceWhiteText(theme)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      className: 'card-white-text-dark',
                      sx: {
                        backgroundColor: 'var(--card-bg, #222)',
                        color: '#fff',
                      },
                    },
                  },
                }}
              >
                {facilities.map((f) => (
                  <MenuItem key={f} value={f} className="card-white-text-dark" style={{ color: theme.palette.mode === 'dark' ? '#fff' : 'var(--text-color, #121212)', background: 'var(--card-bg, #222)' }}>
                    {f}
                  </MenuItem>
                ))}
              </ThemedTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Installation Date"
                value={form.installDate}
                onChange={handleDateChange('installDate')}
                renderInput={(params) => (
                  <ThemedTextField
                    className="card-white-text-dark"
                    fullWidth
                    required
                    {...params}
                    helperText="Required. Date of installation."
                    aria-label="Installation Date"
                    InputLabelProps={{ required: false, style: forceWhiteText(theme) }}
                    sx={forceWhiteText(theme)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ThemedTextField
                className="card-white-text-dark"
                fullWidth
                label="Installed By"
                value={form.installedBy}
                onChange={handleChange('installedBy')}
                helperText="Name of the installer (optional)"
                aria-label="Installed By"
                InputLabelProps={{ style: forceWhiteText(theme) }}
                sx={forceWhiteText(theme)}
              />
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard className="card-white-text-dark">
          <Typography fontWeight="bold" mb={1} color="text.primary" sx={forceWhiteText(theme)}>
            Unboxing Photos
          </Typography>
          <UploadBox>
            <Typography fontWeight="bold" color="text.primary" sx={forceWhiteText(theme)}>Upload Photos</Typography>
            <Typography variant="body2" color="text.secondary" mb={2} sx={forceWhiteText(theme)}>
              Drag and drop or browse to upload unboxing photos
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="installation-photo-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="installation-photo-upload">
              <Button variant="contained" component="span" sx={{ transition: 'background 0.3s' }}>
                Browse Files
              </Button>
            </label>
            {form.image && (
              <Box mt={2}>
                <img
                  src={form.image}
                  alt="Unboxing Preview"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
                />
              </Box>
            )}
          </UploadBox>
        </SectionCard>

        <SectionCard className="card-white-text-dark">
          <Typography fontWeight="bold" mb={1} color="text.primary" sx={forceWhiteText(theme)}>
            Installation Checklist
          </Typography>
          <FormGroup>
            {checklistItems.map((item) => (
              <ThemedFormControlLabel
                key={item}
                control={
                  <ThemedSwitch
                    checked={form.checklist.includes(item)}
                    onChange={handleChecklistChange(item)}
                  />
                }
                label={item}
              />
            ))}
          </FormGroup>
        </SectionCard>

        <SectionCard className="card-white-text-dark">
          <Typography fontWeight="bold" mb={1} color="text.primary" sx={forceWhiteText(theme)}>
            Training Info
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ThemedTextField
                fullWidth
                label="Trainer Name"
                value={form.trainer}
                onChange={handleChange('trainer')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ThemedTextField
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
                renderInput={(params) => <ThemedTextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12}>
              <ThemedTextField
                fullWidth
                multiline
                rows={3}
                label="Training Notes"
                value={form.notes}
                onChange={handleChange('notes')}
              />
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard className="card-white-text-dark">
          <Typography variant="body2" mb={1} color="text.primary" sx={forceWhiteText(theme)}>
            Completion Status
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completion}
            sx={{ height: 8, borderRadius: 5, background: 'var(--appbar-bg, ' + theme.palette.action.selected + ')', transition: 'background 0.3s' }}
          />
          <Typography variant="caption" color="text.secondary" sx={forceWhiteText(theme)}>
            {completion}% Complete
          </Typography>
        </SectionCard>

        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 999,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
            borderRadius: 8,
            transition: 'box-shadow 0.3s',
          }}
        >
          <Button variant="contained" size="large" onClick={handleSubmit} sx={{ fontWeight: 600, px: 4, py: 1.5, borderRadius: 3, transition: 'background 0.3s' }}>
            Submit Installation
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: '100%', background: 'var(--card-bg, ' + theme.palette.background.paper + ')', color: 'var(--text-color, ' + theme.palette.text.primary + ')', borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', border: '1px solid var(--border-color, ' + theme.palette.divider + ')' }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default InstallationForm;