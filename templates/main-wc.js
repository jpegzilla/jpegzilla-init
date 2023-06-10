module.exports = `import { State } from './utils/index.mjs'
import elements from './components/index.mjs'

export const state = new State()

elements.forEach(({ name, element }) => {
  if (name && element) customElements.define(name, element)
})
`
