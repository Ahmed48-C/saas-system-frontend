import React, { useState } from 'react'
import axios from "axios";
import { Button, ButtonGroup, Fade, Popper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../pages-components';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import handleDeleteRecord from '../../functions/pages/handleDeleteRecord';

const TableContent = ({
    fetchSuppliers,
    loading,
    suppliers
}) => {

    // const handleDeleteClick = (id) => {
    //   let url = API_ENDPOINTS.DELETE_SUPPLIER(id);

    //   axios.delete(url)
    //     .then(response => {
    //       console.log('Delete request successful:', response.data);
    //       fetchSuppliers();
    //       // setTimeout(() =>

    //       // 1500);
    //     })
    //     .catch(error => {
    //       console.error('Error deleting supplier:', error);
    //     });
    // };

    return loading ? (
      <Loader />
    ) : (
      suppliers.data.map((row, index) => (
        <SupplierRow
          key={index}
          row={row}
          handleDeleteRecord={() => handleDeleteRecord(row.id, API_ENDPOINTS.DELETE_SUPPLIER, fetchSuppliers)}
        />
      ))
    );
  };

  const SupplierRow = ({ row, handleDeleteRecord }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();

    const handlePopperClick = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;

    const handleButtonClick = () => {
      setAnchorEl(null);
    };

    const handleEditClick = (id) => {
      history.push(`/supplier/edit/${id}`);
      handleButtonClick();
    };

    return (
      <>
        <tr>
          <td>{row.name}</td>
          <td>{row.phone}</td>
          <td>{row.email}</td>
          <td className="text-center">
            <Button
              size="small"
              className="btn-link d-30 p-0 btn-icon hover-scale-sm"
              onClick={handlePopperClick}
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
                        {/* <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteRecord(row.id)}>Delete</Button> */}
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteRecord()}>Delete</Button>
                      </ButtonGroup>
                  </div>
                </Fade>
              )}
            </Popper>
          </td>
        </tr>
      </>
    );
  };

export default TableContent