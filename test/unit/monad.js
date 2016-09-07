import M from '../../src/monad.js'

describe('Monad', () => {
  it('should return Array', () => {
    let m = M.return(Array)(1)
    expect(m).to.be.instanceOf(Array)
  })

  it('should >>= Array', () => {
    let m = M.return(Array)(1)
    expect((m)['>>=']).to.be.instanceOf(Function)
    expect((m)['bind']).to.be.instanceOf(Function)
    let m1 = (m)['>>='](v => [v, v])
    expect(m1).to.be.instanceOf(Array)
    expect(m1).to.has.lengthOf(2)
  })
})
