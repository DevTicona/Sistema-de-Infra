// SistemasListStyles.js
const styles = {
  container: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: '16px',
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    backgroundColor: '#1976d2',
    color: 'white',
    fontWeight: 'bold',
  },
  tableSortLabel: {
    color: 'white',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    color: '#1976d2',
  },
  iconButtonDelete: {
    color: '#d32f2f',
  },
  dialogTitle: {
    backgroundColor: '#1976d2',
    color: 'white',
  },
  dialogActions: {
    padding: '16px',
  },
  cancelButton: {
    color: '#1976d2',
  },
  deleteButton: {
    boxShadow: 'none',
  },
}

export default styles
