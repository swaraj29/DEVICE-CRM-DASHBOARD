import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as installationAPI from '../../api/installations';

export const fetchInstallations = createAsyncThunk(
  'installations/fetchInstallations',
  async () => {
    const response = await installationAPI.fetchInstallations();
    return response.data;
  }
);

export const addInstallation = createAsyncThunk(
  'installations/addInstallation',
  async (data) => {
    const response = await installationAPI.addInstallation(data);
    return response.data;
  }
);

const installationSlice = createSlice({
  name: 'installations',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstallations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstallations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInstallations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addInstallation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInstallation.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addInstallation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default installationSlice.reducer;
