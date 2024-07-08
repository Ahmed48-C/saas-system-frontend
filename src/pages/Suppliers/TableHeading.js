import React from 'react';
import { TableSortLabel } from '@material-ui/core';

const TableHeading = ({ order, orderBy, onRequestSort, headers }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <tr>
      {headers.map((header, index) => (
        <th key={index} className={header.className}>
          {header.sortable !== false ? (
            <TableSortLabel
              active={orderBy === header.key}
              direction={orderBy === header.key ? order : 'asc'}
              onClick={createSortHandler(header.key)}
            >
              {header.label}
            </TableSortLabel>
          ) : (
            header.label
          )}
        </th>
      ))}
    </tr>
  );
};

export default TableHeading;
