module.exports = `@use 'vars' as v

*
  margin: 0
  padding: 0
  box-sizing: border-box

:root
  +v.theme("dark")

  @media (prefers-color-scheme: light)
    +v.theme("light")

  font-size: 16px
  height: 100vh
  background-color: var(--bg)

  @media (max-width: v.$breakpoint-1500)
    font-size: 14px

  @media (max-width: v.$breakpoint-900)
    font-size: 12px

*::selection
  background-color: c.adjust(v.$grisaille, $alpha: -0.5)

  @media (prefers-color-scheme: light)
    background-color: c.adjust(v.$dusty-blue, $alpha: -0.5)`
