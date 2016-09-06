import '../../src/eq.js'

describe('Ea', () => {
  it('should array ==', () => {
    let a1 = [1,2,3,4]
    let a2 = [1,2,3,4]
    let a3 = [1]
    expect((a1) ['=='] (a2)).to.be.true
    expect((a1) ['=='] (a3)).to.be.false
  })

  it('should array /=', () => {
    let a1 = [1,2,3,4]
    let a2 = [1,2,3,4]
    let a3 = [1]
    expect((a1) ['/='] (a2)).to.be.false
    expect((a1) ['/='] (a3)).to.be.true
  })
})
