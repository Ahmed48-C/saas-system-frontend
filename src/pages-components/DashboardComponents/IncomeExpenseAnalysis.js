import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, Button, Select, MenuItem, FormControl, IconButton } from '@material-ui/core';
import Chart from 'react-apexcharts';
import hero2 from '../../assets/images/hero-bg/hero-2.jpg';
import apiClient from '../../config/apiClient';
import { API_ENDPOINTS } from '../../config/apis';
import Loader from '../Loader';

const IncomeExpenseAnalysis = () => {
  const [timePeriod, setTimePeriod] = useState('current-month');
  const [incomeData, setIncomeData] = useState({ total_amount: 0, incomes: [] });
  const [expenseData, setExpenseData] = useState({ total_amount: 0, expenses: [] });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    options: {
      stroke: {
        curve: 'smooth',
        width: [0, 4]
      },
      chart: {
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: []
          },
          export: {
            svg: {
              filename: 'financial-analysis-svg',
            },
            png: {
              filename: 'financial-analysis-png',
            },
            csv: {
              filename: 'financial-analysis-csv',
              columnDelimiter: ',',
              headerCategory: 'Date',
              headerValue: 'Value',
            }
          },
          autoSelected: 'zoom'
        },
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true
        }
      },
      colors: ['rgba(60, 68, 177, 0.3)', '#3c44b1'],
      fill: {
        opacity: 1
      },
      labels: [],
      xaxis: {
        type: 'datetime'
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        strokeDashArray: '5',
        borderColor: 'rgba(125, 138, 156, 0.3)'
      },
      legend: {
        show: true
      }
    },
    series: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        apiClient.get(timePeriod === 'current-month' ? API_ENDPOINTS.GET_INCOME_CURRENT_MONTH() : API_ENDPOINTS.GET_INCOME_30_DAYS()),
        apiClient.get(timePeriod === 'current-month' ? API_ENDPOINTS.GET_EXPENSE_CURRENT_MONTH() : API_ENDPOINTS.GET_EXPENSE_30_DAYS())
      ]);

      const income = incomeResponse.data || { total_amount: 0, incomes: [] };
      const expense = expenseResponse.data || { total_amount: 0, expenses: [] };

      setIncomeData(income);
      setExpenseData(expense);

      // Process data for chart
      const dates = [...new Set([
        ...(income.incomes || []).map(item => item.date),
        ...(expense.expenses || []).map(item => item.date)
      ])].sort();

      const incomeByDate = {};
      const expenseByDate = {};
      
      dates.forEach(date => {
        incomeByDate[date] = 0;
        expenseByDate[date] = 0;
      });

      if (income.incomes && income.incomes.length > 0) {
        income.incomes.forEach(item => {
          incomeByDate[item.date] = item.amount;
        });
      }

      if (expense.expenses && expense.expenses.length > 0) {
        expense.expenses.forEach(item => {
          expenseByDate[item.date] = item.amount;
        });
      }

      setChartData(prev => ({
        options: {
          ...prev.options,
          labels: dates
        },
        series: [
          {
            name: 'Income',
            type: 'column',
            data: dates.map(date => incomeByDate[date])
          },
          {
            name: 'Expenses',
            type: 'line',
            data: dates.map(date => expenseByDate[date])
          }
        ]
      }));

    } catch (error) {
      console.error('Error fetching data:', error);
      setChartData(prev => ({
        ...prev,
        series: [
          { name: 'Income', type: 'column', data: [] },
          { name: 'Expenses', type: 'line', data: [] }
        ]
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timePeriod]);

  if (loading) {
    return (
      <Card className="card-box mb-spacing-6-x2">
        <Grid container spacing={0}>
          <Grid item xl={5}>
            <div className="hero-wrapper bg-composed-wrapper bg-sunrise-purple h-100 rounded br-xl-right-0" style={{ height: '500px' }}>
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--bg bg-second opacity-5 rounded br-xl-right-0" />
                <div className="bg-composed-wrapper--content p-5">
                  <div className="align-self-center px-4">
                    <div className="py-3">
                      <Card className="card-box shadow-lg border-success card-box-border-bottom rounded hover-scale-sm">
                        <div className="p-4 text-left">
                          <div className="display-3 text-success font-weight-bold">
                            $0.00
                          </div>
                          <div className="font-size-xxl font-weight-bold text-black">
                            Income
                          </div>
                        </div>
                      </Card>
                    </div>
                    <div className="py-3">
                      <Card className="card-box shadow-lg border-danger card-box-border-bottom rounded hover-scale-sm">
                        <div className="p-4 text-left">
                          <div className="display-3 text-danger font-weight-bold">
                            $0.00
                          </div>
                          <div className="font-size-xxl font-weight-bold text-black">
                            Expenses
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xl={7}>
            <div className="p-4">
              <div className="p-2 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                    Profit & Loss
                  </h6>
                </div>
                <div className="d-flex align-items-center">
                  <FormControl variant="outlined" style={{ minWidth: 150, marginRight: '10px' }}>
                    <Select
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value)}
                      className="text-sm">
                      <MenuItem value="current-month">Current Month</MenuItem>
                      <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    variant="contained"
                    disabled={true}
                    style={{ minWidth: '40px', padding: '6px' }}>
                    <FontAwesomeIcon
                      icon={['fas', 'sync']}
                      spin={true}
                      className="font-size-sm"
                    />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ height: '368px' }} className="d-flex align-items-center justify-content-center">
              <Loader />
            </div>
          </Grid>
        </Grid>
      </Card>
    );
  }

  if (!incomeData.incomes || !expenseData.expenses || (incomeData.incomes.length === 0 && expenseData.expenses.length === 0)) {
    return (
      <Card className="card-box mb-spacing-6-x2">
        <Grid container spacing={0}>
          <Grid item xl={5}>
            <div className="hero-wrapper bg-composed-wrapper bg-sunrise-purple h-100 rounded br-xl-right-0" style={{ height: '500px' }}>
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--bg bg-second opacity-5 rounded br-xl-right-0" />
                <div className="bg-composed-wrapper--content p-5">
                  <div className="align-self-center px-4">
                    <div className="py-3">
                      <Card className="card-box shadow-lg border-success card-box-border-bottom rounded hover-scale-sm">
                        <div className="p-4 text-left">
                          <div className="display-3 text-success font-weight-bold">
                            $0.00
                          </div>
                          <div className="font-size-xxl font-weight-bold text-black">
                            Income
                          </div>
                        </div>
                      </Card>
                    </div>
                    <div className="py-3">
                      <Card className="card-box shadow-lg border-danger card-box-border-bottom rounded hover-scale-sm">
                        <div className="p-4 text-left">
                          <div className="display-3 text-danger font-weight-bold">
                            $0.00
                          </div>
                          <div className="font-size-xxl font-weight-bold text-black">
                            Expenses
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xl={7}>
            <div className="p-4">
              <div className="p-2 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                    Profit & Loss
                  </h6>
                </div>
                <div className="d-flex align-items-center">
                  <FormControl variant="outlined" style={{ minWidth: 150, marginRight: '10px' }}>
                    <Select
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value)}
                      className="text-sm">
                      <MenuItem value="current-month">Current Month</MenuItem>
                      <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    variant="contained"
                    onClick={fetchData}
                    disabled={loading}
                    style={{ minWidth: '40px', padding: '6px' }}>
                    <FontAwesomeIcon
                      icon={['fas', 'sync']}
                      spin={loading}
                      className="font-size-sm"
                    />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ height: '368px' }} className="d-flex align-items-center justify-content-center">
              <div className="text-muted">No data available</div>
            </div>
          </Grid>
        </Grid>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-box mb-spacing-6-x2">
        <Grid container spacing={0}>
          <Grid item xl={5}>
            <div className="hero-wrapper bg-composed-wrapper bg-sunrise-purple h-100 rounded br-xl-right-0" style={{ height: '500px' }}>
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--bg bg-second opacity-5 rounded br-xl-right-0" />
                <div className="bg-composed-wrapper--content p-5">
                  <div className="align-self-center px-4">
                    <div className="py-3">
                      <Card className="card-box shadow-lg border-success card-box-border-bottom rounded hover-scale-sm">
                        <div className="p-4 text-left">
                          <div className="display-3 text-success font-weight-bold">
                            ${incomeData.total_amount?.toFixed(2)}
                          </div>
                          <div className="font-size-xxl font-weight-bold text-black">
                            Income
                          </div>
                        </div>
                      </Card>
                    </div>
                    <div className="py-3">
                      <Card className="card-box shadow-lg border-danger card-box-border-bottom rounded hover-scale-sm">
                        <div className="p-4 text-left">
                          <div className="display-3 text-danger font-weight-bold">
                            ${expenseData.total_amount?.toFixed(2)}
                          </div>
                          <div className="font-size-xxl font-weight-bold text-black">
                            Expenses
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xl={7}>
            <div className="p-4">
              <div className="p-2 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                    Profit & Loss
                  </h6>
                </div>
                <div className="d-flex align-items-center">
                  <FormControl variant="outlined" style={{ minWidth: 150, marginRight: '10px' }}>
                    <Select
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value)}
                      className="text-sm">
                      <MenuItem value="current-month">Current Month</MenuItem>
                      <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    variant="contained"
                    onClick={fetchData}
                    disabled={loading}
                    style={{ minWidth: '40px', padding: '6px' }}>
                    <FontAwesomeIcon
                      icon={['fas', 'sync']}
                      spin={loading}
                      className="font-size-sm"
                    />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ height: '368px' }}>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={368}
              />
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default IncomeExpenseAnalysis;