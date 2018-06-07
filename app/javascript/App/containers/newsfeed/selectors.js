import { namespace, filterList } from './constants'
import { createEntitySelectors, createFilterSelectors } from '../../lib/redux'

const select = createEntitySelectors(namespace)
const filterSelectors = createFilterSelectors(namespace, filterList)

export default {
  activeEntity: select.activeEntity,
  isActiveEntity: select.isActiveEntity,
  isLoading: select.isLoading,
  coinIDs: select.entityIDs('coins'),
  coins: select.entities('coins'),
  newsItems: select.entities('newsItems'),
  tags: select.entities('tags'),
  selectNewsItemFromList: select.entityFromList('newsItems'),
  selectCoinDetails: select.entityDetails('coin'),
  selectNewsCategories: select.entityChildren('newsItems', 'categories'),
  ...filterSelectors
}
