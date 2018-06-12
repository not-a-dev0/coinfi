import React, { Component, Fragment } from 'react'
import CoinListHeader from './CoinListHeader'
import CoinListItem from './CoinListItem'
import LoadingIndicator from '../LoadingIndicator'
import coinSearchProvider from '../../containers/coinSearch'

class CoinList extends Component {
  onClickCoin = (coin) =>
    this.props.setActiveEntity({
      type: 'coin',
      id: coin.get('id'),
      label: coin.get('name')
    })
  onClickNewCoin = (coin) => {
    this.onClickCoin(coin)
    this.props.toggleUI('coinSearch')
    this.props.clearSearch()
  }
  render() {
    const { isLoading, currentUI, isWatching, searchedCoins } = this.props
    let { coins } = this.props
    if (currentUI('watchingOnly')) {
      coins = coins.filter((coin) => isWatching(coin.get('id')))
    }
    return (
      <Fragment>
        <CoinListHeader {...this.props} />
        {isLoading('coins') && (
          <LoadingIndicator className="overlay bg-white-70" />
        )}
        {searchedCoins.size > 0 && (
          <div className="bb bw2 b--light-gray">
            {searchedCoins.map((coin, key) => (
              <CoinListItem
                {...{ coin, key, ...this.props }}
                onClick={this.onClickNewCoin}
                onWatch={this.onClickNewCoin}
              />
            ))}
          </div>
        )}
        {coins.map((coin, index) => (
          <CoinListItem
            key={index}
            coin={coin}
            {...this.props}
            onClick={this.onClickCoin}
          />
        ))}
      </Fragment>
    )
  }
}

export default coinSearchProvider('newsfeed')(CoinList)
