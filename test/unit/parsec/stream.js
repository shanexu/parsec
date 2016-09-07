import { uncons } from '../../../src/parsec/stream.js'
import { Nothing, Just } from '../../../src/maybe.js'

describe('Stream', () => {
  it('should uncons array []', () => {
    let m = uncons(Array)([])
    expect(m).to.be.instanceOf(Array)
    expect(m).to.has.lengthOf(1)
    expect(m[0]).to.equal(Nothing)
  })

  it('should uncons array [1,2,3]', () => {
    let m = uncons(Array)([1,2,3])
    expect(m).to.be.instanceOf(Array)
    expect(m).to.has.lengthOf(1)
    expect(m[0]).to.be.instanceOf(Just)
    // (m) ['>>='] (([t, ts]) => {
    //   expect(t).to.equal(1)
    // })
  })
})
