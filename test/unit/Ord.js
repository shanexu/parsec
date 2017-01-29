import { compare } from 'Ord'
import { LT, EQ, GT } from 'Ordering'
import 'Data/Eq.js'

describe('Ord', () => {
  it('should number compare', () => {
    expect(compare(1, 2)).to.equal(LT)
    expect(compare(1, 1)).to.equal(EQ)
    expect(compare(3, 1)).to.equal(GT)
  })

  it('should number operations', () => {
    let a1 = 1, a2 = 3
    expect((a1) ['<'] (a2)).to.be.true
    expect((a1) ['>'] (a2)).to.be.false
    expect((a1) ['=='] (a2)).to.be.false
    expect((a1) ['=='] (1)).to.be.true
  })
})
