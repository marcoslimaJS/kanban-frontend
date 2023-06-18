import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as CheckIcon } from '../../assets/icon-check.svg';
import Modal from './Modal';
import Button from '../Interactive/Button';
import { updateUserData } from '../../store/auth/authActions';

function LayoutNotification({ closeModal }) {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const userId = localStorage.getItem('userId');

  const changeLayout = async () => {
    if (dontShowAgain) {
      const body = {
        simpleLayout: auth.user?.simple_layout,
        showNotification: !dontShowAgain,
      };
      await dispatch(updateUserData({ userId, body }));
    }
    closeModal(false);
  };

  return (
    <Modal noIcon>
      <Container>
        <Title>
          Seja bem vindo
          <span>{auth.user?.username}</span>
        </Title>
        <Content>
          Aviso! Para usuários com telas menores, temos a opção adicional de layout
          simplificado (clicando nos três pontos), que não possui a funcionalidade
          de arrastar tarefas entre colunas.
        </Content>
        <DontAgain onClick={() => setDontShowAgain(!dontShowAgain)}>
          <Checkbox completed={dontShowAgain}>
            {dontShowAgain && <CheckIcon />}
          </Checkbox>
          Don&apos;t show again
        </DontAgain>
        <Developer>Marcos Paulo Lima</Developer>
        <Button fnClick={changeLayout} loading={auth.loading}>Close</Button>
      </Container>
    </Modal>
  );
}

LayoutNotification.propTypes = {
  closeModal: PropTypes.func,
};

LayoutNotification.defaultProps = {
  closeModal: () => {},
};

export default LayoutNotification;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.p`
  font-size: 22px;
  word-break: break-all;
  text-align: center;
  span {
    font-weight: 600;
    margin-left: 12px;
  }
`;

const Content = styled.div`
  font-size: 16px;
`;

const Developer = styled.h3`
  font-weight: 600;
  text-align: end;
  font-style: italic;
`;

const DontAgain = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  align-self: start;
  font-size: 16px;
  cursor: pointer;
`;

const Checkbox = styled.div`
  height: 22px;
  width: 22px;
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 2px;
  background: ${({ theme, completed }) => (completed ? theme.colorPrimary : theme.bgPrimary)};
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    position: relative;
    top: 1px;
  }
`;
