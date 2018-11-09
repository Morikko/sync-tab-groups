import TestComparator from './TestComparator'
import TestConfig from './TestConfig'
import TestHelper from './TestHelper'
import TestUtils from './TestUtils'

const TestManager = {
  ...TestComparator,
  ...TestConfig,
  ...TestHelper,
  ...TestUtils,
}

export default TestManager