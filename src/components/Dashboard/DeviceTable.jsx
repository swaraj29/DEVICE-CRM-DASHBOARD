import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../../redux/slices/deviceSlice";

const getStatusColor = (status) =>
  status === "Online"
    ? "success"
    : status === "Offline"
    ? "error"
    : status === "Maintenance"
    ? "warning"
    : "default";
const getAMCColor = (status) =>
  status === "Active" ? "success" : status === "Inactive" ? "error" : "default";

const DeviceTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: devices, loading } = useSelector((state) => state.devices);
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);
  if (loading) return <LinearProgress sx={{ mt: 4 }} />;
  return (
    <Box
      sx={{
        width: isMobile ? "160%" : "90%",
        ml: isMobile ? "-60px" : "180px",
        mr: isMobile ? 0 : "240px",
        pb: 3,
        backgroundColor: "transparent",
      }}
    >
      <Typography
        variant={isMobile ? "h6" : "h5"}
        gutterBottom
        fontWeight="bold"
        sx={{
          textAlign: "center",
          mb: isMobile ? 1 : 2,
          px: isMobile ? 2 : 0,
          color: "var(--text-color)",
        }}
      >
        Device Inventory
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: isMobile ? 0 : 2,
          boxShadow: isMobile ? "none" : "0px 2px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "var(--card-bg)",
        }}
      >
        <Table
          size={isMobile ? "small" : "medium"}
          sx={{ minWidth: 650, backgroundColor: "var(--card-bg)" }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--bg-color)" }}>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  color: "var(--text-color)",
                }}
              >
                Device Type
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  color: "var(--text-color)",
                }}
              >
                Device ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  color: "var(--text-color)",
                }}
              >
                Facility
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  color: "var(--text-color)",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  color: "var(--text-color)",
                }}
              >
                Battery %
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  color: "var(--text-color)",
                }}
              >
                Last Service/Install
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  color: "var(--text-color)",
                }}
              >
                AMC/CMC Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow
                key={device.id}
                sx={{ "&:hover": { backgroundColor: "var(--card-bg)" } }}
              >
                <TableCell
                  sx={{
                    fontSize: isMobile ? "0.7rem" : "0.85rem",
                    color: "var(--text-color)",
                  }}
                >
                  {device.type}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: isMobile ? "0.7rem" : "0.85rem",
                    color: "var(--text-color)",
                  }}
                >
                  {device.id}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: isMobile ? "0.7rem" : "0.85rem",
                    color: "var(--text-color)",
                  }}
                >
                  {device.facility}
                </TableCell>
                <TableCell>
                  <Chip
                    label={device.status}
                    color={getStatusColor(device.status)}
                    size="small"
                    sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress
                      variant="determinate"
                      value={device.battery}
                      sx={{
                        width: isMobile ? 40 : 60,
                        height: 6,
                        borderRadius: 5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: isMobile ? "0.7rem" : "0.85rem",
                        color: "var(--text-color)",
                      }}
                    >
                      {device.battery}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: isMobile ? "0.7rem" : "0.85rem",
                    color: "var(--text-color)",
                  }}
                >
                  {device.lastServiceDate}
                </TableCell>
                <TableCell>
                  <Chip
                    label={device.amcStatus}
                    color={getAMCColor(device.amcStatus)}
                    size="small"
                    sx={{
                      fontSize: isMobile ? "0.65rem" : "0.75rem",
                      bgcolor:
                        device.amcStatus === "Inactive" ? "#ffebee" : undefined,
                      color:
                        device.amcStatus === "Inactive" ? "#d32f2f" : undefined,
                      border:
                        device.amcStatus === "Inactive"
                          ? "1px solid #d32f2f"
                          : undefined,
                      fontWeight:
                        device.amcStatus === "Inactive" ? 700 : undefined,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeviceTable;
