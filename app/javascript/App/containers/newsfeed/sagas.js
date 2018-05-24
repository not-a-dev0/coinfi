import { takeLatest, select } from 'redux-saga/effects'
import { createEntitySagas } from '../../lib/redux'
import selectors from './selectors'
import { namespace } from './constants'

const sagas = createEntitySagas(namespace)

export default function* watcher() {
  yield takeLatest('FETCH_ENTITY_LIST', fetchWatchlistEntities)
  yield takeLatest('FETCH_ENTITY_DETAILS', sagas.fetchEntityDetails)
  yield takeLatest('SET_ACTIVE_ENTITY', handleFocusChange)
}

function* fetchWatchlistEntities(action) {
  if (action.namespace !== namespace) return
  switch (action.entityType) {
    case 'coins':
      yield fetchCoins(action)
      break
    case 'articles':
      yield fetchArticles(action)
      break
    default:
      yield fetchCoins(action)
      yield fetchArticles(action)
      break
  }
}

function* fetchCoins(action) {
  yield sagas.fetchEntityList({
    ...action,
    entityType: 'coins',
    url: 'newsfeed/coins'
  })
}

function* fetchArticles(action) {
  const coin_id_in = yield select(selectors.coinIDs)
  const params = { coin_id_in }
  yield sagas.fetchEntityList({ ...action, entityType: 'articles', params })
}

function* handleFocusChange(action) {
  if (action.namespace !== namespace) return
  const { type, id } = action.payload
  if (type === 'coin') {
    yield sagas.fetchEntityList({
      ...action,
      entityType: 'articles',
      params: { coin_id_eq: id }
    })
  }
}
