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
import Register from './Components/Register';
import Loading from './Components/Interactive/Loading';
import { getUserData } from './store/auth/authActions';

function App() {
  const [theme, setTheme] = useState(light);
  const { user } = useSelector((state) => state.auth);
  const { refresh, listBoards } = useSelector((state) => state.boards);
  const [loadingAutoLogin, setLoadingAutoLogin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // AutoLogin
  useEffect(() => {
    const autoLogin = async () => {
      setLoadingAutoLogin(true);
      await dispatch(getAllBoards(userId));
      dispatch(getUserData(userId));
      setLoadingAutoLogin(false);
    };
    if (token && userId) {
      autoLogin();
    }
  }, [refresh]);

  // Redirecionar para a Home caso esteja logado
  useEffect(() => {
    if (user && listBoards) {
      navigate('/');
    }
  }, [user, listBoards]);

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
                <Home theme={theme.name} setTheme={setTheme} />
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
