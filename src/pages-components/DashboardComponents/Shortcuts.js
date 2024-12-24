import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  Grid, 
  Card, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  IconButton,
  Tooltip,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative'
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.12)'
  },
  shortcutsGrid: {
    position: 'relative',
    '& .MuiGrid-container': {
      position: 'relative'
    }
  },
  shortcutItem: {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '1px',
      backgroundColor: 'rgba(0, 0, 0, 0.12)'
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '1px',
      backgroundColor: 'rgba(0, 0, 0, 0.12)'
    },
    '&:nth-child(3n)::after': {
      display: 'none'
    },
    '&:nth-last-child(-n+3):not(:last-child)::before': {
      display: 'block'
    },
    '&:last-child::before': {
      display: 'block',
      borderTop: '1px solid rgba(0, 0, 0, 0.02)'
    }
  },
  shortcutButton: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.02)'
    }
  },
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  footer: {
    padding: '16px 24px',
  
  }
}));

const Shortcuts = () => {
  const history = useHistory();
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedShortcuts, setSelectedShortcuts] = useState([]);

  const allShortcuts = [
    {
      id: 'customer',
      title: 'New Customer',
      icon: ['far', 'user'],
      color: 'primary',
      path: '/ui/customer/create',
      editPath: '/ui/customers'
    },
    {
      id: 'supplier',
      title: 'New Supplier',
      icon: ['far', 'building'],
      color: 'first',
      path: '/ui/supplier/create',
      editPath: '/ui/suppliers'
    },
    {
      id: 'sale',
      title: 'New Sale Order',
      icon: ['fas', 'shopping-cart'],
      color: 'success',
      path: '/ui/sale-order/create',
      editPath: '/ui/sale-orders'
    },
    {
      id: 'purchase',
      title: 'New Purchase',
      icon: ['fas', 'cart-plus'],
      color: 'warning',
      path: '/ui/purchase-order/create',
      editPath: '/ui/purchase-orders'
    },
    {
      id: 'income',
      title: 'New Income',
      icon: ['fas', 'plus-circle'],
      color: 'success',
      path: '/ui/income/create',
      editPath: '/ui/incomes'
    },
    {
      id: 'expense',
      title: 'New Expense',
      icon: ['fas', 'minus-circle'],
      color: 'danger',
      path: '/ui/expense/create',
      editPath: '/ui/expenses'
    },
    {
      id: 'location',
      title: 'New Location',
      icon: ['fas', 'map-marker-alt'],
      color: 'info',
      path: '/ui/location/create',
      editPath: '/ui/locations'
    },
    {
      id: 'store',
      title: 'New Store',
      icon: ['fas', 'store'],
      color: 'primary',
      path: '/ui/store/create',
      editPath: '/ui/stores'
    },
    {
      id: 'product',
      title: 'New Product',
      icon: ['fas', 'box'],
      color: 'warning',
      path: '/ui/product/create',
      editPath: '/ui/products'
    },
    {
      id: 'invoice',
      title: 'New Invoice',
      icon: ['fas', 'file-invoice'],
      color: 'success',
      path: '/ui/invoice/create',
      editPath: '/ui/invoices'
    },
    {
      id: 'transfer',
      title: 'New Transfer',
      icon: ['fas', 'exchange-alt'],
      color: 'info',
      path: '/ui/transfer/create',
      editPath: '/ui/transfers'
    },
    {
      id: 'balance',
      title: 'New Balance',
      icon: ['fas', 'wallet'],
      color: 'primary',
      path: '/ui/balance/create',
      editPath: '/ui/balances'
    }
  ];

  // Load selected shortcuts from localStorage on mount
  useEffect(() => {
    const savedShortcuts = localStorage.getItem('dashboardShortcuts');
    if (savedShortcuts) {
      setSelectedShortcuts(JSON.parse(savedShortcuts));
    } else {
      // Default to first 6 shortcuts if nothing is saved
      setSelectedShortcuts(allShortcuts.slice(0, 6).map(s => s.id));
    }
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleShortcutToggle = (shortcutId) => {
    setSelectedShortcuts(prev => {
      if (prev.includes(shortcutId)) {
        return prev.filter(id => id !== shortcutId);
      } else {
        if (prev.length >= 6) {
        //   toast.error('Maximum 6 shortcuts can be selected');
          return prev;
        }
        return [...prev, shortcutId];
      }
    });
  };

  const handleSaveSelection = () => {
    localStorage.setItem('dashboardShortcuts', JSON.stringify(selectedShortcuts));
    // toast.success('Dashboard shortcuts updated successfully');
    setOpenEditDialog(false);
  };

  const visibleShortcuts = allShortcuts.filter(shortcut => 
    selectedShortcuts.includes(shortcut.id)
  );

  const ShortcutButton = ({ shortcut }) => {
    const classes = useStyles();
    return (
      <Button
        variant="outlined"
        className={`${classes.shortcutButton} d-block btn-outline-${shortcut.color} border-0 w-100`}
        onClick={() => history.push(shortcut.path)}>
        <span className="font-size-xxl d-block">
          <FontAwesomeIcon icon={shortcut.icon} />
        </span>
        <span className="text-uppercase font-weight-bold font-size-xs">
          {shortcut.title}
        </span>
      </Button>
    );
  };

  return (
    <>
      <Card className={classes.card}>
        <div className={classes.gridMenu}>
          <div className={classes.header}>
            <div className="d-flex align-items-center justify-content-between w-100">
              <Typography variant="h5">Shortcuts</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenEditDialog(true)}
                startIcon={<EditIcon />}>
                Customize
              </Button>
            </div>
          </div>
          <Grid container>
            {visibleShortcuts.map((shortcut, index) => (
              <Grid item xs={4} key={index} className={classes.shortcutItem}>
                <ShortcutButton shortcut={shortcut} />
              </Grid>
            ))}
          </Grid>
          <div className={classes.footer}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setOpenDialog(true)}>
              Show All Shortcuts
            </Button>
          </div>
        </div>
      </Card>

      {/* Show All Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="md"
        fullWidth>
        <DialogTitle>All Shortcuts</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {allShortcuts.map((shortcut, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ShortcutButton shortcut={shortcut} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Customize Dashboard Shortcuts</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Select up to 6 shortcuts to display on your dashboard
          </Typography>
          <Grid container spacing={1}>
            {allShortcuts.map((shortcut) => (
              <Grid item xs={12} sm={6} key={shortcut.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedShortcuts.includes(shortcut.id)}
                      onChange={() => handleShortcutToggle(shortcut.id)}
                      color="primary"
                    />
                  }
                  label={
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={shortcut.icon} className="mr-2" />
                      <span>{shortcut.title}</span>
                    </div>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="default">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSelection} 
            color="primary"
            disabled={selectedShortcuts.length === 0}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Shortcuts;