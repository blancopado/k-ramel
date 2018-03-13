import { isRegExp, isString, isFunction } from 'lodash'

const isMatching = (action, store) => matcher => ( // test matching
  // to a string
  (
    isString(matcher) &&
    action.type === matcher
  )
  // to a function
  || (
    isFunction(matcher) &&
    matcher(action, store)
  )
  // to a regexp
  || (
    isRegExp(matcher) &&
    action.type.match(matcher)
  )
)

export const when = (...matchers) => callback => (action, store, drivers) => {
  const match = matchers
    .reduce((acc, curr) => acc && isMatching(action, store)(curr), true)

  if (match) return callback(action, store, drivers)
  return false
}

export const reaction = fn => Object.assign(
  fn,
  { when: (...args) => when(...args)(fn) },
)

export const reactions = fns => Object.keys(fns)
  .reduce((acc, curr) => ({ ...acc, [curr]: reaction(fns[curr]) }), {})
