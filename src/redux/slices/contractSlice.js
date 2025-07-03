import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as contractAPI from '../../api/contracts';

export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async () => {
    const response = await contractAPI.fetchContracts();
    return response.data;
  }
);

const contractSlice = createSlice({
  name: 'contracts',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default contractSlice.reducer;
