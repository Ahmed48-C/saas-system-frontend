import React from 'react'
import { MainTable } from '../pages-components'
import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const headers = [
  { key: 'ID', className: 'bg-white text-left' },
  { key: 'Requester', className: 'bg-white' },
  { key: 'Subject', className: 'bg-white text-left' },
  { key: 'Priority', className: 'bg-white text-center' },
  { key: 'Status', className: 'bg-white text-center' },
  { key: 'Created date', className: 'bg-white text-center' },
  { key: 'Due date', className: 'bg-white text-center' },
  { key: 'Actions', className: 'bg-white text-center' }
];

// Extract rows
const rows = [
  {
    ID: '#453',
    Requester: 'Shanelle Wynn',
    Subject: 'When, while the lovely valley teems',
    Priority: { className: 'badge badge-neutral-danger text-danger', text: 'High' },
    Status: { className: 'badge badge-neutral-dark text-dark', text: 'Closed' },
    Created: '12/12/2020',
    Due: '08/30/2021',
    Actions: '<Button size="small" className="btn-link d-30 p-0 btn-icon hover-scale-sm"><FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="font-size-lg" /></Button>'
  },
  {
    ID: '#584',
    Requester: 'Brody Dixon',
    Subject: 'I am so happy, my dear friend',
    Priority: { className: 'badge badge-neutral-warning text-warning', text: 'Low' },
    Status: { className: 'badge badge-neutral-success text-success', text: 'Open' },
    Created: '06/08/2022',
    Due: '07/25/2023',
    Actions: '<Button size="small" className="btn-link d-30 p-0 btn-icon hover-scale-sm"><FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="font-size-lg" /></Button>'
  },
  {
    ID: '#764',
    Requester: 'Milton Ayala',
    Subject: 'His own image, and the breath',
    Priority: { className: 'badge badge-neutral-info text-info', text: 'Medium' },
    Status: { className: 'badge badge-neutral-dark text-dark', text: 'Closed' },
    Created: '12/12/2020',
    Due: '08/30/2021',
    Actions: '<Button size="small" className="btn-link d-30 p-0 btn-icon hover-scale-sm"><FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="font-size-lg" /></Button>'
  },
  {
    ID: '#453',
    Requester: 'Kane Gentry',
    Subject: 'When I hear the buzz',
    Priority: { className: 'badge badge-neutral-warning text-warning', text: 'Low' },
    Status: { className: 'badge badge-neutral-success text-success', text: 'Open' },
    Created: '12/12/2020',
    Due: '08/30/2021',
    Actions: '<Button size="small" className="btn-link d-30 p-0 btn-icon hover-scale-sm"><FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="font-size-lg" /></Button>'
  }
];

const Dashboard = () => {
  const tableContent = rows.map((row, index) =>(
    <tr key={index}>
      <td className="font-weight-bold">{row.ID}</td>
      <td>
        <div className="d-flex align-items-center">
          <div>{row.Requester}</div>
        </div>
      </td>
      <td>{row.Subject}</td>
      <td className="text-center">
        <div className={row.Priority.className}>
        {row.Priority.text}
        </div>
      </td>
      <td className="text-center">
        <div className={row.Status.className}>
        {row.Priority.text}
        </div>
      </td>
      <td className="text-center text-black-50">{row.Created}</td>
      <td className="text-center text-black-50">{row.Due}</td>
      <td className="text-center">
        <Button
          size="small"
          className="btn-link d-30 p-0 btn-icon hover-scale-sm">
          <FontAwesomeIcon
            icon={['fas', 'ellipsis-h']}
            className="font-size-lg"
          />
        </Button>
      </td>
    </tr>
  ))
  

  return (
    <>
      <MainTable headers={headers} tableContent={tableContent} />
    </>
  )
}

export default Dashboard