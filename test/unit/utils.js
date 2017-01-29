import { _case } from '../../src/utils.js'

describe('utils', () => {
  describe('should case of', () => {
    class A {
      constructor(value) {
        this.value = value
      }
    }

    class B extends A {
      constructor(value) {
        super(value)
      }
    }

    class C {

    }

    it('should instanceof B', () => {
      let b = new B(1)
      let res = _case(b).of([
        [B, () => 'B'],
        [A, () => 'A']
      ])
      expect(res).to.equal('B')
    })

    it('should instanceof A', () => {
      let b = new B(1)
      let res = _case(b).of([
        [A, () => 'A'],
        [B, () => 'B']
      ])
      expect(res).to.equal('A')
    })

    it('should equal a B instance', () => {
      let b = new B(1)
      let res = _case(b).of([
        [new B(1), () => 'new B(1)'],
        [A, () => 'A'],
        [B, () => 'B']
      ])
      expect(res).to.equal('new B(1)')
    })

    it('should use condition predict', () => {
      let b = new B(1)
      let res = _case(b).of([
        [({value}) => value === 1, () => '({value}) => value === 1'],
        [new B(1), () => 'new B(1)'],
        [A, () => 'A'],
        [B, () => 'B']
      ])
      expect(res).to.equal('({value}) => value === 1')
    })

    it('should default value', () => {
      let b = new B(1)
      let res = _case(b).of([
        [() => false, () => '() => false'],
        [C, () => 'C']
      ])
      expect(res).to.equal(b)
    })
  })
})
