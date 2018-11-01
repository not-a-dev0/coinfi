import React from 'react'
import RedGreenSpan from '../common/components/RedGreenSpan'
import Icon from '../common/components/Icon'
import { Sparklines, SparklinesLine } from 'react-sparklines'

function ColumnNames(currency) {
  return [
    {
      headerName: '',
      field: 'isWatched',
      suppressSorting: true,
      minWidth: 30,
      maxWidth: 30,
      cellStyle: { 'margin-left': '5px' },
      cellRendererFramework: ({
        value: isWatched,
        data: row,
        rowIndex: index,
      }) => {
        return (
          <span>
            <Icon
              name="star"
              solid={isWatched}
              light={!isWatched}
              className={isWatched ? 'aqua' : 'light-silver'}
            />
          </span>
        )
      },
    },
    {
      headerName: '#',
      field: 'ranking',
      suppressSorting: true,
      maxWidth: 40,
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => {
        return <span>{text}</span>
      },
    },
    {
      headerName: 'Coin',
      field: 'name',
      suppressSorting: true,
      minWidth: 200,
      cellStyle: { 'border-right': '1px solid #e0e0e0' },
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => {
        return (
          <div
            style={{
              lineHeight: 'normal',
              paddingTop: '5px',
              paddingBottom: '5px',
            }}
          >
            <img alt={text} src={row.image_url} className="fl mr2" />
            <div
              className="fl"
              style={{
                maxWidth: '150px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              <a href={`/coins/${row.slug}`}>{row.symbol}</a>
              <div>{text}</div>
            </div>
          </div>
        )
      },
    },
    {
      headerName: 'Price',
      field: `price.${currency.toLowerCase()}`,
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => {
        const currencyKey = currency.toLowerCase()
        if (currency === 'USD' && row.price) {
          const formattedPrice = row.price[currencyKey].toLocaleString(
            'en-US',
            {
              maximumFractionDigits: 4,
            },
          )
          return <span>${formattedPrice} USD</span>
        }
        if (currency === 'BTC' && row.price) {
          const formattedPrice = row.price[currencyKey].toLocaleString(
            'en-US',
            {
              maximumFractionDigits: 8,
            },
          )
          return <span>{formattedPrice} &#579;</span>
        }
      },
    },
    {
      headerName: 'Market Cap',
      field: 'market_cap.usd',
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) =>
        text ? (
          <span>
            ${text.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
          </span>
        ) : null,
    },
    {
      headerName: '% Move 1H',
      field: 'change1h',
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => (
        <RedGreenSpan text={text} affix="%" />
      ),
    },
    {
      headerName: '% Move 1D',
      field: 'change24h',
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => (
        <RedGreenSpan text={text} affix="%" />
      ),
    },
    {
      headerName: '% Move 1W',
      field: 'change7d',
      unSortIcon: true,
      type: 'numericColumn',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => (
        <RedGreenSpan text={text} affix="%" />
      ),
    },
    {
      headerName: 'Volume (24hr)',
      field: 'volume24.usd',
      unSortIcon: true,
      type: 'numericColumn',
      minWidth: 150,
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) =>
        text ? (
          <span>
            {text.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        ) : null,
    },
    {
      headerName: '7D Chart',
      field: 'sparkline',
      cellRendererFramework: ({ value: text, data: row, rowIndex: index }) => {
        return (
          <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>
            <Sparklines data={text}>
              <SparklinesLine />
            </Sparklines>
          </div>
        )
      },
      suppressSorting: true,
    },
  ]
}
export default ColumnNames
