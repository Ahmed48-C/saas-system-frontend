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
import EditIcon from '@material-ui/icons/Edit';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ConfirmDelete from '../../pages-components/ConfirmDelete';

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
    updateSelectedWithIds('completed_sale_orders', ids, setIds, handleSelected, handleNumSelected);
  }, [ids.completed_sale_orders]);

  useEffect(() => {
    if (records && records.data && records.data.length > 0) {
        const allIds = records.data.map(record => record.id);

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

  const history = useHistory();
  const open = Boolean(anchorEl) && currentRowId === row.id;
  const id = open ? 'transitions-popper' : undefined;
  const classes = selectedRowStyles();
  const { ids, setIds } = UseIDs();

  const [expandedRow, setExpandedRow] = useState(null);

  const handleExpandClick = (index) => {
    // Toggle open state for the clicked row, close others
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleCreateInvoice = () => {
    try {
      // Store the sale order data in localStorage
      const invoiceData = {
        customer: row.customer,
        items: row.items.map(item => ({
          product: item.product,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          total: parseFloat(item.total)
        })),
        total: parseFloat(row.total),
        sale_order_code: row.code
      };

      // Store in localStorage
      localStorage.setItem('pendingInvoiceData', JSON.stringify(invoiceData));

      // Navigate to invoice creation page
      history.push('/ui/invoice/create');
    } catch (error) {
      console.error('Error preparing invoice data:', error);
      toast.error('Error preparing invoice data: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <>
      <TableRow
        className={clsx(isSelected && classes.highlight)}
      >
        {/* <td style={{ width: '50px' }}>
          <Checkbox
            checked={isSelected}
            onChange={() => handleCheckboxChange(row.id)}
          />
        </td> */}
        {columns.filter(column => column.selected).map((column, index) => {
          const value = row[column.name];

          if (column.name === 'status') {
            return (
              <td key={index}>
                <div className={`badge h-auto py-0 px-3 ${value === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                  {value}
                </div>
              </td>
            );
          } else if (column.name === 'items' && Array.isArray(value)) {
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
          } else {
            return <td key={index}>{value}</td>;
          }
        })}
        <td>
          <ButtonGroup variant="text" aria-label="text primary button group">
            <Tooltip title="Create Invoice">
              <Button
                variant="contained"
                size="small"
                className="btn-primary"
                onClick={handleCreateInvoice}
              >
                <ReceiptIcon />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </td>
      </TableRow>
    </>
  );
};

export default TableContent;