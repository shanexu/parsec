import Functor, { fmap } from '../../src/functor.js'
import { isEqual } from 'lodash/fp'

describe('Functor', () => {
  it('should fmap Array', () => {
    let arr = [1,2,3,4]
    expect(isEqual(fmap(v => v+1, arr), [2,3,4,5])).to.be.true
    expect(isEqual((v => v+1) ['fmap'] (arr), [2,3,4,5])).to.be.true
  })

  it('should <$', () => {
    let arr = [1,2,3,4]
    expect(isEqual(Functor['<$']('x', arr), ['x', 'x', 'x', 'x'])).to.be.true
  })
})
