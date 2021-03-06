import {
  mconcat
} from 'Data/Monoid'

describe('monoid', () => {
  it('should monoid array mempty', () => {
    expect(Array.mempty())
      .to.be.instanceOf(Array)
    expect(Array.mempty())
      .to.has.lengthOf(0)
  })

  it('should monoid array mappend', () => {
    let a = [1, 2, 3]
    let b = [4, 5, 6]
    let c = (a)['mappend'](b)
    expect(c)
      .to.be.instanceOf(Array)
    expect(c)
      .to.has.lengthOf(6)
    expect(JSON.stringify(c))
      .to.equal('[1,2,3,4,5,6]')
  })

  it('should monoid array mconcat', () => {
    let a = [
      [1, 2, 3],
      [4, 5, 6]
    ]
    let a1 = mconcat(Array)(a)
    expect(a1)
      .to.be.instanceOf(Array)
    expect(a1)
      .to.has.lengthOf(6)
    expect(JSON.stringify(a1))
      .to.equal('[1,2,3,4,5,6]')
  })

  it('should monoid Array.mconcat', () => {
    let a = [
      [1, 2, 3],
      [4, 5, 6]
    ]
    let a1 = Array.mconcat(a)
    expect(a1)
      .to.be.instanceOf(Array)
    expect(a1)
      .to.has.lengthOf(6)
    expect(JSON.stringify(a1))
      .to.equal('[1,2,3,4,5,6]')
  })
})
