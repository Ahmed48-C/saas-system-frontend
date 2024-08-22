import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Checkbox, Fade, lighten, makeStyles, Popper, TableRow } from '@material-ui/core';
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

const TableContent = ({
    fetchSuppliers,
    loading,
    suppliers,
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
    updateSelectedWithIds('suppliers', ids, setIds, handleSelected, handleNumSelected);
  }, [ids.suppliers]);

  useEffect(() => {
    if (suppliers && suppliers.data && suppliers.data.length > 0) {
        const allIds = suppliers.data.map(supplier => supplier.id);

        if (selected.length === allIds.length) {
            handleIsSelectedAll(true);
        } else {
            handleIsSelectedAll(false);
        }
    }
  }, [suppliers, selected]);


  return loading ? (
    <Loader />
  ) : (
    suppliers.data.map((row, index) => (
      <SupplierRow
        key={index}
        row={row}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        currentRowId={currentRowId}
        handlePopperClick={handlePopperClick}
        fetchSuppliers={fetchSuppliers}
        setCurrentRowId={setCurrentRowId}
        handleCheckboxChange={(id) => handleCheckboxChange(id, selected, handleSelected, handleNumSelected, suppliers, handleIsSelectedAll)}
        isSelected={selected.includes(row.id)}
        dense={dense}
        columns={columns}
      />
    ))
  );
};

const SupplierRow = ({
  row,
  anchorEl,
  setAnchorEl,
  currentRowId,
  handlePopperClick,
  fetchSuppliers,
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

  const handleButtonClick = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  const handleEditClick = (id) => {
    history.push(`/supplier/edit/${id}`);
    handleButtonClick();
  };

  const handleDeleteClick = (id) => {
    const successCallback = (data) => {
      toast.success('Deleted Supplier Successfully');
    };

    handleDeleteRecord(id, API_ENDPOINTS.DELETE_SUPPLIER, fetchSuppliers, successCallback, (error) => {
      HandleTableErrorCallback(error, 'Supplier', ids, setIds); // Pass the error and entity name to the reusable function
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
        {columns.filter(column => column.selected).map((column, index) => (
          <td key={index}>{row[column.name]}</td>
        ))}
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
                    <ButtonGroup
                      orientation="vertical"
                      color="primary"
                      aria-label="vertical outlined primary button group"
                      variant="contained"
                    >
                      <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
                      <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteClick(row.id)}>Delete</Button>
                      </ButtonGroup>
                </div>
              </Fade>
            )}
          </Popper>
        </td>
      </TableRow>
    </>
  );
};

export default TableContent