import React from "react";
import { Box, Typography, Button, Paper, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { updateForm } from "../../redux/slices/installationSlice";

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed var(--border-color, ${theme.palette.divider})`,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  textAlign: "center",
  backgroundColor: "var(--card-bg, " + theme.palette.background.paper + ")",
  color: "var(--text-color, " + theme.palette.text.primary + ")",
  cursor: "pointer",
  transition: "background-color 0.3s, border-color 0.3s",
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.04)",
  "&:hover": {
    backgroundColor: "var(--appbar-bg, " + theme.palette.action.hover + ")",
    borderColor: "var(--border-color, " + theme.palette.primary.main + ")",
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  background: "var(--card-bg, " + theme.palette.background.paper + ")",
  borderRadius: 16,
  boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  transition: "background 0.3s, box-shadow 0.3s",
}));

const ImageUploadSection = ({ requireImage = false, onImageInvalid }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const form = useSelector((state) => state.installations.form);
  const isDark = theme.palette.mode === "dark";
  const whiteText = { color: "#fff !important" };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => dispatch(updateForm({ image: reader.result }));
    reader.readAsDataURL(file);
  };

  // Optionally, expose a validation function
  React.useImperativeHandle(onImageInvalid, () => ({
    validate: () => {
      if (requireImage && !form.image) {
        return false;
      }
      return true;
    }
  }), [form.image, requireImage]);

  return (
    <SectionCard className="card-white-text-dark">
      <Typography
        fontWeight="bold"
        mb={1}
        color="text.primary"
        sx={isDark ? whiteText : {}}
      >
        Unboxing Photos
      </Typography>
      <UploadBox sx={isDark ? whiteText : {}}>
        <Typography
          fontWeight="bold"
          color="text.primary"
          sx={isDark ? whiteText : {}}
        >
          Upload Photos
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={isDark ? whiteText : {}}
        >
          Drag and drop or browse to upload unboxing photos
        </Typography>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="installation-photo-upload"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="installation-photo-upload">
          <Button
            variant="contained"
            component="span"
            sx={{ transition: "background 0.3s", ...(isDark ? whiteText : {}) }}
          >
            Browse Files
          </Button>
        </label>
        {form.image && (
          <Box mt={2}>
            <img
              src={form.image}
              alt="Unboxing Preview"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 8,
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
              }}
            />
          </Box>
        )}
      </UploadBox>
    </SectionCard>
  );
};

export default ImageUploadSection;