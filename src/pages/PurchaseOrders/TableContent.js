import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Checkbox, Collapse, Fade, IconButton, Popper, TableRow, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../pages-components';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
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
    updateSelectedWithIds('purchase_orders', ids, setIds, handleSelected, handleNumSelected);
  }, [ids.purchase_orders]);

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

  const handleButtonClick = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  const handleEditClick = (id) => {
    history.push(`/purchase-order/edit/${id}`);
    handleButtonClick();
  };

  const handleDeleteClick = (id, endpoint) => {
    const successCallback = (data) => {
      toast.success('Deleted Purchase Order Successfully');
    };

    handleDeleteRecord(id, endpoint, fetchRecords, successCallback, (error) => {
      HandleTableErrorCallback(error, 'Purchase Order', ids, setIds); // Pass the error and entity name to the reusable function
    });
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
        <td className="text-center">
          <Button
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
                  {row.status === 'Pending' ? (
                      <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                        variant="contained"
                      >
                        <Button className="px-1 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)} style={{ padding: '4px 8px' }}>Edit</Button>
                        <Button className="px-1 btn-icon hover-scale-sm text-white btn-danger" onClick={() => handleDeleteClick(row.id, API_ENDPOINTS.DELETE_PURCHASE_ORDER)} style={{ padding: '4px 8px' }}>Delete</Button>
                      </ButtonGroup>
                    ) : (
                      <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                        variant="contained"
                      >
                        <Button className="px-1 btn-icon hover-scale-sm text-white btn-danger" onClick={() => handleDeleteClick(row.id, API_ENDPOINTS.DELETE_PURCHASE_ORDER)} style={{ padding: '4px 8px' }}>Delete & Keep Stock</Button>
                        <Button className="px-1 btn-icon hover-scale-sm text-white btn-danger" onClick={() => handleDeleteClick(row.id, API_ENDPOINTS.DELETE_PURCHASE_ORDER_STOCK)} style={{ padding: '4px 8px' }}>Delete & Remove Stock</Button>
                      </ButtonGroup>
                    )}
                </div>
              </Fade>
            )}
          </Popper>
          {/* {row.status === 'Pending' ? (
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
                  onClick={() => handleDeleteClick(row.id)}
                >
                  <span className="btn-wrapper--icon">
                    <DeleteIcon fontSize='small' />
                  </span>
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  style={{ minWidth: '32px', minHeight: '32px', paddingRight: '6px', paddingLeft: '5px' }}
                  variant="contained"
                  size="small"
                  className="btn-primary text-white btn-info"
                  onClick={() => handleEditClick(row.id)}
                >
                  <span className="btn-wrapper--icon">
                    <EditIcon fontSize='small' />
                  </span>
                </Button>
              </Tooltip>
            </ButtonGroup>
          ) : (
            <>
              <Button
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
                        <Button className="px-1 btn-icon hover-scale-sm text-white btn-danger" onClick={() => handleDeleteClick(row.id, API_ENDPOINTS.DELETE_PURCHASE_ORDER)} style={{ padding: '4px 8px' }}>Delete & Keep Stock</Button>
                        <Button className="px-1 btn-icon hover-scale-sm text-white btn-danger" onClick={() => handleDeleteClick(row.id, API_ENDPOINTS.DELETE_PURCHASE_ORDER_STOCK)} style={{ padding: '4px 8px' }}>Delete & Remove Stock</Button>
                      </ButtonGroup>
                    </div>
                  </Fade>
                )}
              </Popper>
            </>
          )} */}
        </td>
      </TableRow>
    </>
  );
};

export default TableContent;