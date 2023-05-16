import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
 * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    user-select: none;
  }
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;
  }
  img{
    max-width: 100%;
  }
  button {
    border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: 0.75px;
    background: none;
  }
  body {
    font-size: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${({ theme }) => theme.bgSecundary};
    min-height: 100vh;
    overflow-y: hidden;
  }
`;

export default GlobalStyle;
