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
        updateSelectedWithIds('balances', ids, setIds, handleSelected, handleNumSelected);
    }, [ids.balances]);

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
            toast.success('Deleted Balance Successfully');
        };

        handleDeleteRecord(id, API_ENDPOINTS.DELETE_BALANCE, fetchRecords, successCallback, (error) => {
            HandleTableErrorCallback(error, 'Balance', ids, setIds); // Pass the error and entity name to the reusable function
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
                            <Button className="px-1 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteClick(row.id)} style={{ padding: '4px 8px' }}>Delete</Button>
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