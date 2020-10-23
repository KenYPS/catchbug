import { css } from 'styled-components'

// constants
const TABLET_BREAKPOINT_WIDTH = 1023 // pc ( resolution > 1024 )
const MOBILE_BREAKPOINT_WIDTH = 639 // tablet ( 640 <= resolution < 1024 )

const sizes = {
  tablet: TABLET_BREAKPOINT_WIDTH, // ( 640 <= resolution < 1024 )
  mobile: MOBILE_BREAKPOINT_WIDTH // ( resolution < 640 )
}

// refs: https://www.styled-components.com/docs/advanced#media-templates
// Iterate through the sizes and create a media template
export default Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `
  return acc
}, {})
