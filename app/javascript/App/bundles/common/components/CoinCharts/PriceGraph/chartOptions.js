const parseData = (priceData) => {
  const prices = []
  const volume = []
  priceData.forEach((day) => {
    let { timestamp: time, close: price, volume_from: vol } = day
    prices.push([time, price])
    volume.push([time, vol])
  })
  return { prices, volume }
}

export default (Highcharts, data) => {
  const { annotations, priceData } = data
  const { prices, volume } = parseData(priceData)
  return {
    rangeSelector: {
      selected: 0,
    },
    navigator: {
      enabled: false,
    },

    legend: {
      enabled: false,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      backgroundColor:
        (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
        '#FFFFFF',
    },

    time: {
      useUTC: true,
    },

    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'USD Price',
        },
        height: '60%',
        lineWidth: 2,
      },
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'Volume',
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      style: {
        width: '200px',
      },
      valueDecimals: 4,
      xDateFormat: '%A, %b %e, %Y',
      useHTML: true,
      hideDelay: 1000,
      shared: true,
    },
    plotOptions: {
      flags: {
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              window.open(this.url, '_blank')
            },
          },
        },
      },
    },
    series: [
      {
        id: 'price',
        name: 'USD Price',
        data: prices,
      },
      {
        type: 'flags',
        name: 'Annotations',
        useHTML: true,
        dataLabels: {
          useHTML: true,
        },
        data: annotations,
        onSeries: 'price',
        shape: 'circlepin',
      },
      {
        id: 'volume',
        type: 'column',
        name: 'Volume',
        data: volume,
        color: Highcharts.getOptions().colors[2],
        yAxis: 1,
      },
    ],
  }
}