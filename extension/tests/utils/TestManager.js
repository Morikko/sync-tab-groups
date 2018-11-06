import TestComparator from './comparator'
import TestConfig from './config'
import TestHelper from './helper'
import TestUtils from './utils'

const TestManager = {
  ...TestComparator,
  ...TestConfig,
  ...TestHelper,
  ...TestUtils,
}

export default TestManager