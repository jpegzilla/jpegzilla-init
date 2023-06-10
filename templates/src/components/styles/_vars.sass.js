module.exports = `@use 'sass:color'

// measurements

$pad-8: 8rem
$pad-4: 4rem
$pad-2: 2rem
$pad-1: 1rem
$pad-05: 0.5rem
$button-padding: $pad-05 $pad-1

$breakpoint-1920: 1920px
$breakpoint-1500: 1500px
$breakpoint-1200: 1200px
$breakpoint-900: 900px
$breakpoint-700: 700px

// colors

$black: hsl(240.00, 13.89%, 14.12%)
$obsidian: hsl(292.50, 6.45%, 24.31%)
$grisaille: hsl(221.74, 11.44%, 39.41%)
$dusty-blue: hsl(215.17, 16.02%, 64.51%)
$white: hsl(75.00, 44.44%, 89.41%)

// theming

=theme($theme: "dark")
  @if $theme == "light"
    --bg: #{$white}
    --alt: #{$obsidian}
    --bg-halfop: #{color.adjust($white, $alpha: -0.5)}
    --text: #{$black}
    --text-halfop: #{color.adjust($black, $alpha: -0.5)}
    --hl: #{$dusty-blue}
  @else if $theme == "dark"
    --alt: #{$obsidian}
    --bg: #{$black}
    --bg-halfop: #{color.adjust($black, $alpha: -0.5)}
    --text: #{$white}
    --text-halfop: #{color.adjust($white, $alpha: -0.5)}
    --hl: #{$grisaille}

// mixins

=blurbg($distance: 2px, $sat: 180%)
  backdrop-filter: blur($distance) saturate($sat)

=custom-scrollbar
  overflow-y: auto

  &::-webkit-scrollbar
    width: 1rem
    display: block
    background-color: transparent

  &::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 10px 10px transparent
    box-shadow: inset 0 0 10px 10px transparent
    border: solid 5px transparent
    width: 6px !important
    display: block

  &::-webkit-scrollbar-thumb
    -webkit-box-shadow: inset 0 0 10px 10px var(--text)
    box-shadow: inset 0 0 10px 10px var(--text)
    border: solid 5px transparent

  &::-webkit-scrollbar-corner, &::-webkit-resizer
    display: none

=big
  height: 100vh
  width: 100vw

=fill
  height: 100%
  width: 100%`
