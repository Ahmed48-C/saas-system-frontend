import React from 'react';
import { TableSortLabel } from '@material-ui/core';

const TableHeading = ({ order, orderBy, onRequestSort, headers, columns }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <tr>
      {/* {headers.map((header, index) => (
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
          )} */}
          <th className='bg-white text-center'>
          </th>
        {columns.filter(column => column.selected).map((column, index) => (
          <th key={index} className={column.className}>
              <TableSortLabel
                  active={orderBy === column.name}
                  direction={orderBy === column.name ? order : 'asc'}
                  onClick={createSortHandler(column.name)}
              >
                  {column.label}
              </TableSortLabel>
          </th>
        ))}
        <th className='bg-white text-center'>
          Actions
        </th>
    </tr>
  );
};

export default TableHeading;
