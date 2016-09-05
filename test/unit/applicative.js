import Applicative, { pure } from '../../src/applicative.js'
import { isEqual } from 'lodash/fp'

describe('Applicative', () => {
  it('should Array pure', () => {
    expect(pure(Array)(1)).to.be.instanceOf(Array)
  })

  it('should Array <*>', () => {
    let arr = [1,2,3]
    let funcs = [x => x+x, x => x*x]
    let res = Applicative['<*>'](funcs, arr)
    expect(isEqual(res, [2,4,6,1,4,9])).to.be.true
  })
})
