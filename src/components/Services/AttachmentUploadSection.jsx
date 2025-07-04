import React from 'react';
import { Box, Typography, Button, styled } from '@mui/material';

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed var(--border-color, #d1d5db)`,
  padding: theme.spacing(6),
  borderRadius: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: 'var(--card-bg, #fafafa)',
  marginTop: theme.spacing(1),
  color: 'var(--text-color, #666)',
  minHeight: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const AttachmentUploadSection = ({ form, formDispatch }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      formDispatch({ type: 'SET_ATTACHMENT', value: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="600" mb={1}>
        Attachments
      </Typography>
      <UploadBox className="card-white-text-dark">
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Drag and drop files here
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Or click to browse your files
        </Typography>
        <input
          type="file"
          onChange={handleUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>
        {form.attachment && (
          <Typography variant="body2" mt={1} color="success.main">
            ✓ File selected
          </Typography>
        )}
      </UploadBox>
    </Box>
  );
};

export default AttachmentUploadSection;