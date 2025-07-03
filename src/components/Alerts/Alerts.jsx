// Alerts.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlerts } from '../../redux/slices/alertSlice';
import { fetchDevices } from '../../redux/slices/deviceSlice';
import { addAlert } from '../../api/alerts';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Divider,
} from '@mui/material';
import './Alerts.scss';

const Alerts = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alerts.data);
  const devices = useSelector((state) => state.devices.data);
  const loading = useSelector((state) => state.alerts.loading);

  const [formData, setFormData] = useState({
    deviceId: '',
    issue: '',
    photo: '',
  });

  useEffect(() => {
    dispatch(fetchAlerts());
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deviceId || !formData.issue) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      await addAlert(formData);
      dispatch(fetchAlerts());
      setFormData({ deviceId: '', issue: '', photo: '' });
    } catch (err) {
      console.error('Failed to add alert:', err);
    }
  };

  return (
    <Box className="alerts-container">
      <Typography variant="h4" className="title">Alerts & Photo Logs</Typography>

      <Paper className="form-section">
        <Typography variant="h6" gutterBottom>📩 Report a Device Issue</Typography>
        <form onSubmit={handleSubmit} className="alert-form">
          <TextField
            select
            label="Select Device"
            name="deviceId"
            value={formData.deviceId}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {devices.map((device) => (
              <MenuItem key={device.id} value={device.id}>
                {device.type} (ID: {device.id})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Describe the issue"
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          <Button variant="outlined" component="label">
            📷 Upload Photo
            <input hidden type="file" accept="image/*" onChange={handlePhotoUpload} />
          </Button>

          {formData.photo && (
            <Box className="preview-img">
              <Typography variant="body2" sx={{ mt: 1 }}>Preview:</Typography>
              <img src={formData.photo} alt="Preview" className="alert-photo" />
            </Box>
          )}

          <Button type="submit" variant="contained" color="primary" className="submit-btn">
            Submit Alert
          </Button>
        </form>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Box className="alert-list">
        <Typography variant="h6" gutterBottom>🧾 Submitted Alerts</Typography>
        <Grid container spacing={2}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : alerts.length === 0 ? (
            <Typography>No alerts submitted yet.</Typography>
          ) : (
            alerts.map((alert) => (
              <Grid item xs={12} sm={6} md={4} key={alert.id}>
                <Paper className="alert-card" elevation={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Device ID:</strong> {alert.deviceId}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Issue:</strong> {alert.issue}
                  </Typography>
                  {alert.photo && (
                    <img src={alert.photo} alt="Alert" className="alert-photo" />
                  )}
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Alerts;
