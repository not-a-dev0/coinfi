import React from 'react'
import FilterButton from './FilterButton'
import ExchangeListingsContext from '~/bundles/ExchangeListings/context'

export default ({ children }) => (
  <div
    id="panel-header"
    className="pa3 b--b flex-none flex justify-between items-center bg-athens"
    style={{ height: 60 }}
  >
    <div className="flex items-center flex-auto">
      {!window.isMobile && (
        <button
          className="btn btn-blue btn-xs coins-btn mr2"
          style={
            window.isMobile
              ? {
                  ...{
                    background: '#2495ce',
                    flex: 1,
                    textTransform: 'none',
                  },
                }
              : {}
          }
          onClick={props.showCoinListDrawer}
        >
          <i className="material-icons f6 mr2">list</i>
          Coins
        </button>
      )}
      <ExchangeListingsContext.Consumer>
        {({ toggleFilterPanel }) => (
          <FilterButton onClick={toggleFilterPanel} />
        )}
      </ExchangeListingsContext.Consumer>
      {children}
    </div>
  </div>
)
