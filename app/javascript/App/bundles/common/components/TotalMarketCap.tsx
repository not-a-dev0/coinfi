import * as React from 'react'
import * as _ from 'lodash'
import * as moment from 'moment'
import compose from 'recompose/compose'
import { Typography, Grid } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth'
import Highcharts from 'highcharts/highcharts'
import options from './CoinCharts/PriceGraph/options'
import {
  formatValue,
  formatPrice,
  formatAbbreviatedPrice,
} from '~/bundles/common/utils/numberFormatters'
import {
  CurrencyContextType,
  withCurrency,
} from '~/bundles/common/contexts/CurrencyContext'

export interface RawMarketCap {
  timestamp: string
  total_market_cap: number
  total_volume_24h: number
}

interface MarketCap extends RawMarketCap {
  time: number
}

interface Props extends CurrencyContextType {
  classes: any
  width: any
  marketCapData: RawMarketCap[]
}

interface State {
  sortedMarketCapData: MarketCap[]
  totalMarketCap: number
  formattedDifference: number
  percentageDifference: number
  isPositive: boolean
}

const containerId = 'market-cap-chart'
const chartColours = ['#2faeed']
const numericSymbols = ['k', 'M', 'B', 'T', 'P', 'E']

const styles = (theme) =>
  createStyles({
    desktopContainer: {
      background: '#fff',
      border: '1px solid #e5e8ed',
      borderRadius: '2px',
      padding: '16px 24px',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    chartContainer: {
      marginLeft: '-10px',
      marginRight: '-12px',
    },
    headerWrapper: {
      [theme.breakpoints.up('md')]: {
        marginBottom: '10px',
      },
    },
    title: {
      whiteSpace: 'nowrap',
      [theme.breakpoints.down('sm')]: {
        color: '#d7d7d7',
        paddingRight: '5px',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '20px',
        fontWeight: 500,
      },
    },
    marketCap: {
      fontSize: '1.2rem',
      fontWeight: 600,
      display: 'inline-block',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
        color: '#fff',
      },
    },
    marketCapCurrency: {
      fontSize: '0.8rem',
      fontWeight: 600,
      display: 'inline-block',
      paddingLeft: '8px',
    },
    change: {
      fontSize: '0.75rem',
      display: 'inline-block',
      whiteSpace: 'nowrap',
    },
    changeDuration: {
      paddingLeft: '8px',
      fontSize: '0.6rem',
      display: 'inline-block',
    },
  })

class TotalMarketCap extends React.Component<Props, State> {
  public chart: any

  constructor(props) {
    super(props)

    const sortedMarketCapData = props.marketCapData
      .map((datum) => {
        const time = moment
          .utc(datum.timestamp)
          .startOf('day')
          .valueOf()
        const timestamp = moment
          .utc(datum.timestamp)
          .startOf('day')
          .toISOString()

        return {
          ...datum,
          time,
          timestamp,
        }
      })
      .sort((a, b) => b - a)

    const empty = { total_market_cap: 0 }
    const latest =
      sortedMarketCapData.slice(sortedMarketCapData.length - 1)[0] || empty
    const secondLatest =
      sortedMarketCapData.slice(
        sortedMarketCapData.length - 2,
        sortedMarketCapData.length - 1,
      )[0] || empty

    const totalMarketCap = latest.total_market_cap
    const difference = latest.total_market_cap - secondLatest.total_market_cap
    const isPositive = difference >= 0
    const formattedDifference = Math.abs(difference)
    const percentageDifference =
      (difference / secondLatest.total_market_cap) * 100

    this.state = {
      sortedMarketCapData,
      totalMarketCap,
      formattedDifference,
      percentageDifference,
      isPositive,
    }
  }

