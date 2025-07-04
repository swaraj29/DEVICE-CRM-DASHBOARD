import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContracts } from "../../redux/slices/contractSlice";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import "./AMCContracts.scss";
import { exportContractsToCSV } from "../../utils/exportToCSV";

const getStatus = (expiryDate) =>
  (new Date(expiryDate) - new Date()) / 86400000 <= 30
    ? "Expiring Soon"
    : "Active";
const getDaysRemaining = (expiryDate) =>
  Math.ceil((new Date(expiryDate) - new Date()) / 86400000);

const AMCContracts = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.contracts);
  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);
  const upcomingExpiries = data.filter(
    (c) => getDaysRemaining(c.expiryDate) <= 90
  );
  return (
    <Box className="contract-container">
      <Typography variant="h4" className="heading">
        Contract Management
      </Typography>
      <Typography variant="body2" className="subheading">
        Manage and track device contracts, including AMC and CMC details.
      </Typography>
      <Box className="section">
        <Typography variant="h6">Contract Overview</Typography>
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device Name</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>Facility</TableCell>
                <TableCell>Contract Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c.serialNumber}>
                  <TableCell className="force-readable-text">
                    {c.deviceName}
                  </TableCell>
                  <TableCell className="link-cell force-readable-text">
                    {c.serialNumber}
                  </TableCell>
                  <TableCell className="force-readable-text">
                    {c.facility}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.contractType}
                      className={`chip ${c.contractType.toLowerCase()}`}
                    />
                  </TableCell>
                  <TableCell className="force-readable-text">
                    {c.startDate}
                  </TableCell>
                  <TableCell className="force-readable-text">
                    {c.expiryDate}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatus(c.expiryDate)}
                      className={`chip ${getStatus(c.expiryDate)
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box className="section">
        <Typography variant="h6">Upcoming Expiries</Typography>
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device Name</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>Facility</TableCell>
                <TableCell>Contract Type</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Days Remaining</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upcomingExpiries.map((c) => (
                <TableRow key={c.serialNumber}>
                  <TableCell className="force-readable-text">
                    {c.deviceName}
                  </TableCell>
                  <TableCell className="link-cell force-readable-text">
                    {c.serialNumber}
                  </TableCell>
                  <TableCell className="force-readable-text">
                    {c.facility}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.contractType}
                      className={`chip ${c.contractType.toLowerCase()}`}
                    />
                  </TableCell>
                  <TableCell className="force-readable-text">
                    {c.expiryDate}
                  </TableCell>
                  <TableCell className="force-readable-text">
                    {getDaysRemaining(c.expiryDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box className="export-button">
        <Button variant="outlined" onClick={() => exportContractsToCSV(data)}>
          Export Report
        </Button>
      </Box>
    </Box>
  );
};

export default AMCContracts;
