import React, { Component, Fragment } from 'react'
import {
  Layout,
  Card,
  Button,
  Menu,
  Dropdown,
  Icon,
  List,
  Col,
  Row,
  Table,
} from 'antd'
import styled from 'styled-components'

const { Header, Footer, Content } = Layout

class CoinIndex extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
  }
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    })
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null })
  }

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    })
  }

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    })
  }
  render() {
    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a, b) => a.age - b.age,
        sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        filters: [
          { text: 'London', value: 'London' },
          { text: 'New York', value: 'New York' },
        ],
        filteredValue: filteredInfo.address || null,
        onFilter: (value, record) => record.address.includes(value),
        sorter: (a, b) => a.address.length - b.address.length,
        sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
      },
    ]

    const { symbol } = this.props

    const columnNames = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Price',
        dataIndex: 'price.usd',
        key: 'price.usd',
        sorter: (a, b) => a.price.usd - b.price.usd,
        sortOrder: sortedInfo.columnKey === 'price.usd' && sortedInfo.order,
      },
      {
        title: 'Market Cap',
        dataIndex: 'market_cap.usd',
        key: 'market_cap.usd',
        sorter: (a, b) => a.market_cap.usd - b.market_cap.usd,
        sortOrder:
          sortedInfo.columnKey === 'market_cap.usd' && sortedInfo.order,
      },
      {
        title: '% Move 1H',
        dataIndex: 'change1h',
        key: 'change1h',
        sorter: (a, b) => a.change1h.usd - b.change1h.usd,
        sortOrder: sortedInfo.columnKey === 'change1h.usd' && sortedInfo.order,
      },
      {
        title: '% Move 1D',
        dataIndex: 'change24h',
        key: 'change24h',
        sorter: (a, b) => a.change1h.usd - b.change1h.usd,
        sortOrder: sortedInfo.columnKey === 'change1h.usd' && sortedInfo.order,
      },
      {
        title: '% Move 1W',
        dataIndex: 'change7d',
        key: 'change7d',
        sorter: (a, b) => a.change7d.usd - b.change7d.usd,
        sortOrder: sortedInfo.columnKey === 'change7d.usd' && sortedInfo.order,
      },
      {
        title: 'Volume (24hr)',
        dataIndex: 'volume24.usd',
        key: 'volume24.usd',
        sorter: (a, b) => a.volume24.usd - b.volume24.usd,
        sortOrder: sortedInfo.columnKey === 'volume24.usd' && sortedInfo.order,
      },
      {
        title: '7D Chart',
        dataIndex: '',
        key: '',
      },
    ]

    let colVar = []
    if (window.isDesktop) colVar = columnNames
    if (window.isTablet) colVar = columnNames.slice(0, 6)
    if (window.isMobile) colVar = columnNames.slice(0, 3)

    return (
      <Fragment>
        <Layout>
          <Content>
            <div>
              <div style={{ background: '#fff' }}>
                <h1>Coins</h1>
                <ButtonWrap>
                  <Dropdown overlay={currencyMenu}>
                    <Button style={{ marginLeft: 8, margin: 10 }}>
                      USD <Icon type="down" />
                    </Button>
                  </Dropdown>
                </ButtonWrap>
                <Section>
                  <Div />
                  <Div />
                </Section>

                <div
                  style={{
                    background: '#f6f8fa',
                    padding: '0 .5rem',
                    border: '1px solid #e5e6e6',
                  }}
                >
                  [Overview]
                </div>
                <Table
                  columns={colVar}
                  dataSource={this.props.coins}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </Content>
          <Footer />
        </Layout>
      </Fragment>
    )
  }
}

export default CoinIndex

const ButtonWrap = styled.div`
  text-align: right;
  margin: 0 1rem;
  @media (min-width: 900px) {
    float: right;
    margin-top: 2.5rem;
  }
`

const Section = styled.section`
  text-align: center;
  margin: 3rem 0;
  @media (min-width: 900px) {
    text-align: left;
    margin: 0 0 0 1rem;
    padding-top: 1rem;
  }
`

const Div = styled.div`
  margin-bottom: 2rem;
  @media (min-width: 900px) {
    display: inline-block;
    margin-right: 1rem;
  }
`

const Span = styled.span`
  margin: 0 0.5rem;
`

const currencyMenu = (
  <Menu>
    <Menu.Item key="1">USD</Menu.Item>
    <Menu.Item key="2">BTC</Menu.Item>
  </Menu>
)

const cardStyle = {
  flexGrow: 1,
  margin: '1rem .5rem 0 .5rem',
}
