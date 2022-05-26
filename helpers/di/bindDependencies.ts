import { Container } from 'inversify'
import { isFunction } from 'lodash'

import { containers } from '../../config/di'

// eslint-disable-next-line func-style
const bindDependencies = <T extends any[], R>(
  func: (...args: T) => R,
  dependencies: Array<symbol>,
  container: Container = containers.root,
) => {
  const injections = dependencies.map((dependency: symbol) => {
    return container.get(dependency)
  }) as T

  // Call any factories so that bound functions receive an interface not a factory
  // @ts-ignore
  return func.bind(
    func,
    ...injections.map((injection) => (isFunction(injection) ? injection() : injection)),
  )
}

export { bindDependencies }
