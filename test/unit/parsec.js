import parsec from '../../src/parsec'

describe('parsec', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(parsec, 'greet')
      parsec.greet()
    })

    it('should have been run once', () => {
      expect(parsec.greet).to.have.been.calledOnce
    })

    it('should have always returned hello', () => {
      expect(parsec.greet).to.have.always.returned('hello')
    })
  })
})
