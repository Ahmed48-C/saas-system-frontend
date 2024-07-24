import React, { useState } from 'react'
import { Button, ButtonGroup, Checkbox, Fade, lighten, makeStyles, Popper, TableRow } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../pages-components';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import handleDeleteRecord from '../../functions/pages/handleDeleteRecord';
import clsx from 'clsx';

const TableContent = ({
    fetchSuppliers,
    loading,
    suppliers,
    handleNumSelected,
    selected,
    handleSelected,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRowId, setCurrentRowId] = useState(null);

  const handlePopperClick = (event, rowId) => {
    if (currentRowId === rowId) {
      setAnchorEl(null);
      setCurrentRowId(null);
    } else {
      setAnchorEl(event.currentTarget);
      setCurrentRowId(rowId);
    }
  };

  const handleCheckboxChange = (id) => {
    const currentIndex = selected.indexOf(id);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    handleSelected(newSelected);
    handleNumSelected(newSelected.length);
  };

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
        handleCheckboxChange={handleCheckboxChange}
        isSelected={selected.indexOf(row.id) !== -1}
      />
    ))
  );
};

const useToolbarStyles = makeStyles((theme) => ({
  highlight:
    theme.palette.type === 'light'
      ? {
          // color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          // color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
}));

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
  }) => {
  const history = useHistory();
  const open = Boolean(anchorEl) && currentRowId === row.id;
  const id = open ? 'transitions-popper' : undefined;
  const classes = useToolbarStyles();

  const handleButtonClick = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  const handleEditClick = (id) => {
    history.push(`/supplier/edit/${id}`);
    handleButtonClick();
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
        <td>{row.name}</td>
        <td>{row.phone}</td>
        <td>{row.email}</td>
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
                      <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteRecord(row.id, API_ENDPOINTS.DELETE_PRODUCT, fetchSuppliers)}>Delete</Button>
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