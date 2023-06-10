module.exports = `class Component extends HTMLElement {
  /**
   * wrapper for Element.classList.add
   * @param {string} className class to add
   */
  addClass(className) {
    this.classList.add(className)
  }

  /**
   * wrapper for Element.classList.remove
   * @param {string} className class to remove
   */
  removeClass(className) {
    this.classList.remove(className)
  }

  /**
   * wrapper for Element.classList.toggle
   * @param {string} className class to toggle
   */
  toggleClass(className) {
    this.classList.toggle(className)
  }

  /**
   * set id on an HTMLElement
   * @param {string} className id to set
   */
  setId(id) {
    this.id = id
  }

  /**
   * wrapper for Element.querySelector
   * @param  {string}  selector selector to search for
   * @return {Element}          element matching selector
   */
  qs(selector) {
    return this.querySelector(selector)
  }

  /**
   * wrapper for Element.querySelectorAll
   * @param  {string}   selector selector to search for
   * @return {NodeList}          element(s) matching selector
   */
  qsa(selector) {
    return this.querySelectorAll(selector)
  }

  /**
   * wrapper for Element.setAttribute
   * @param  {string} name attribute name
   * @param  {string} val  attribute value
   */
  attr(name, val) {
    val ? this.setAttribute(name, val) : this.getAttribute(name)
  }
}

export default Component

/**
 * tagged template function to write html in javascript.
 * (basically just used to get my editor to correctly format html strings.)
 * @param  {string} literals the string literal
 * @param  {any}    vars     variables to interpolate
 * @return {string}          string with variables correctly placed
 */
export const html = (literals, ...vars) => {
  let raw = literals.raw,
    result = '',
    i = 1,
    len = vars.length + 1,
    str,
    variable

  while (i < len) {
    str = raw[i - 1]
    variable = vars[i - 1]
    result += str + variable
    i++
  }

  result += raw[raw.length - 1]

  return result
}`
