import 'Eq'

describe('Ea', () => {
  it('should array ==', () => {
    let a1 = [1, 2, 3, 4]
    let a2 = [1, 2, 3, 4]
    let a3 = [1]
    expect((a1)['=='](a2))
      .to.be.true
    expect((a1)['=='](a3))
      .to.be.false
  })

  it('should array /=', () => {
    let a1 = [1, 2, 3, 4]
    let a2 = [1, 2, 3, 4]
    let a3 = [1]
    expect((a1)['/='](a2))
      .to.be.false
    expect((a1)['/='](a3))
      .to.be.true
  })

  it('should string ==', () => {
    let s1 = 'hello'
    let s2 = 'hello'
    let s3 = 'world'
    expect((s1)['=='](s2))
      .to.be.true
    expect((s1)['=='](s3))
      .to.be.flase
  })

  it('should string /=', () => {
    let s1 = 'hello'
    let s2 = 'hello'
    let s3 = 'world'
    expect((s1)['/='](s2))
      .to.be.false
    expect((s1)['/='](s3))
      .to.be.true
  })

  it('should number ==', () => {
    let n1 = 1
    let n2 = 1
    let n3 = 2
    expect((n1)['=='](n2))
      .to.be.true
    expect((n1)['=='](n3))
      .to.be.false
  })

  it('should number /=', () => {
    let n1 = 1
    let n2 = 1
    let n3 = 2
    expect((n1)['/='](n2))
      .to.be.false
    expect((n1)['/='](n3))
      .to.be.true
  })
})
