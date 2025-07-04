import React from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InstallationDataSection from "../components/Installations/InstallationDataSection";
import ImageUploadSection from "../components/Installations/ImageUploadSection";
import TrainingInfoSection from "../components/Installations/TrainingInfoSection";
import FormActions from "../components/Installations/FormActions";
import { Box, Typography } from "@mui/material";

const Installations = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box maxWidth="md" mx="auto" px={isMobile ? 1 : 3} py={4} pb={10}>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          className="card-white-text-dark"
        >
          New Installation
        </Typography>
        <InstallationDataSection />
        <ImageUploadSection />
        <TrainingInfoSection />
        <FormActions />
      </Box>
    </LocalizationProvider>
  );
};

export default Installations;