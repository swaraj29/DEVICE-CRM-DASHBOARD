import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as alertAPI from '../../api/alerts';

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async () => {
    const response = await alertAPI.fetchAlerts();
    return response.data;
  }
);

export const removeAlertPhoto = createAsyncThunk(
  'alerts/removeAlertPhoto',
  async (alertId, { rejectWithValue }) => {
    try {
      await alertAPI.updateAlert(alertId, { photo: '' });
      return alertId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteAlertThunk = createAsyncThunk(
  'alerts/deleteAlert',
  async (alertId, { rejectWithValue }) => {
    try {
      await alertAPI.deleteAlert(alertId);
      return alertId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const alertSlice = createSlice({
  name: 'alerts',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeAlertPhoto.fulfilled, (state, action) => {
        // Remove photo from alert in state
        const alert = state.data.find(a => a.id === action.payload);
        if (alert) alert.photo = '';
      })
      .addCase(deleteAlertThunk.fulfilled, (state, action) => {
        state.data = state.data.filter(a => a.id !== action.payload);
      });
  },
});

export default alertSlice.reducer;
