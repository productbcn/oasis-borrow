import { containers } from '../../config/di'

interface IBindDependencies {
  <T, R>(
    func: (args: T) => R,
    dependencies: Array<symbol>,
    options?: { container: keyof typeof containers },
  ): () => R
}

function getContainer(containers: any, key: string | undefined) {
  return key ? containers[key] : containers['root']
}

// eslint-disable-next-line func-style
const bindDependencies: IBindDependencies = <T, R>(
  func: (args: T) => R,
  dependencies: Array<symbol>,
  options: { container: keyof typeof containers } | undefined,
) => {
  const container = getContainer(containers, options?.container)

  const injections = dependencies.map((dependency: any) => {
    return container.get(dependency)
  })
  return func.bind(func, ...injections)
}

export { bindDependencies }
