import def, { RemotePromise } from '../src'

const RESOLVE_VALUE = Symbol('resolve value')
const REJECT_VALUE = Symbol('reject value')

describe('remote-promise', () => {
  it('should have the default export as `RemotePromise`', () => {
    expect(def === RemotePromise)
  })

  describe('status', () => {
    it('should be "pending" for a new instance', () => {
      const rp = new RemotePromise()
      expect(rp.status === 'pending')
    })

    it('should be "fulfilled" after calling `.resolve()`', () => {
      const rp = new RemotePromise()
      rp.resolve()
      expect(rp.status === 'fulfilled')
    })

    it('should be "rejected" after calling `.reject()`', () => {
      const rp = new RemotePromise()
      rp.reject()
      expect(rp.status === 'rejected')
    })
  })

  describe('internal promise', () => {
    it('should invoke `onfulfilled` after calling `.resolve()`', async () => {
      const rp = new RemotePromise()
      const callback = jest.fn()
      rp.resolve(RESOLVE_VALUE)

      await rp.promise.then(callback)
      expect(callback).toHaveBeenCalledWith(RESOLVE_VALUE)
    })

    it('should invoke `onrejected` after calling `.reject()`', async () => {
      const rp = new RemotePromise()
      const callback = jest.fn()
      rp.reject(REJECT_VALUE)

      await rp.promise.catch(callback)
      expect(callback).toHaveBeenCalledWith(REJECT_VALUE)
    })
  })

  describe('resolution conflicts', () => {
    it('should throw when `.resolve()` and then `.reject()` are called', () => {
      const rp = new RemotePromise()
      rp.resolve()
      expect(() => rp.reject()).toThrow()
    })

    it ('should throw when `.reject()` and then `.resolve()` are called', () => {
      const rp = new RemotePromise()
      rp.reject()
      expect(() => rp.resolve()).toThrow()
    })

    it ('should throw upon calling `.resolve()` twice', () => {
      const rp = new RemotePromise()
      rp.resolve()
      expect(() => rp.resolve()).toThrow()
    })

    it ('should throw upon calling `.reject()` twice', () => {
      const rp = new RemotePromise()
      rp.reject()
      expect(() => rp.reject()).toThrow()
    })
  })

  describe('then and catch', () => {
    it('should call onfulfilled once when resolving', async () => {
      const rp = new RemotePromise()
      const onfulfilled = jest.fn()
      const onrejected = jest.fn()

      rp.resolve(RESOLVE_VALUE)

      await rp.then(onfulfilled, onrejected)

      expect(onfulfilled).toHaveBeenCalledTimes(1)
      expect(onfulfilled).toHaveBeenCalledWith(RESOLVE_VALUE)
      expect(onrejected).not.toHaveBeenCalled()
    })

    it('should call onrejected once when rejecting', async () => {
      const rp = new RemotePromise()
      const onrejected = jest.fn()

      rp.reject(REJECT_VALUE)
      
      await rp.catch(onrejected)

      expect(onrejected).toHaveBeenCalledTimes(1)
      expect(onrejected).toHaveBeenCalledWith(REJECT_VALUE)
    })

    it('should await successfully when resolving', async () => {
      const rp = new RemotePromise()
      rp.resolve(RESOLVE_VALUE)
      await expect(rp).resolves.toBe(RESOLVE_VALUE)
    })

    it('should await unsuccessfully when rejecting', async () => {
      const rp = new RemotePromise()
      rp.reject(REJECT_VALUE)
      await expect(rp).rejects.toBe(REJECT_VALUE)
    })

    it('should be chainable', async () => {
      const rp = new RemotePromise()

      const CHAINED = Symbol()
      rp.reject(REJECT_VALUE)

      const chain = rp
        .catch(reason => {
          expect(reason).toBe(REJECT_VALUE)
          return RESOLVE_VALUE
        })
        .then(value => {
          expect(value).toBe(RESOLVE_VALUE)
          return CHAINED
        })

      await expect(chain).resolves.toBe(CHAINED)
    })
  })
})
