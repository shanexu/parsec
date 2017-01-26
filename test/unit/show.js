import '../../src/show.js'

describe('Show', () => {
  it('should string show', () => {
    let s = 'hello'
    expect(s.show())
      .to.eql('"hello"')
  })

  it('should array show', () => {
    let a1 = []
    let a2 = [1]
    let a3 = [1, 2]
    expect(a1.show())
      .to.eql('[]')
    expect(a2.show())
      .to.eql('[1]')
    expect(a3.show())
      .to.eql('[1,2]')
  })

  it('should number show', () => {
    let n1 = 1
    let n2 = 11111111111111111111111111111
    expect(n1.show())
      .to.eql('1')
    expect(n2.show())
      .to.eql('1.1111111111111112e+28')
  })
})
