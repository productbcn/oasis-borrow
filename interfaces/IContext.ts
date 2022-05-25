export interface IContext<Context> {
  create: () => Context
  connect: () => void
}
