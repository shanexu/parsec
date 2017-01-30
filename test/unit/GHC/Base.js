import {
  Alternative
} from 'GHC/Base'
const {
  empty
} = Alternative
import {
  Maybe,
  Nothing,
  Just
} from 'Data/Maybe'

describe('Alternative', () => {
  it('should array empty', () => {
    expect(empty(Array))
      .to.has.lengthOf(0)
  })

  it('should array <|>', () => {
    let res = ([1, 2, 3])['<|>']([1, 2, 3])
    expect(res)
      .to.has.lengthOf(6)
  })

  it('should Maybe empty', () => {
    expect(empty(Maybe))
      .to.eql(Nothing)

    expect(empty(new Just(1)))
      .to.eql(Nothing)
  })

  it('should maybe <|>', () => {
    let res = (Nothing)['<|>'](new Just(1))
    expect(res)
      .to.eql(new Just(1))

    let res2 = (new Just(1))['<|>'](new Just(2))
    expect(res2)
      .to.eql(new Just(1))
  })
})
