export function exportContractsToCSV(contracts) {
  const headers = ['Device Name', 'Serial Number', 'Facility', 'Contract Type', 'Start Date', 'Expiry Date'];
  const rows = contracts.map(c => [
    c.deviceName,
    c.serialNumber,
    c.facility,
    c.contractType,
    c.startDate,
    c.expiryDate
  ]);

  let csvContent = 'data:text/csv;charset=utf-8,'
    + headers.join(',') + '\n'
    + rows.map(row => row.join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'contracts_report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
