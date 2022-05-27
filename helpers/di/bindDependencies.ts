import { containers } from 'config/di'
import { Container } from 'inversify'
import { isFunction } from 'lodash'

// eslint-disable-next-line func-style
const bindDependencies = <T extends any[], R>(
  func: (...args: T) => R,
  dependencies: Array<symbol>,
  container: Container = containers.blockchain.getInstance(),
) => {
  const injections = dependencies.map((dependency: symbol) => {
    return container.get(dependency)
  }) as T

  // Call any factories so that bound functions receive an interface not a factory
  // @ts-ignore
  return func.bind(func, ...injections)
}

export { bindDependencies }
