export const useStyles = {
  container: {
    padding: '20px',
    maxWidth: '100%',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tableContainer: {
    borderRadius: '8px',
    marginTop: '20px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    minWidth: '700px',
  },
  tableHead: {
    backgroundColor: '#007bff',
    '& th': {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '14px',
    },
  },
  checkboxCell: {
    width: '50px',
  },
  tableCell: {
    fontSize: '14px',
    color: '#333',
    borderBottom: '1px solid #e0e0e0',
  },
  tableBody: {},
  tableRow: {
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  tableActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    textDecoration: 'none',
    padding: '6px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#2c3e50',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  deleteButton: {
    textDecoration: 'none',
    padding: '6px 12px',
    border: '1px solidrgb(185, 231, 60)',
    borderRadius: '4px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#c0392b',
    },
  },
}
