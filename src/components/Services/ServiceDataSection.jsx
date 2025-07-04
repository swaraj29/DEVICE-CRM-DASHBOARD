import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector } from 'react-redux';

const engineers = ['John Doe', 'Alice Smith', 'Ravi Kumar'];
const purposes = ['Preventive', 'Breakdown', 'Maintenance'];
const conditions = ['Yes', 'No'];

const ServiceDataSection = ({ form, formDispatch }) => {
  const devices = useSelector((state) => state.devices.data);

  // When deviceId changes, auto-fill facility
  useEffect(() => {
    if (form.deviceId && devices.length > 0) {
      const selectedDevice = devices.find(
        (d) => String(d.id) === String(form.deviceId)
      );
      if (selectedDevice && selectedDevice.facility !== form.facility) {
        formDispatch({
          type: 'SET_FIELD',
          field: 'facility',
          value: selectedDevice.facility || '',
        });
      }
    } else if (!form.deviceId && form.facility) {
      // Clear facility if deviceId is cleared
      formDispatch({ type: 'SET_FIELD', field: 'facility', value: '' });
    }
  }, [form.deviceId, devices]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    formDispatch({ type: 'SET_FIELD', field, value });
    // Auto-fill facility when deviceId changes
    if (field === 'deviceId') {
      const selectedDevice = devices.find((d) => String(d.id) === String(value));
      formDispatch({ type: 'SET_FIELD', field: 'facility', value: selectedDevice ? selectedDevice.facility : '' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} mb={4}>
      {/* Device ID */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Device ID
        </Typography>
        <FormControl fullWidth className="card-white-text-dark">
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
            {devices && devices.length > 0 && devices.map((device) => (
              <MenuItem key={device.id} value={device.id} className="card-white-text-dark">
                {device.id} — {device.name || device.type || 'Device'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Facility */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Facility
        </Typography>
        <TextField
          fullWidth
          value={form.facility}
          placeholder="Auto-filled from device"
          InputProps={{ readOnly: true }}
          className="card-white-text-dark"
        />
      </Box>

      {/* Date */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Date
        </Typography>
        <DatePicker
          value={form.date}
          onChange={(newValue) =>
            formDispatch({ type: 'SET_DATE', value: newValue })
          }
          slotProps={{
            textField: {
              fullWidth: true,
              className: 'card-white-text-dark',
              sx: {
                input: {
                  color: 'var(--text-color)',
                },
                svg: {
                  color: 'var(--text-color)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--text-color)',
                },
              },
            },
          }}
        />
      </Box>

      {/* Engineer */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Responsible Engineer
        </Typography>
        <FormControl fullWidth className="card-white-text-dark">
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
        </FormControl>
      </Box>

      {/* Purpose */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Purpose of Visit
        </Typography>
        <FormControl fullWidth className="card-white-text-dark">
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
        </FormControl>
      </Box>

      {/* Functional Status */}
      {form.purpose === 'Breakdown' && (
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Is Device Functional?
          </Typography>
          <FormControl fullWidth className="card-white-text-dark">
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
          </FormControl>
        </Box>
      )}

      {/* Notes */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter notes about the visit"
          value={form.notes}
          onChange={handleChange('notes')}
          className="card-white-text-dark"
        />
      </Box>
    </Box>
  );
};

export default ServiceDataSection;
