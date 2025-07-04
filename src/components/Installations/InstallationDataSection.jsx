import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { updateForm } from "../../redux/slices/installationSlice";
import { fetchDevices } from "../../api/devices";

const SectionCard = styled(Paper)(({ theme }) => ({
  background: "var(--card-bg, " + theme.palette.background.paper + ")",
  borderRadius: 16,
  boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  transition: "background 0.3s, box-shadow 0.3s",
}));

const facilities = ["Apollo Hospital", "AIIMS", "Fortis", "Medanta"];
const forceWhiteText = (theme) =>
  theme.palette.mode === "dark" ? { color: "#fff !important" } : {};

const InstallationDataSection = forwardRef((props, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const form = useSelector((state) => state.installations.form);
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  useEffect(() => {
    setLoadingDevices(true);
    fetchDevices()
      .then((res) => setDevices(res.data || []))
      .catch(() => setDevices([]))
      .finally(() => setLoadingDevices(false));
  }, []);

  // Validation: check required fields
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!form.serialNumber || !form.facility || !form.installDate) {
        return false;
      }
      return true;
    }
  }), [form]);

  const handleChange = (field) => (e) =>
    dispatch(updateForm({ [field]: e.target.value }));
  const handleDateChange = (field) => (v) => dispatch(updateForm({ [field]: v }));

  return (
    <SectionCard className="card-white-text-dark">
      <Box display="flex" alignItems="center" mb={2}>
        <Typography
          variant="h6"
          fontWeight="bold"
          className="card-white-text-dark"
          sx={{
            mr: 1,
            display: "flex",
            alignItems: "center",
            ...forceWhiteText(theme),
          }}
        >
          <span
            role="img"
            aria-label="device"
            style={{
              fontSize: 22,
              marginRight: 8,
              color: theme.palette.mode === "dark" ? "#fff" : undefined,
            }}
          >
            🔧
          </span>
          Installation Data
        </Typography>
        <Box flex={1}>
          <Box
            component="hr"
            sx={{
              border: 0,
              borderTop:
                "1.5px solid var(--border-color, " + theme.palette.divider + ")",
              my: 0,
            }}
          />
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            className="themed-textfield card-white-text-dark"
            fullWidth
            required
            select
            label="Device Serial Number"
            value={form.serialNumber}
            onChange={handleChange("serialNumber")}
            autoComplete="off"
            helperText={
              loadingDevices
                ? "Loading devices..."
                : "Required. Unique device identifier."
            }
            aria-label="Device Serial Number"
            InputLabelProps={{
              required: false,
              style: forceWhiteText(theme),
            }}
            sx={forceWhiteText(theme)}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  className: "card-white-text-dark",
                  sx: {
                    backgroundColor: "var(--card-bg, #222)",
                    color: "#fff",
                  },
                },
              },
            }}
            disabled={loadingDevices || devices.length === 0}
          >
            {devices.length === 0 && !loadingDevices ? (
              <MenuItem value="" disabled>
                No devices found
              </MenuItem>
            ) : (
              devices.map((device) => (
                <MenuItem
                  key={device.id || device.serialNumber || device._id}
                  value={device.id || device.serialNumber || device._id}
                  className="card-white-text-dark"
                  style={{
                    color:
                      theme.palette.mode === "dark"
                        ? "#fff"
                        : "var(--text-color, #121212)",
                    background: "var(--card-bg, #222)",
                  }}
                >
                  {device.serialNumber || device.id || device._id}
                </MenuItem>
              ))
            )}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className="themed-textfield card-white-text-dark"
            fullWidth
            required
            select
            label="Facility"
            value={form.facility}
            onChange={handleChange("facility")}
            helperText="Required. Select facility."
            aria-label="Facility"
            InputLabelProps={{
              required: false,
              style: forceWhiteText(theme),
            }}
            sx={forceWhiteText(theme)}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  className: "card-white-text-dark",
                  sx: {
                    backgroundColor: "var(--card-bg, #222)",
                    color: "#fff",
                  },
                },
              },
            }}
          >
            {facilities.map((f) => (
              <MenuItem
                key={f}
                value={f}
                className="card-white-text-dark"
                style={{
                  color:
                    theme.palette.mode === "dark"
                      ? "#fff"
                      : "var(--text-color, #121212)",
                  background: "var(--card-bg, #222)",
                }}
              >
                {f}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Installation Date"
            value={form.installDate}
            onChange={handleDateChange("installDate")}
            slotProps={{
              textField: {
                className: "themed-textfield card-white-text-dark",
                fullWidth: true,
                required: true,
                helperText: "Required. Date of installation.",
                "aria-label": "Installation Date",
                InputLabelProps: {
                  required: false,
                  style: forceWhiteText(theme),
                },
                sx: forceWhiteText(theme),
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className="themed-textfield card-white-text-dark"
            fullWidth
            label="Installed By"
            value={form.installedBy}
            onChange={handleChange("installedBy")}
            helperText="Name of the installer (optional)"
            aria-label="Installed By"
            InputLabelProps={{ style: forceWhiteText(theme) }}
            sx={forceWhiteText(theme)}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
});

export default InstallationDataSection;