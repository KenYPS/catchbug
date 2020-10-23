
import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  html,
body,
#root{
    /* font-family:  PingFangSC, Microsoft YaHei; */
    width:100%;
    height: 100%;
    border: 0;
    padding: 0;
    margin: 0;
    /* background-color: #edeff8; */
 /* user-select: none; */
}
a{
    text-decoration: none;
}
input{
  padding:0;
  margin:0;
  border-width:0;
  outline: none;
  -webkit-appearance: none;
   ::-webkit-input-placeholder{
    -webkit-text-stroke: none;
  }
}
button {
        padding:0;
        border:0;
        background:transparent;
        outline:none;
      }

  `
