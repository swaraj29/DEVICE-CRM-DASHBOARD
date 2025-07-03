import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts } from '../../redux/slices/contractSlice';
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
  Button
} from '@mui/material';
import './AMCContracts.scss';
import { exportContractsToCSV } from '../../utils/exportToCSV';

const getStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diff = (expiry - today) / (1000 * 60 * 60 * 24);
  return diff <= 30 ? 'Expiring Soon' : 'Active';
};

const getDaysRemaining = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const AMCContracts = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.contracts);

  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  const upcomingExpiries = data.filter((contract) => getDaysRemaining(contract.expiryDate) <= 90);

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
              {data.map((contract) => (
                <TableRow key={contract.serialNumber}>
                  <TableCell>{contract.deviceName}</TableCell>
                  <TableCell className="link-cell">{contract.serialNumber}</TableCell>
                  <TableCell>{contract.facility}</TableCell>
                  <TableCell>
                    <Chip
                      label={contract.contractType}
                      className={`chip ${contract.contractType.toLowerCase()}`}
                    />
                  </TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.expiryDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatus(contract.expiryDate)}
                      className={`chip ${getStatus(contract.expiryDate)
                        .toLowerCase()
                        .replace(' ', '-')}`}
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
              {upcomingExpiries.map((contract) => (
                <TableRow key={contract.serialNumber}>
                  <TableCell>{contract.deviceName}</TableCell>
                  <TableCell className="link-cell">{contract.serialNumber}</TableCell>
                  <TableCell>{contract.facility}</TableCell>
                  <TableCell>
                    <Chip
                      label={contract.contractType}
                      className={`chip ${contract.contractType.toLowerCase()}`}
                    />
                  </TableCell>
                  <TableCell>{contract.expiryDate}</TableCell>
                  <TableCell>{getDaysRemaining(contract.expiryDate)}</TableCell>
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
