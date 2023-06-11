import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/logo-dark.svg';
import { ReactComponent as ImgSVG } from '../assets/scrum-board.svg';
import Button from './Interactive/Button';
import Input from './Interactive/Input';
import useForm from '../Hooks/useForm';
import { createUser, loginUser } from '../store/auth/authActions';
import { getAllBoards } from '../store/board/boardsActions';

function Register() {
  const { user, error, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useForm();
  const password = useForm();

  const handleLogin = async (e) => {
    e.preventDefault();
    const usernameValidate = username.validate();
    const passwordValidate = password.validate();
    if (usernameValidate && passwordValidate) {
      const response = await dispatch(
        createUser({ username: username.value, password: password.value }),
      );
      if (response.meta.requestStatus === 'fulfilled') {
        dispatch(
          loginUser({
            username: response.payload.username,
            password: response.payload.password,
          }),
        );
      }
      console.log(response);
    }
  };

  const backToLogin = () => {
    navigate('/login');
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
          <Title>Register</Title>
          <FormLogin onSubmit={handleLogin}>
            <Input
              label="Username"
              id="username"
              placeHolder="Username"
              {...username}
            />
            <Input
              label="Password"
              id="password"
              type="password"
              {...password}
            />
            <Button bg="white" color="red" type="submit" loading={loading}>
              Register
            </Button>
            {error && <Error>{error}</Error>}
          </FormLogin>
          <Login onClick={backToLogin}>
            <span />
            Go to login
          </Login>
        </Content>
      </Main>
    </Container>
  );
}

export default Register;

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
  margin-top: 30px;
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
    margin-bottom: 30px;
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
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  font-size: 16px;
`;

const Login = styled.div`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.5s;
  span {
    width: 0px;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid #fff;
    transition: 0.5s;
  }

  &:hover {
    color: #000;
    span {
      border-right: 8px solid #000;
    }
  }
`;
