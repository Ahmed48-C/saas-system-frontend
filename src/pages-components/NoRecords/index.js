import React from 'react'

const NoRecords = ({ context }) => {
    return (
      <tr>
        <td colSpan="100%">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: '100%', height: '110px' }}
          >
            <div className="app-page-title--heading">
              <h1>No {context} Found</h1>
            </div>
          </div>
        </td>
      </tr>
    );
  }

export default NoRecords;