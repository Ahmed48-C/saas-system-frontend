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
        updateSelectedWithIds('transfers', ids, setIds, handleSelected, handleNumSelected);
    }, [ids.transfers]);

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

const Row = ({
    row,
    anchorEl,
    setAnchorEl,
    currentRowId,
    handlePopperClick,
    setCurrentRowId,
    fetchRecords,
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

    const handleDeleteClick = (id) => {
        const successCallback = (data) => {
            toast.success('Deleted Transfer Successfully');
        };

        handleDeleteRecord(row.id, API_ENDPOINTS.DELETE_TRANSFER, fetchRecords, successCallback, (error) => {
            HandleTableErrorCallback(error, 'Transfer', ids, setIds); // Pass the error and entity name to the reusable function
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
                            onClick={() => setOpenConfirmDialog(true)}
                        >
                            <span className="btn-wrapper--icon">
                            <DeleteIcon fontSize='small' />
                            </span>
                        </Button>
                    </Tooltip>
                </ButtonGroup>
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

export default TableContent