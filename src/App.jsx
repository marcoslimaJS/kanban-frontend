import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import light from './styles/light';
import GlobalStyle from './styles/global';
import Login from './Components/Login';
import ProtectedRoute from './Components/helper/ProtectedRoute';
import Home from './Components/Home';
import { getAllBoards } from './store/board/boardsActions';

function App() {
  const [theme, setTheme] = useState(light);
  const { listBoards } = useSelector((state) => state.boards);
  const { refresh } = useSelector((state) => state.boards);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // AutoLogin baseado nos boards do usuario
  useEffect(() => {
    if (token && userId) {
      dispatch(getAllBoards(userId));
    }
  }, [refresh]);

  useEffect(() => {
    if (listBoards) {
      navigate('/home');
    }
  }, [listBoards]);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <GlobalStyle />
        <Routes>
          <Route path="login/*" element={<Login />} />
          <Route
            path="home/*"
            element={(
              <ProtectedRoute>
                <Home setTheme={setTheme} />
              </ProtectedRoute>
              )}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;

const Container = styled.section`
  min-height: 100vh;
`;
