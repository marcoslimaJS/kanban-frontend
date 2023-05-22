import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as ConfigSVG } from '../../assets/icon-vertical-ellipsis.svg';
import { ReactComponent as ArrowIcon } from '../../assets/icon-chevron-down.svg';
import { ReactComponent as LogoutIcon } from '../../assets/logout.svg';
import Button from '../Interactive/Button';
import useMedia from '../../Hooks/useMedia';
import { showSidebar } from '../../store/sidebar';
import { updateBoardLayout } from '../../store/auth/authActions';

function Header({ openBoardEdit, openBoardDelete, openCreateTask }) {
  const {
    boards: { board },
    sidebar,
  } = useSelector((state) => state);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const configRef = useRef(null);
  const mobile = useMedia('(max-width: 640px)');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const simpleLayout = localStorage.getItem('simpleLayout');
  const userId = localStorage.getItem('userId');

  const openModalCreateTask = () => {
    openCreateTask(true);
  };

  const openConfigModal = () => {
    setShowConfigModal(!showConfigModal);
  };

  const openModalEditBoard = () => {
    openBoardEdit(true);
  };

  const openModalDeleteBoard = () => {
    openBoardDelete(true);
  };

  const handleSidebar = () => {
    dispatch(showSidebar());
  };

  const changeLayout = async () => {
    const body = {
      simpleLayout: simpleLayout !== 'true',
    };
    const response = await dispatch(updateBoardLayout({ userId, body }));
    console.log(response);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('simpleLayout');
    navigate('/login');
  };

  useEffect(() => {
    const handleOutsideClick = ({ target }) => {
      if (!configRef?.current.contains(target)) {
        setShowConfigModal(false);
      }
    };
    if (showConfigModal) {
      document.body.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [showConfigModal]);

  return (
    <HeaderElement>
      <Logo sidebar={sidebar} mobile={mobile}>
        {!mobile ? <LogoDark /> : <LogoMobile />}
      </Logo>
      <HeaderContent>
        <TitleBoard onClick={mobile ? handleSidebar : undefined}>
          {board?.name}
          {mobile && <ArrowIcon />}
        </TitleBoard>
        <ButtonsContainer>
          <Button fnClick={openModalCreateTask} mobile={mobile}>
            + Add New Task
          </Button>
          <ConfigContainer ref={configRef}>
            <ConfigButton onClick={openConfigModal}>
              <ConfigSVG />
            </ConfigButton>
            {showConfigModal && (
              <ConfigModal>
                <EditButton onClick={openModalEditBoard}>Edit Board</EditButton>
                <DeleteButton onClick={openModalDeleteBoard}>
                  Delete Board
                </DeleteButton>
                {mobile && (
                  <ChangeLayout onClick={changeLayout}>
                    {simpleLayout === 'true' ? 'Default Layout' : 'Simple Layout' }
                  </ChangeLayout>
                )}
                <Logout onClick={logout}>
                  Logout
                  <LogoutIcon />
                </Logout>
              </ConfigModal>
            )}
          </ConfigContainer>
        </ButtonsContainer>
      </HeaderContent>
    </HeaderElement>
  );
}

Header.propTypes = {
  openBoardEdit: PropTypes.func,
  openBoardDelete: PropTypes.func,
  openCreateTask: PropTypes.func,
};

Header.defaultProps = {
  openBoardEdit: () => {},
  openBoardDelete: () => {},
  openCreateTask: () => {},
};

export default Header;

const HeaderElement = styled.header`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  background: ${({ theme }) => theme.bgPrimary};
  position: relative;
  z-index: 500;
  box-shadow: 3px 4px 6px rgba(54, 78, 126, 0.101545);
  max-height: 90px;
  min-height: 90px;
`;

const Logo = styled.div`
  border-right: 1px solid ${({ theme }) => theme.lines};
  display: flex;
  align-items: center;
  width: 300px;
  padding: 24px;
  height: 100%;
  transition: all 700ms ease 0s;
  @media (max-width: 768px) {
    width: 260px;
  }
  @media (max-width: 640px) {
    border-right: none;
    width: 100%;
    padding: 20px 16px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  @media (max-width: 640px) {
    padding: 20px 16px 20px 0px;
  }
`;

const TitleBoard = styled.h1`
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  & svg {
    position: relative;
    top: 3px;
  }
  @media (max-width: 768px) {
    font-size: 20px;
  }
  @media (max-width: 640px) {
    cursor: pointer;
  }
`;

const ButtonsContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ConfigContainer = styled.div``;

const ConfigButton = styled.button`
  cursor: pointer;
  padding: 5px 10px;
`;

const ConfigModal = styled.div`
  position: absolute;
  right: 20px;
  top: 60px;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 10px 20px rgba(54, 78, 126, 0.25);
  background: ${({ theme }) => theme.bgPrimary};
  width: 192px;
`;

const EditButton = styled.button`
  color: ${({ theme }) => theme.textSecundary};
  text-align: start;
  cursor: pointer;
  font-size: 16px;
`;

const DeleteButton = styled.button`
  color: ${({ theme }) => theme.delete};
  text-align: start;
  cursor: pointer;
  font-size: 16px;
`;

const Logout = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  font-weight: 600;
  background: ${({ theme }) => theme.colorPrimary};
  padding: 5px 32px;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  svg {
    width: 20px;
    height: 20px;
    position: relative;
  }
  svg path {
    fill: #fff;
  }
`;

const ChangeLayout = styled.div`
  color: ${({ theme }) => theme.textSecundary};
  text-align: start;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
`;
