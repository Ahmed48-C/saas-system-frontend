import { Divider, Grid } from '@material-ui/core'
import React from 'react'
import Shortcuts from '../pages-components/DashboardComponents/Shortcuts'
import Tasks from '../pages-components/DashboardComponents/Tasks'
import IncomeExpenseAnalysis from '../pages-components/DashboardComponents/IncomeExpenseAnalysis'
import SalesCompletedAnalysis from '../pages-components/DashboardComponents/SalesCompletedAnalysis'
import TotalInStock from '../pages-components/DashboardComponents/TotalInStock'
import TotalBalance from '../pages-components/DashboardComponents/TotalBalance'

const Dashboard = () => {
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <h2>Your Company</h2>
          <Divider style={{ marginTop: '8px', marginBottom: '24px' }} />
        </Grid>

        {/* Main Financial Analysis */}
        <Grid item xs={12}>
          <IncomeExpenseAnalysis />
        </Grid>

        {/* Key Metrics Row */}
        <Grid item xs={12} md={6}>
          <TotalBalance />
        </Grid>
        <Grid item xs={12} md={6}>
          <TotalInStock />
        </Grid>

        {/* Main Content Row */}
        <Grid item xs={12} lg={6}>
          <SalesCompletedAnalysis />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Shortcuts />
            </Grid>
            <Grid item xs={12}>
              <Tasks />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard