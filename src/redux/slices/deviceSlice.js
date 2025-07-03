import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as deviceAPI from '../../api/devices';

// ✅ Fetch devices
export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async () => {
    const response = await deviceAPI.fetchDevices();
    return response.data;
  }
);

// ✅ Update device
export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, data }) => {
    const response = await deviceAPI.updateDevice(id, data);
    return response.data;
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch devices
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update device
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((device) => device.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default deviceSlice.reducer;

