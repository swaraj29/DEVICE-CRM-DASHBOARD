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

const initialForm = {
  serialNumber: "",
  facility: "",
  installDate: null,
  installedBy: "",
  trainer: "",
  trainees: "",
  trainingDate: null,
  notes: "",
  image: "",
};

const initialState = {
  data: [],
  loading: false,
  error: null,
  form: initialForm,
  snackbar: {
    open: false,
    message: "",
    severity: "success",
  },
};

const installationSlice = createSlice({
  name: 'installations',
  initialState,
  reducers: {
    updateForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm: (state) => {
      state.form = initialForm;
    },
    setSnackbar: (state, action) => {
      state.snackbar = { ...state.snackbar, ...action.payload };
    },
  },
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
        state.form = initialForm;
        state.snackbar = {
          open: true,
          message: "Installation submitted successfully!",
          severity: "success",
        };
      })
      .addCase(addInstallation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.snackbar = {
          open: true,
          message: "Failed to submit installation.",
          severity: "error",
        };
      });
  },
});

export const { updateForm, resetForm, setSnackbar } = installationSlice.actions;
export default installationSlice.reducer;