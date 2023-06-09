import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/logo-dark.svg';
import { ReactComponent as ImgSVG } from '../assets/scrum-board.svg';
import Button from './Interactive/Button';
import Input from './Interactive/Input';
import useForm from '../Hooks/useForm';
import { loginUser } from '../store/auth/authActions';
import { clearErrorAuth } from '../store/auth/auth';
import { getAllBoards } from '../store/board/boardsActions';

function Login() {
  const { error, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const username = useForm();
  const password = useForm();

  const handleLogin = async (e) => {
    e.preventDefault();
    const usernameValidate = username.validate();
    const passwordValidate = password.validate();
    if (usernameValidate && passwordValidate) {
      const response = await dispatch(
        loginUser({ username: username.value, password: password.value }),
      );
      if (response.meta.requestStatus === 'fulfilled') {
        dispatch(getAllBoards(response.payload.userId));
      }
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  useEffect(() => {
    dispatch(clearErrorAuth());
  }, [location]);

  return (
    <Container>
      <Header>
        <div>
          <Logo />
        </div>
      </Header>
      <Main>
        <ColumnImg>
          <ImgSVG />
        </ColumnImg>
        <Content>
          <Title>Login</Title>
          <FormLogin onSubmit={handleLogin}>
            <Input
              label="Username"
              id="username"
              placeHolder="Enter task name"
              {...username}
            />
            <Input
              label="Password"
              id="password"
              type="password"
              {...password}
            />
            <Button bg="white" color="red" type="submit" loading={loading}>
              Login
            </Button>
            {error && <Error>{error}</Error>}
          </FormLogin>
          <SignUp>
            Don&apos;t have account?
            <SignUpSpan onClick={goToRegister}> Sing Up</SignUpSpan>
          </SignUp>
        </Content>
      </Main>
    </Container>
  );
}

export default Login;

const Container = styled.section`
  min-height: 100vh;
  background-image: linear-gradient(315deg, #6e72fc 0%, #ad1deb 74%);
  overflow-y: auto;
`;

const Header = styled.header`
  margin-bottom: 20px;
  div {
    padding: 20px 60px;
    background: #fff;
    width: 100%;
    display: flex;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  overflow-y: auto;
  @media (max-width: 675px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0px;
  }
`;

const ColumnImg = styled.div`
  svg {
    width: 100%;
  }
  @media (max-width: 675px) {
    max-width: 300px;
    svg {
    width: 100%;
    max-height: 200px;
    }
  }
`;

const Content = styled.div`
  padding: 20px;
  max-width: 450px;

  @media (max-width: 675px) {
    width: 100%;
    margin-top: 0px;
  }
`;

const Title = styled.h1`
  line-height: 1;
  font-size: 3rem;
  position: relative;
  margin-bottom: 30px;
  z-index: 1;
  color: ${({ theme }) => theme.white};

  &::after {
    content: '';
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    background: #280074;
    position: absolute;
    bottom: 0px;
    left: -5px;
    border-radius: 0.2rem;
    z-index: -1;
  }
`;

const FormLogin = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  label {
    color: #fff;
  }
  button {
    width: 100%;
    margin-top: 20px;
    border-radius: 4px;
    font-size: 18px;
  }
`;

const Error = styled.p`
  background: ${({ theme }) => theme.delete};
  color: #fff;
  text-align: center;
  padding: 10px 0px;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  font-size: 16px;
  margin-bottom: 16px;
`;

const SignUp = styled.p`
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
  span {
    color: ${({ theme }) => theme.white};
    cursor: pointer;
  }
`;

const SignUpSpan = styled.span``;
