import * as React from 'react'
import * as _ from 'lodash'
import * as moment from 'moment'
import compose from 'recompose/compose'
import { Typography, Grid } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth'
import Highcharts from 'highcharts/highcharts'
import options from '../common/components/CoinCharts/PriceGraph/options'

interface RawMarketCap {
  timestamp: string
  total_market_cap: number
  total_volume_24h: number
}

interface MarketCap extends RawMarketCap {
  time: number
}

interface Props {
  classes: any
  width: any
  marketCapData: RawMarketCap[]
}

interface State {
  sortedMarketCapData: MarketCap[]
  totalMarketCap: string
  formattedDifference: string
  percentageDifference: string
  isPositive: boolean
}

const containerId = 'market-cap-chart'
const chartColours = ['#2faeed']
const numericSymbols = ['k', 'M', 'B', 'T', 'P', 'E']

const styles = (theme) =>
  createStyles({
    container: {
      border: '1px solid #e5e8ed',
      padding: `${theme.spacing.unit * 2}px`,
    },
    chartContainer: {},
    titleLabel: {
      color: '#d7d7d7',
      paddingRight: '5px',
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 600,
      display: 'inline-block',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
        color: '#fff',
      },
    },
    titleDetails: {
      fontSize: '0.8rem',
      fontWeight: 600,
    },
    subtitle: {
      fontSize: '0.75rem',
      display: 'inline-block',
    },
    subtitleDetails: {
      fontSize: '0.6rem',
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

    const totalMarketCap = this.formatPrice(latest.total_market_cap, 0)
    const difference = secondLatest.total_market_cap - latest.total_market_cap
    const isPositive = difference >= 0
    const formattedDifference = this.formatAbbreviatedPrice(
      Math.abs(difference),
    )
    const percentageDifference = this.formatPrice(
      difference / secondLatest.total_market_cap,
      1,
    )

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
  }

  public componentWillUnmount() {
    this.unmountHighchart()
  }

  public mountHighchart() {
    const { sortedMarketCapData } = this.state

    const data = sortedMarketCapData.map((datum) => {
      return {
        x: datum.time,
        y: datum.total_market_cap,
      }
    })

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
            startOnTick: true,
            endOnTick: true,
            minTickInterval: 24 * 3600 * 1000,
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

  public formatPrice(price: number, decimal: number = 6): string {
    return price.toLocaleString('en-US', {
      maximumFractionDigits: decimal,
    })
  }

  public formatAbbreviatedPrice(price: number): string {
    let i = -1
    while (price >= 1) {
      if (price / 1000 >= 1) {
        price = price / 1000
        i++
      } else {
        break
      }
    }

    return this.formatPrice(price, 1) + (i >= 0 ? `${numericSymbols[i]}` : '')
  }

  public render() {
    const { classes } = this.props
    const {
      isPositive,
      totalMarketCap,
      formattedDifference,
      percentageDifference,
    } = this.state

    if (isWidthDown('sm', this.props.width)) {
      return (
        <React.Fragment>
          <Grid item={true} className={classes.title}>
            <Typography className={classes.titleLabel} component="span">
              Market Cap:{' '}
            </Typography>
          </Grid>
          <Grid item={true} className={classes.title}>
            ${totalMarketCap}
          </Grid>
        </React.Fragment>
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
        className={classes.container}
      >
        <Grid item={true}>
          <Grid
            container={true}
            justify="space-between"
            alignItems="baseline"
            wrap="nowrap"
          >
            <Grid item={true}>
              <Typography variant="h5">Market Cap</Typography>
            </Grid>
            <Grid item={true}>
              <Typography component="span" className={classes.title}>
                ${totalMarketCap}
              </Typography>
            </Grid>
            <Grid item={true}>
              <Typography component="span" className={classes.titleDetails}>
                USD
              </Typography>
            </Grid>
            <Grid item={true}>
              <Typography
                component="span"
                className={classes.subtitle}
                style={colourStyle}
              >
                {arrow} ${formattedDifference} ({percentageDifference}%)
              </Typography>
            </Grid>
            <Grid item={true}>
              <Typography component="span" className={classes.subtitleDetails}>
                24h
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} className={classes.chartContainer}>
          <div id={containerId} />
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withStyles(styles),
  withWidth(),
)(TotalMarketCap)
