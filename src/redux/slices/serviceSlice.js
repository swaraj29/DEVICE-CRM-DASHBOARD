import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as serviceAPI from '../../api/services';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    const response = await serviceAPI.fetchServices();
    return response.data;
  }
);

export const addService = createAsyncThunk(
  'services/addService',
  async (data) => {
    const response = await serviceAPI.addService(data);
    return response.data;
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default serviceSlice.reducer;
