import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Checkbox, Fade, Popper, TableRow, Tooltip } from '@material-ui/core';
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
import DeleteIcon from '@material-ui/icons/Delete';
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
    updateSelectedWithIds('incomes', ids, setIds, handleSelected, handleNumSelected);
  }, [ids.incomes]);

  useEffect(() => {
    if (records && records.data && records.data.length > 0) {
        const allIds = records.data.map(balance => balance.id);

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

  const handleImageClick = () => {
    setIsImageZoomed(!isImageZoomed); // Toggle zoom state on click
  };

  const history = useHistory();
  const open = Boolean(anchorEl) && currentRowId === row.id;
  const id = open ? 'transitions-popper' : undefined;
  const classes = selectedRowStyles();
  const { ids, setIds } = UseIDs();

  const handleButtonClick = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  const handleDeleteClick = (id) => {
    const successCallback = (data) => {
      toast.success('Deleted Income Successfully');
    };

    // handleDeleteRecord(id, API_ENDPOINTS.DELETE_BALANCE_LOG, fetchRecords, successCallback, (error) => {
    handleDeleteRecord(row.id, API_ENDPOINTS.DELETE_INCOME, fetchRecords, successCallback, (error) => {
      HandleTableErrorCallback(error, 'Income', ids, setIds); // Pass the error and entity name to the reusable function
    });
  };

  if (row.type !== 'INCOME') {
    return null;
  }

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
          if (column.name === 'type') {
            return (
              <td key={index} className='text-success'>
                {row[column.name]}
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
            return (
              <td key={index}>
                {row[column.name]}
              </td>
            );
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
    </>
  );
};

export default TableContent;