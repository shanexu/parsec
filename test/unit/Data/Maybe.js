import {
  identity
} from 'lodash/fp'
import {
  Maybe,
  Nothing,
  Just,
  just
} from 'Data/Maybe'
import Functor from 'Data/Functor'
import Applicative, {
  pure,
  liftA2,
  liftA
} from 'Control/Applicative'
import M from 'Monad'

describe('Maybe', () => {
  it('should Nothing', () => {
    expect(Nothing)
      .to.be.instanceOf(Maybe)
    expect(Nothing)
      .not.to.be.instanceOf(Just)
  })

  it('should just', () => {
    let j = just(1)
    expect(j)
      .to.be.instanceOf(Maybe)
    expect(j)
      .to.be.instanceOf(Just)
  })

  it('should fmap Nothing', () => {
    let m = Nothing
    expect(m.map(v => v.toString()))
      .to.equal(Nothing)
  })

  it('should fmap Just', () => {
    let m = just(1)
    let m1 = m.map(v => v + 1)
    expect(m1)
      .to.be.instanceOf(Just)
    expect(m1.value)
      .to.equal(2)
  })

  it('should fmap like a operation', () => {
    let m1 = (v => v + 1)['fmap'](just(1))
    expect(m1)
      .to.be.instanceOf(Just)
    expect(m1.value)
      .to.equal(2)
  })

  it('should <$', () => {
    let m1 = Functor['<$'](1, just(2))
    expect(m1)
      .to.be.instanceOf(Just)
    expect(m1.value)
      .to.equal(1)
  })

  it('should pure', () => {
    let m1 = pure(Maybe)(1)
    expect(m1)
      .to.be.instanceOf(Just)
  })

  it('should <*>', () => {
    let m1 = just(1)
    let f = just(i => i + 1)
    let m2 = Applicative['<*>'](f, m1)
    expect(m2)
      .to.be.instanceOf(Just)

    let m3 = (f)['<*>'](m1)
    expect(m3.value)
      .to.equal(2)

    let m4 = (Nothing)['<*>'](m1)
    expect(m4)
      .to.equal(Nothing)
  })

  it('should *>', () => {
    let m1 = just(1)
    let m2 = just(2)
    let m3 = (m1)['*>'](m2)
    expect(m3)
      .to.be.instanceOf(Just)
    expect(m3.value)
      .to.equal(2)
  })

  it('should <*', () => {
    let m1 = just(1)
    let m2 = just(2)
    let m3 = (m1)['<*'](m2)
    expect(m3.value)
      .to.equal(1)
  })

  it('should liftA', () => {
    let m = liftA(x => x + 1, just(1))
    expect(m.value)
      .to.equal(2)
  })

  it('should liftA2', () => {
    let m = liftA2((x, y) => x + y, just(1), just(2))
    expect(m.value)
      .to.equal(3)
    let m2 = liftA2(identity, just(1), just(2))
    expect(m2.value)
      .to.equal(1)
  })

  it('should >>=', () => {
    let m = just(1)
    let m1 = (m)['>>='](v => just(v + 1))
    expect(m1)
      .to.be.instanceOf(Just)
    expect(m1.value)
      .to.equal(2)
  })

  it('should M.return', () => {
    let m = M.return(Just)(1)
    expect(m)
      .to.be.instanceOf(Just)
  })
})
