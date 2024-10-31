import React, { useEffect, useState } from 'react'
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
import EditIcon from '@material-ui/icons/Edit';

const TableContent = ({
    fetchLocations,
    loading,
    locations,
    handleNumSelected,
    selected,
    handleSelected,
    handleIsSelectedAll,
    dense,
    columns,
}) => {
    const [active, setActive] = useState(true);
    const [isDefault, setIsDefault] = useState(false);
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
      updateSelectedWithIds('locations', ids, setIds, handleSelected, handleNumSelected);
    }, [ids.locations]);

    useEffect(() => {
      if (locations && locations.data && locations.data.length > 0) {
          const allIds = locations.data.map(supplier => supplier.id);

          if (selected.length === allIds.length) {
              handleIsSelectedAll(true);
          } else {
              handleIsSelectedAll(false);
          }
      }
    }, [locations, selected]);

    return loading ? (
      <Loader />
    ) : (
      locations.data.map((row, index) => (
        <LocationRow
          key={index}
          row={row}
          active={active}
          setActive={setActive}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          currentRowId={currentRowId}
          handlePopperClick={handlePopperClick}
          fetchLocations={fetchLocations}
          setCurrentRowId={setCurrentRowId}
          handleCheckboxChange={(id) => handleCheckboxChange(id, selected, handleSelected, handleNumSelected, locations, handleIsSelectedAll)}
          isSelected={selected.includes(row.id)}
          dense={dense}
          columns={columns}
        />
      ))
    );
  };

  const LocationRow = ({
    row,
    active,
    isDefault,
    setActive,
    anchorEl,
    setAnchorEl,
    currentRowId,
    handlePopperClick,
    setCurrentRowId,
    fetchLocations,
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
      history.push(`/location/edit/${id}`);
      handleButtonClick();
    };

    const handleActivateClick = () => {
      setActive(true);
      handleButtonClick();
    };

    const handleDeactivateClick = () => {
      setActive(false);
      handleButtonClick();
    };

    const handleDefaultClick = () => {
      handleButtonClick();
    };

    const handleDeleteClick = (id) => {
      const successCallback = (data) => {
        toast.success('Deleted Location Successfully');
      };

      handleDeleteRecord(id, API_ENDPOINTS.DELETE_LOCATION, fetchLocations, successCallback, (error) => {
        HandleTableErrorCallback(error, 'Location', ids, setIds); // Pass the error and entity name to the reusable function
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
                    {active && isDefault && (
                      <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                        variant="contained"
                      >
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
                      </ButtonGroup>
                    )}

                    {active && !isDefault && (
                      <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                        variant="contained"
                      >
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleDefaultClick}>Default</Button>
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white btn-danger" onClick={() => handleDeleteClick(row.id)}>Delete</Button>
                        <Button
                          className="d-30 px-5 btn-icon hover-scale-sm text-white"
                          onClick={handleDeactivateClick}
                        >
                          Deactivate
                        </Button>
                      </ButtonGroup>
                    )}

                    {!active && (
                      <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                        variant="contained"
                      >
                        <Button className="px-1 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)} style={{ padding: '4px 8px' }}>Edit</Button>
                        <Button className="px-1 btn-icon hover-scale-sm text-white btn-danger" onClick={() => handleDeleteClick(row.id)} style={{ padding: '4px 8px' }}>Delete</Button>
                        <Button
                          className="px-1 btn-icon hover-scale-sm text-white"
                          onClick={handleActivateClick}
                          style={{ padding: '4px 8px' }}
                        >
                          Activate
                        </Button>
                      </ButtonGroup>
                    )}
                  </div>
                </Fade>
              )}
            </Popper> */}
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
          </td>
        </TableRow>
      </>
    );
  };

export default TableContent