  public componentDidMount() {
    Highcharts.setOptions({
      lang: {
        numericSymbols,
      },
    })

    if (isWidthUp('md', this.props.width)) {
      this.mountHighchart()
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    if (
      isWidthUp('md', this.props.width) &&
      isWidthDown('sm', prevProps.width)
    ) {
      // switching from mobile to desktop
      this.mountHighchart()
    } else if (
      isWidthUp('md', prevProps.width) &&
      isWidthDown('sm', this.props.width)
    ) {
      // switching from desktop to mobile
      this.unmountHighchart()
    }

    if (prevProps.currency !== this.props.currency) {
      this.setPriceData()
    }
  }

  public componentWillUnmount() {
    this.unmountHighchart()
  }

  public mountHighchart() {
    const data = this.getMarketCapData()

    this.unmountHighchart()

    this.chart = Highcharts.chart(
      containerId,
      _.merge(
        { ...options },
        {
          chart: {
            type: 'line',
            width: null,
            zoomType: 'x',
            height: '40%',
            spacingRight: 25,
          },
          title: {
            text: '',
          },
          colors: chartColours,
          plotOptions: {},
          time: {
            useUTC: true,
            timezone: 'UTC',
          },
          // tooltip: {
          //   valueSuffix: '',
          //   formatter: function () {
          //     var axis = this.series.yAxis;

          //     return axis.defaultLabelFormatter.call({
          //       axis: axis,
          //       value: this.y
          //     });
          //   }
          // },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%b %e',
            },
            showFirstLabel: true,
            showLastLabel: true,
            labels: {
              step: 2,
            },
            startOnTick: true,
            endOnTick: true,
            tickInterval: 24 * 3600 * 1000,
            ...(data.length > 0 && { min: data[0].x }),
            ...(data.length > 0 && { max: data[data.length - 1].x }),
          },
          yAxis: [
            {
              // left y axis
              title: {
                text: null,
              },
              // labels: {
              //   align: 'left',
              //   x: 3,
              //   y: 16,
              //   format: '{value:.,0f}'
              // },
              showFirstLabel: true,
              showLastLabel: true,
            },
          ],
          series: [
            {
              name: 'Market Cap',
              data,
              size: '100%',
              showInLegend: false,
              dataLabels: {
                enabled: false,
              },
            },
          ],
        },
      ),
    )
  }

  public unmountHighchart() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = undefined
    }
  }

  public setPriceData = () => {
    if (this.chart) {
      const data = this.getMarketCapData()
      this.chart.series[0].setData(data)
    }
  }

  public render() {
    const { classes, currencyRate, currencySymbol, currency } = this.props
    const {
      isPositive,
      totalMarketCap: totalMarketCapRaw,
      formattedDifference: formattedDifferenceRaw,
      percentageDifference: percentageDifferenceRaw,
    } = this.state

    const currencyAdjustedTMC = totalMarketCapRaw * currencyRate
    const totalMarketCap = formatPrice(currencyAdjustedTMC)
    const shortTotalMarketCap = formatAbbreviatedPrice(currencyAdjustedTMC, 2)

    const formattedDifference = formatAbbreviatedPrice(
      Math.abs(formattedDifferenceRaw * currencyRate),
    )
    const percentageDifference = formatValue(percentageDifferenceRaw, 1)

    if (isWidthDown('sm', this.props.width)) {
      return (
        <Grid container={true} wrap="nowrap" alignItems="baseline">
          <Grid item={true}>
            <Typography className={classes.title} component="span">
              Crypto Market Cap:
            </Typography>
          </Grid>
          <Grid item={true} className={classes.marketCap}>
            ${shortTotalMarketCap}
          </Grid>
        </Grid>
      )
    }

    const arrow = isPositive ? '▲' : '▼'
    const colourStyle = isPositive ? { color: '#0f0' } : { color: '#f00' }

    return (
      <Grid
        container={true}
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        className={classes.desktopContainer}
      >
        <Grid item={true}>
          <Grid
            container={true}
            justify="space-between"
            alignItems="baseline"
            wrap="nowrap"
            className={classes.headerWrapper}
          >
            <Grid item={true}>
              <Typography variant="h5" className={classes.title}>
                Crypto Market Cap
              </Typography>
            </Grid>
            <Grid item={true}>
              <Grid
                container={true}
                direction="column"
                alignContent="flex-end"
                alignItems="flex-end"
              >
                <Grid item={true}>
                  <Typography component="span" className={classes.marketCap}>
                    {currencySymbol}
                    {totalMarketCap}
                  </Typography>
                  <Typography
                    component="span"
                    className={classes.marketCapCurrency}
                  >
                    {_.toUpper(currency)}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    className={classes.change}
                    style={colourStyle}
                  >
                    {arrow} ${formattedDifference} ({percentageDifference}%)
                  </Typography>
                  <Typography
                    component="span"
                    className={classes.changeDuration}
                  >
                    24h
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} className={classes.chartContainer}>
          <div id={containerId} />
        </Grid>
      </Grid>
    )
  }

  private getMarketCapData = () => {
    const { sortedMarketCapData } = this.state
    const { currencyRate } = this.props

    const data = sortedMarketCapData.map((datum) => {
      return {
        x: datum.time,
        y: datum.total_market_cap * currencyRate,
      }
    })

    return data
  }
}

export default compose(
  withStyles(styles),
  withWidth(),
)(withCurrency(TotalMarketCap))
