import { isEqual, isFunction, each, isNumber, isString } from 'lodash/fp'

const babelClassCheckTypeError = new TypeError('Cannot call a class as a function')

export function otherwise(){ return true }

export function _case(value) {
  return {
    of: (cds) => {
      for(let i = 0 ; i < cds.length; i++) {
        let [condition, func] = cds[i]
        if(isEqual(condition, value))
          return func(value)
        if(isFunction(condition)) {
          if(value instanceof condition)
            return func(value)
          try {
            if(condition(value))
              return func(value)
          } catch(e){
            if(!isEqual(e, babelClassCheckTypeError)) {
              throw e
            }
          }
        }
      }
      return value
    }
  }
}

export function _case_of(value, cds) {
  return _case(value).of(cds)
}

export function _instance(typeClass, data) {
  return {
    where: funcs => {
      typeClass.instances = [[data, funcs], ...typeClass.instances || []]
    }
  }
}

export function _instance_where(typeClass, data, funcs) {
  _instance(typeClass, data).where(funcs)
}

export function _instance_method(type, name, f, defaultImplement) {
  let instances = type.instances || []
  for(let i = 0; i < instances.length; i++) {
    let [data, funcs] = instances[i]
    if(f === data) {
      return funcs[name]
    }
    if(f instanceof data) {
      return funcs[name]
    }
    if(data === Number && isNumber(f)) {
      return funcs[name]
    }
    if(data === String && isString(f)) {
      return funcs[name]
    }
  }
  if(defaultImplement) {
    return defaultImplement
  }
  throw new TypeError(`No instance for (${type._name}, ${f})`)
}

export function _extend(target, ...sources) {
  each(s => each(k => { target[k] = s[k] }, Object.keys(s||{})), sources)
}
