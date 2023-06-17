import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as ConfigSVG } from '../../assets/icon-vertical-ellipsis.svg';
import { ReactComponent as ArrowIcon } from '../../assets/icon-chevron-down.svg';
import { ReactComponent as LogoutIcon } from '../../assets/logout.svg';
import Button from '../Interactive/Button';
import useMedia from '../../Hooks/useMedia';
import { showSidebar } from '../../store/sidebar';
import { updateUserData } from '../../store/auth/authActions';
import { AnimeDown } from '../../styles/animations';
import reduceText from '../../helpers/reduceText';

function Header({ theme, openBoardEdit, openBoardDelete, openCreateTask }) {
  const {
    auth: { user },
    boards: { board },
    sidebar,
  } = useSelector((state) => state);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const configRef = useRef(null);
  const mobile = useMedia('(max-width: 768px)');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const currentLogo = theme === 'light' ? <LogoDark /> : <LogoLight />;
  const media920 = useMedia('(max-width: 920px)');
  const media500 = useMedia('(max-width: 500px)');

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

  const adjustReduceText = () => {
    if (!mobile) return media920 ? 18 : 25;
    return media500 ? 13 : 25;
  };

  const changeLayout = async () => {
    const body = {
      simpleLayout: !user?.simple_layout,
      showNotification: user?.new_layout_notification || false,
    };
    await dispatch(updateUserData({ userId, body }));
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
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
        {!mobile ? currentLogo : <LogoMobile />}
      </Logo>
      <HeaderContent>
        <TitleBoard onClick={mobile ? handleSidebar : undefined}>
          {board?.name
            ? reduceText(board?.name, adjustReduceText())
            : 'Create a Board'}
          {mobile && <ArrowIcon />}
        </TitleBoard>
        <ButtonsContainer>
          <Button
            fnClick={openModalCreateTask}
            mobile={mobile}
            close={!board?.columns.length}
          >
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
                    {user?.simple_layout ? 'Default Layout' : 'Simple Layout'}
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
  theme: PropTypes.string,
  openBoardEdit: PropTypes.func,
  openBoardDelete: PropTypes.func,
  openCreateTask: PropTypes.func,
};

Header.defaultProps = {
  theme: 'light',
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
  box-shadow: ${({ theme }) => theme.shadowSecundary};
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
  @media (max-width: 768px) {
    padding: 20px 16px 20px 0px;
  }
`;

const TitleBoard = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  & svg {
    position: relative;
    top: 3px;
  }
  @media (max-width: 860px) {
    font-size: 19px;
  }
  @media (max-width: 768px) {
    cursor: pointer;
  }
  @media (max-width: 374px) {
    font-size: 15px;
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
  box-shadow: ${({ theme }) => theme.shadowPrimary};
  background: ${({ theme }) => theme.bgPrimary};
  width: 192px;
  animation: ${AnimeDown} 0.5s ease-in-out;
`;

const EditButton = styled.button`
  color: ${({ theme }) => theme.textSecundary};
  text-align: start;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
  &:hover {
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const DeleteButton = styled.button`
  color: ${({ theme }) => theme.delete};
  text-align: start;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
  &:hover {
    color: ${({ theme }) => theme.deleteHover};
  }
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
  transition: 0.7s ease-in-out;
  svg {
    width: 20px;
    height: 20px;
    position: relative;
  }
  svg path {
    fill: #fff;
  }
  &:hover {
    color: #fff;
    background: #000;
  }
`;

const ChangeLayout = styled.div`
  color: ${({ theme }) => theme.textSecundary};
  text-align: start;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  &:hover {
    color: ${({ theme }) => theme.textPrimary};
  }
`;
