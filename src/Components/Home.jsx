import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import AsideDesktop from './Aside/AsideDesktop';
import Board from './Board';
import Header from './Header/Header';
import { ReactComponent as ShowSVG } from '../assets/icon-show-sidebar.svg';
import { hideSidebar, showSidebar } from '../store/sidebar';
import { AnimeLeft } from '../styles/animations';
import useMedia from '../Hooks/useMedia';
import CreateBoard from './Modals/CreateBoard';
import DeleteModal from './Modals/DeleteModal';
import CreateTask from './Modals/CreateTask';
import BoardLayoutMobile from './BoardLayoutMobile';
import LayoutNotification from './Modals/LayoutNotification';

function Home({ theme, setTheme }) {
  const dispatch = useDispatch();
  const {
    auth: { user },
    sidebar,
    boards: { board },
  } = useSelector((state) => state);
  const mobile = useMedia('(max-width: 768px)');
  const [showModalEditBoard, setShowModalEditBoard] = useState(false);
  const [showModalDeleteBoard, setShowModalDeleteBoard] = useState(false);
  const [showModalCreateTask, setShowModalCreateTask] = useState(false);
  const [showModalLayout, setShowModalLayout] = useState(false);
  const userId = localStorage.getItem('userId');
  const dataBoard = {
    name: board?.name,
    userId,
    type: 'board',
  };

  const handleSidebar = () => {
    dispatch(showSidebar());
  };

  const hiddenSidebar = () => {
    dispatch(hideSidebar());
  };

  useEffect(() => {
    if (user?.new_layout_notification) {
      setShowModalLayout(true);
    }
  }, []);

  return (
    <Container>
      <Header
        theme={theme}
        openBoardEdit={setShowModalEditBoard}
        openBoardDelete={setShowModalDeleteBoard}
        openCreateTask={setShowModalCreateTask}
      />
      <Content>
        {!mobile && (
          <>
            <AsideDesktop setTheme={setTheme} />
            {!sidebar && (
              <ShowSidebar onClick={handleSidebar}>
                <ShowSVG />
              </ShowSidebar>
            )}
          </>
        )}
        {user?.simple_layout && mobile ? (
          <BoardLayoutMobile
            showModalEditBoard={setShowModalEditBoard}
            setShowModalCreateTask={setShowModalCreateTask}
          />
        ) : (
          <Board showModalEditBoard={setShowModalEditBoard} />
        )}
        {sidebar && mobile && (
          <SidebarMobile onClick={hiddenSidebar}>
            <AsideDesktop setTheme={setTheme} />
          </SidebarMobile>
        )}
        {showModalEditBoard && (
          <CreateBoard boardId={board?.id} closeModal={setShowModalEditBoard} />
        )}
        {showModalDeleteBoard && (
          <DeleteModal
            id={board?.id}
            closeModal={setShowModalDeleteBoard}
            data={dataBoard}
          />
        )}
        {showModalCreateTask && (
          <CreateTask closeModal={setShowModalCreateTask} />
        )}
        {showModalLayout && (
          <LayoutNotification closeModal={setShowModalLayout} />
        )}
      </Content>
    </Container>
  );
}

Home.propTypes = {
  setTheme: PropTypes.func,
  theme: PropTypes.string,
};

Home.defaultProps = {
  setTheme: () => {},
  theme: 'light',
};

export default Home;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  animation: ${AnimeLeft} 0.5 ease-in-out;
`;

const Content = styled.div`
  // display: flex;
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100%;
  position: relative;
  @media (max-width: 768px) {
    display: block;
  }
`;

const ShowSidebar = styled.div`
  background: ${({ theme }) => theme.colorPrimary};
  padding: 18px 22px 18px 18px;
  position: fixed;
  z-index: 1000;
  bottom: 32px;
  border-radius: 0px 100px 100px 0px;
  cursor: pointer;
  animation: ${AnimeLeft} 0.5s ease-in-out;
`;

const SidebarMobile = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
