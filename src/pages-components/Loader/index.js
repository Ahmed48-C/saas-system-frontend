import React from 'react';
import { MoonLoader } from 'react-spinners';

const Loader = () => {
  return (
    <tr>
      <td colSpan="100%">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: '100%', height: '110px' }}
        >
          <MoonLoader color={'var(--primary)'} loading={true} size={50} />
        </div>
      </td>
    </tr>
  );
}

export default Loader;