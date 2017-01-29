import { Right, Left, right, left } from '../../src/Either.js'

describe('either', () => {
  it('should fmap Left', () => {
    let m = left('hello')
    let m1 = m.map(() => 1)
    expect(m1).to.be.instanceOf(Left)
    expect(m1.value).to.equal('hello')

    let m2 = (() => 1) ['fmap'] (m)
    expect(m2).to.be.instanceOf(Left)
    expect(m2.value).to.equal('hello')
  })

  it('should fmap Right', () => {
    let m = right('hello')
    let m1 = m.map(() => 1)
    expect(m1).to.be.instanceOf(Right)
    expect(m1.value).to.equal(1)

    let m2 = (() => 1) ['fmap'] (m)
    expect(m2).to.be.instanceOf(Right)
    expect(m2.value).to.equal(1)
  })

  it('should <*> Left', () => {
    let m = left(i => i + 1)
    let m1 = (m) ['<*>'] (right(1))
    expect(m1).to.be.instanceOf(Left)
  })

  it('should <*> Right', () => {
    let m = right(i => i + 1)
    let m1 = (m) ['<*>'] (right(1))
    expect(m1).to.be.instanceOf(Right)
    expect(m1.value).to.equal(2)
  })
})
