module.exports = `console.log('hello from the main file!')

const elements = []

elements.forEach(({ name, element }) => {
  if (name && element) customElements.define(name, element)
})`
