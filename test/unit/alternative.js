import { empty } from '../../src/alternative.js'

describe('Alternative', () => {
  it('should array empty', () => {
    expect(empty(Array)).to.has.lengthOf(0)
  })

  it('should array <|>', () => {
    let res = ([1,2,3]) ['<|>'] ([1,2,3])
    expect(res).to.has.lengthOf(6)
  })
})
