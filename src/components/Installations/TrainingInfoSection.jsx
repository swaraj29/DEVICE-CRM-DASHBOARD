import React from "react";
import { Box, Typography, TextField, Grid, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { updateForm } from "../../redux/slices/installationSlice";

const SectionCard = styled(Paper)(({ theme }) => ({
  background: "var(--card-bg, " + theme.palette.background.paper + ")",
  borderRadius: 16,
  boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  transition: "background 0.3s, box-shadow 0.3s",
}));

const forceWhiteText = (theme) =>
  theme.palette.mode === "dark" ? { color: "#fff !important" } : {};

const TrainingInfoSection = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const form = useSelector((state) => state.installations.form);

  const handleChange = (field) => (e) =>
    dispatch(updateForm({ [field]: e.target.value }));
  const handleDateChange = (field) => (v) => dispatch(updateForm({ [field]: v }));

  return (
    <SectionCard className="card-white-text-dark">
      <Typography
        fontWeight="bold"
        mb={1}
        color="text.primary"
        sx={forceWhiteText(theme)}
      >
        Training Info
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            className="themed-textfield"
            fullWidth
            label="Trainer Name"
            value={form.trainer}
            onChange={handleChange("trainer")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className="themed-textfield"
            fullWidth
            label="Trainee Names"
            value={form.trainees}
            onChange={handleChange("trainees")}
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            label="Training Date"
            value={form.trainingDate}
            onChange={handleDateChange("trainingDate")}
            renderInput={(params) => (
              <TextField className="themed-textfield" fullWidth {...params} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className="themed-textfield"
            fullWidth
            multiline
            rows={3}
            label="Training Notes"
            value={form.notes}
            onChange={handleChange("notes")}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
};

export default TrainingInfoSection;