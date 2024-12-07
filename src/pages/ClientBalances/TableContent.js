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
import EditIcon from '@material-ui/icons/Edit';
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
    updateSelectedWithIds('client_balances', ids, setIds, handleSelected, handleNumSelected);
  }, [ids.client_balances]);

  useEffect(() => {
    if (records && records.data && records.data.length > 0) {
        const allIds = records.data.map(location => location.id);

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

  const history = useHistory();
  const open = Boolean(anchorEl) && currentRowId === row.id;
  const id = open ? 'transitions-popper' : undefined;
  const classes = selectedRowStyles();
  const { ids, setIds } = UseIDs();

  const handleButtonClick = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  return (
    <>
      <TableRow
        className={clsx(isSelected && classes.highlight)}
      >
        {columns.filter(column => column.selected).map((column, index) => (
          <td key={index}>{row[column.name]}</td>
        ))}
      </TableRow>
    </>
  );
};

export default TableContent;