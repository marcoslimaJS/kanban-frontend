import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/logo-dark.svg';
import { ReactComponent as ImgSVG } from '../assets/scrum-board.svg';
import Button from './Interactive/Button';
import Input from './Interactive/Input';
import useForm from '../Hooks/useForm';
import { loginUser } from '../store/auth/authActions';
import { getAllBoards } from '../store/board/boardsActions';

function Login() {
  const { listBoards } = useSelector((state) => state.boards);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const username = useForm();
  const password = useForm();

  const handleLogin = (e) => {
    e.preventDefault();
    const usernameValidate = username.validate();
    const passwordValidate = password.validate();
    if (usernameValidate && passwordValidate) {
      dispatch(
        loginUser({ username: username.value, password: password.value }),
      );
    }
  };

  useEffect(() => {
    if (user?.userId) {
      dispatch(getAllBoards(user.userId));
    }
  }, [user?.userId]);

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
            <Button bg="white" color="red" type="submit">
              Login
            </Button>
          </FormLogin>
          <SignUp>
            Don&apos;t have account?
            <span> Sing Up</span>
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
`;

const ColumnImg = styled.div`
  svg {
    width: 100%;
  }
`;

const Content = styled.div`
  padding: 20px;
  margin-top: 30px;
  max-width: 450px;

  input {
    margin-bottom: 20px;
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
  label {
    color: #fff;
  }
  button {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 30px;
    border-radius: 4px;
    font-size: 18px;
  }
`;

const SignUp = styled.p`
  text-align: center;
  font-size: 18px;
  span {
    color: ${({ theme }) => theme.white};
    cursor: pointer;
  }
`;
