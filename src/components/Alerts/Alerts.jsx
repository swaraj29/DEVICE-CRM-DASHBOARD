// Alerts.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlerts } from "../../redux/slices/alertSlice";
import { fetchDevices } from "../../redux/slices/deviceSlice";
import { addAlert, updateAlert, deleteAlert } from "../../api/alerts";
import { removeAlertPhoto, deleteAlertThunk } from "../../redux/slices/alertSlice";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Divider,
} from "@mui/material";
import { ReportProblem } from "@mui/icons-material";
import "./Alerts.scss";

const Alerts = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alerts.data);
  const devices = useSelector((state) => state.devices.data);
  const loading = useSelector((state) => state.alerts.loading);

  const [formData, setFormData] = useState({
    deviceId: "",
    issue: "",
    photo: "",
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
      alert("Please fill in all fields.");
      return;
    }
    try {
      await addAlert(formData);
      dispatch(fetchAlerts());
      setFormData({ deviceId: "", issue: "", photo: "" });
    } catch (err) {
      console.error("Failed to add alert:", err);
    }
  };

  const handleRemovePhoto = async (alertId) => {
    try {
      await dispatch(removeAlertPhoto(alertId)).unwrap();
      // Optionally, show a success message or refresh alerts
    } catch (err) {
      alert("Failed to remove photo: " + (err?.message || err));
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    try {
      await dispatch(deleteAlertThunk(alertId)).unwrap();
    } catch (err) {
      alert("Failed to delete alert: " + (err?.message || err));
    }
  };

  return (
    <Box className="alerts-container">
      {/* Header Section with stats */}
      <Box
        className="header-section"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <Box
          className="title-block"
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <ReportProblem
            style={{ fontSize: 40, color: "#1976d2", marginRight: 12 }}
          />
          <Box>
            <Typography variant="h4" className="title">
              Alerts & Photo Logs
            </Typography>
            <Typography
              variant="subtitle1"
              className="subtitle"
              style={{ color: "var(--text-color, #666)" }}
            >
              Report device issues and view maintenance logs
            </Typography>
          </Box>
        </Box>
        <Box style={{ display: "flex", gap: 16 }}>
          <Paper
            elevation={2}
            className="stat-card"
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              minWidth: 120,
              textAlign: "center",
              background: "var(--card-bg, #fafafa)",
            }}
          >
            <Typography
              variant="h6"
              style={{ fontWeight: 700, color: "#1976d2" }}
            >
              {alerts.length}
            </Typography>
            <Typography
              variant="body2"
              style={{ color: "var(--text-color, #666)" }}
            >
              Total Alerts
            </Typography>
          </Paper>
          <Paper
            elevation={2}
            className="stat-card"
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              minWidth: 120,
              textAlign: "center",
              background: "var(--card-bg, #fafafa)",
            }}
          >
            <Typography
              variant="h6"
              style={{ fontWeight: 700, color: "#43a047" }}
            >
              {devices.length}
            </Typography>
            <Typography
              variant="body2"
              style={{ color: "var(--text-color, #666)" }}
            >
              Active Devices
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Paper className="form-section">
        <Typography variant="h6" gutterBottom>
          📩 Report a Device Issue
        </Typography>
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

          <Box className="upload-photo-block">
            <Button
              variant="outlined"
              component="label"
              className="upload-photo-btn"
            >
              <span className="upload-photo-icon">📷</span> Upload Photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </Button>
            {formData.photo && (
              <Box className="preview-img">
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Preview:
                </Typography>
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="alert-photo"
                />
                <Button
                  size="small"
                  color="error"
                  className="remove-photo-btn"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, photo: "" }))
                  }
                >
                  Remove
                </Button>
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-btn"
          >
            Submit Alert
          </Button>
        </form>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Box className="alert-list">
        <Typography variant="h6" gutterBottom>
          🧾 Submitted Alerts
        </Typography>
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
                    <Box sx={{ position: "relative", mb: 1 }}>
                      <img
                        src={alert.photo}
                        alt="Alert"
                        className="alert-photo"
                      />
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ mt: 1, mr: 1 }}
                        onClick={() => handleRemovePhoto(alert.id)}
                      >
                        Remove Photo
                      </Button>
                    </Box>
                  )}
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    Delete Alert
                  </Button>
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
