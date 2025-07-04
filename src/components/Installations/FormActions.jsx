import React from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addInstallation, setSnackbar } from "../../redux/slices/installationSlice";
import { updateDevice } from "../../redux/slices/deviceSlice";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";

const FormActions = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { form, snackbar } = useSelector((state) => state.installations);

  const handleSubmit = async () => {
    // Validate user-editable required fields
    if (!form.facility || !form.installDate) {
      dispatch(
        setSnackbar({
          open: true,
          message: "Please fill all required fields.",
          severity: "error",
        })
      );
      return;
    }
    // Example: Validate installDate is a valid date
    if (!dayjs(form.installDate).isValid()) {
      dispatch(
        setSnackbar({
          open: true,
          message: "Install date is invalid.",
          severity: "error",
        })
      );
      return;
    }
    // Add more field checks as needed...

    const payload = {
      ...form,
      installDate: form.installDate
        ? dayjs(form.installDate).format("YYYY-MM-DD")
        : null,
      trainingDate: form.trainingDate
        ? dayjs(form.trainingDate).format("YYYY-MM-DD")
        : null,
    };
    try {
      await dispatch(addInstallation(payload)).unwrap();
      await dispatch(
        updateDevice({
          id: form.serialNumber,
          data: {
            status: "Online",
            lastServiceDate: dayjs(form.installDate).format("YYYY-MM-DD"),
            facility: form.facility,
          },
        })
      ).unwrap();
      // Form reset and snackbar handled in slice
    } catch {
      // Error handling managed in slice
    }
  };

  return (
    <>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            transition: "background 0.3s",
          }}
        >
          Submit Installation
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            width: "100%",
            background:
              "var(--card-bg, " + theme.palette.background.paper + ")",
            color: "var(--text-color, " + theme.palette.text.primary + ")",
            borderRadius: 2,
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            border:
              "1px solid var(--border-color, " + theme.palette.divider + ")",
          }}
          onClose={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormActions;