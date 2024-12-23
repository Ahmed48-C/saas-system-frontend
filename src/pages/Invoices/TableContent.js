import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Checkbox, Collapse, Fade, IconButton, Popper, TableRow, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../pages-components';
import { useHistory } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis';
import handleDeleteRecord from '../../functions/pages/handleDeleteRecord';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import HandleTableErrorCallback from '../../functions/pages/HandleTableErrorCallback';
import { UseIDs } from '../../config/SelectedIdsContext'
import { updateSelectedWithIds } from '../../functions/pages/updateSelectedWithIds';
import { handleCheckboxChange } from '../../functions/pages/handleCheckboxChange';
import { selectedRowStyles } from '../../theme/selectedRowStyles';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmDelete from '../../pages-components/ConfirmDelete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import InvoicePaper from './InvoicePaper';

const TableContent = ({
  fetchRecords,
  loading,
  records,
  handleNumSelected,
  selected,
  handleSelected,
  handleIsSelectedAll,
  dense,
  columns,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRowId, setCurrentRowId] = useState(null);
  const { ids, setIds } = UseIDs();

  const handlePopperClick = (event, rowId) => {
    if (currentRowId === rowId) {
      setAnchorEl(null);
      setCurrentRowId(null);
    } else {
      setAnchorEl(event.currentTarget);
      setCurrentRowId(rowId);
    }
  };

  useEffect(() => {
    updateSelectedWithIds('invoices', ids, setIds, handleSelected, handleNumSelected);
  }, [ids.invoices]);

  useEffect(() => {
    if (records && records.data && records.data.length > 0) {
        const allIds = records.data.map(supplier => supplier.id);

        if (selected.length === allIds.length) {
            handleIsSelectedAll(true);
        } else {
            handleIsSelectedAll(false);
        }
    }
  }, [records, selected]);

  return loading ? (
    <Loader />
  ) : (
    records.data.map((row, index) => (
      <Row
        key={index}
        row={row}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        currentRowId={currentRowId}
        handlePopperClick={handlePopperClick}
        fetchRecords={fetchRecords}
        setCurrentRowId={setCurrentRowId}
        handleCheckboxChange={(id) => handleCheckboxChange(id, selected, handleSelected, handleNumSelected, records, handleIsSelectedAll)}
        isSelected={selected.includes(row.id)}
        dense={dense}
        columns={columns}
      />
    ))
  );
};

const CollapsibleRow = ({ product, details, isOpen, onExpand }) => {
  return (
    <div style={{ marginBottom: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{product}</span>
        <IconButton size="small" onClick={onExpand}>
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <div style={{ paddingLeft: '16px' }}>
          <p>Price: {details.price}</p>
          <p>Quantity: {details.quantity}</p>
          <p>Total: {details.total}</p>
        </div>
      </Collapse>
    </div>
  );
};

const Row = ({
  row,
  anchorEl,
  setAnchorEl,
  currentRowId,
  handlePopperClick,
  fetchRecords,
  setCurrentRowId,
  handleCheckboxChange,
  isSelected,
  dense,
  columns,
}) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false); // State to track zoom
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);

  const handleImageClick = () => {
    setIsImageZoomed(!isImageZoomed); // Toggle zoom state on click
  };

  const history = useHistory();
  const open = Boolean(anchorEl) && currentRowId === row.id;
  const id = open ? 'transitions-popper' : undefined;
  const classes = selectedRowStyles();
  const { ids, setIds } = UseIDs();

  const [expandedRow, setExpandedRow] = useState(null);

  const [deleteType, setDeleteType] = useState(""); // Track which delete action is being confirmed

  const handleExpandClick = (index) => {
    // Toggle open state for the clicked row, close others
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleButtonClick = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  const handleEditClick = (id) => {
    history.push(`/ui/invoice/edit/${id}`);
    handleButtonClick();
  };

  // const handleDeleteClick = (id, endpoint) => {
  const handleDeleteClick = (endpoint) => {
    const successCallback = (data) => {
      toast.success('Deleted Invoice Successfully');
    };

    handleDeleteRecord(row.id, API_ENDPOINTS.DELETE_INVOICE, fetchRecords, successCallback, (error) => {
      HandleTableErrorCallback(error, 'Invoice', ids, setIds); // Pass the error and entity name to the reusable function
    });
  };

  const handleInvoiceClick = (id) => {
    setOpenInvoiceDialog(true);
  };

  const handleCloseInvoiceDialog = () => {
    setOpenInvoiceDialog(false);
  };

  return (
    <>
      <TableRow
        className={clsx(isSelected && classes.highlight)}
      >
        <td style={{ width: '50px' }}>
          <Checkbox
            checked={isSelected}
            onChange={() => handleCheckboxChange(row.id)}
          />
        </td>
        {columns.filter(column => column.selected).map((column, index) => {
          const value = row[column.name];

          if (column.name === 'items' && Array.isArray(value)) {
            // Handle the case where column.name is 'items' and the value is an array
            return (
              <td key={index}>
                {value.map((item, i) => (
                  <CollapsibleRow
                    key={i}
                    index={i}
                    product={item.product}
                    details={item}
                    isOpen={expandedRow === i}
                    onExpand={() => handleExpandClick(i)}
                  />
                ))}
              </td>
            );
          } else if (column.name === 'attachment_file' && row[column.name]) {
            return (
              <td key={index}>
                <img
                  src={row[column.name]}
                  alt={`${row.name || 'Attachment'}`}
                  onClick={handleImageClick}
                  onError={(e) => { e.target.style.display = 'none'; }} // Hide attachment if error
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Add transition for box-shadow
                    transform: isImageZoomed ? 'scale(2.4)' : 'scale(1)', // Zoom effect
                    boxShadow: isImageZoomed ? '0 4px 8px rgba(0, 0, 0, 0.6)' : 'none', // Apply shadow when zoomed
                    zIndex: isImageZoomed ? 9999 : 'auto', // Ensure it pops over other elements
                    position: isImageZoomed ? 'relative' : 'static', // Make it relative for z-index to work
                    borderRadius: '3px', // Consistent border radius
                  }}
                />
              </td>
            );
          } else {
            return <td key={index}>{value}</td>;
          }
        })}
        <td className="text-center">
          {/* <Button startIcon={<DeleteIcon />} className="px-2 btn-icon hover-scale-sm text-white btn-danger" onClick={() => handleDeleteClick(row.id)} style={{ padding: '4px 8px' }}>Delete</Button> */}
          <ButtonGroup
            orientation="horizontal"
            color="secondary"
            variant="contained"
          >
            <Tooltip title="Delete">
                <Button
                  style={{ minWidth: '32px', minHeight: '32px', paddingRight: '6px', paddingLeft: '5px' }}
                  variant="contained"
                  size="small"
                  className="btn-primary text-white btn-danger"
                  // onClick={() => handleDeleteClick(row.id)}
                  onClick={() => setOpenConfirmDialog(true)}
                >
                  <span className="btn-wrapper--icon">
                    <DeleteIcon fontSize='small' />
                  </span>
                </Button>
            </Tooltip>
            <Tooltip title="Print">
                <Button
                  style={{ minWidth: '32px', minHeight: '32px', paddingRight: '6px', paddingLeft: '5px' }}
                  variant="contained"
                  size="small"
                  className="btn-primary text-white btn-info"
                  onClick={() => handleInvoiceClick(row.id)}
                >
                  <span className="btn-wrapper--icon">
                    <PrintIcon fontSize='small' />
                  </span>
                </Button>
            </Tooltip>
          </ButtonGroup>
          {/* <Button
            size="small"
            className="btn-link d-30 p-0 btn-icon hover-scale-sm"
            onClick={(event) => handlePopperClick(event, row.id)}
          >
            <FontAwesomeIcon
              icon={['fas', 'ellipsis-h']}
              className="font-size-lg"
            />
          </Button>
          <Popper id={id} open={open} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <div>
                  <ButtonGroup
                    orientation="vertical"
                    color="primary"
                    aria-label="vertical outlined primary button group"
                    variant="contained"
                  >
                    <Button className="px-1 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteClick(row.id)} style={{ padding: '4px 8px' }}>Delete</Button>
                  </ButtonGroup>
                </div>
              </Fade>
            )}
          </Popper> */}
        </td>
      </TableRow>
      <ConfirmDelete
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        handleDeleteClick={handleDeleteClick}
      />
      <Dialog
        open={openInvoiceDialog}
        onClose={handleCloseInvoiceDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <InvoicePaper invoiceId={row.id} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableContent;