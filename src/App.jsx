import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import light from './styles/light';
import GlobalStyle from './styles/global';
import Login from './Components/Login';
import ProtectedRoute from './Components/helper/ProtectedRoute';
import Home from './Components/Home';
import { getAllBoards } from './store/board/boardsActions';
import Register from './Components/Register';
import Loading from './Components/Interactive/Loading';
import { clearErrorAuth } from './store/auth/auth';

function App() {
  const [theme, setTheme] = useState(light);
  const { listBoards } = useSelector((state) => state.boards);
  const { refresh } = useSelector((state) => state.boards);
  const [loadingAutoLogin, setLoadingAutoLogin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // AutoLogin baseado nos boards do usuario
  useEffect(() => {
    const autoLogin = async () => {
      setLoadingAutoLogin(true);
      await dispatch(getAllBoards(userId));
      setLoadingAutoLogin(false);
    };
    if (token && userId) {
      autoLogin();
    }
  }, [refresh]);

  useEffect(() => {
    if (listBoards) {
      navigate('/');
    }
  }, [listBoards]);

  useEffect(() => {
    dispatch(clearErrorAuth());
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <GlobalStyle />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="/"
            element={(
              <ProtectedRoute>
                <Home setTheme={setTheme} />
              </ProtectedRoute>
              )}
          />
        </Routes>
        {loadingAutoLogin && <Loading />}
      </Container>
    </ThemeProvider>
  );
}

export default App;

const Container = styled.section`
  min-height: 100vh;
`;
