import { Divider, Grid } from '@material-ui/core'
import React from 'react'
import Shortcuts from '../pages-components/DashboardComponents/Shortcuts'
import Tasks from '../pages-components/DashboardComponents/Tasks'

const Dashboard = () => {

  return (
    <>
      <Grid container spacing={4} style={{ width: '100%', margin: 0 }}>
        <Grid item xs={12}>
          <h2>Your Company</h2>
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ width: '100%', height: '2px' }} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Shortcuts />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Tasks />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard