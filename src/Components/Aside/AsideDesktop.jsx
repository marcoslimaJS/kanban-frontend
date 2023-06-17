/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as BoardSVG } from '../../assets/icon-board.svg';
import { ReactComponent as LightSVG } from '../../assets/icon-light-theme.svg';
import { ReactComponent as DarkSVG } from '../../assets/icon-dark-theme.svg';
import { ReactComponent as HideSVG } from '../../assets/icon-hide-sidebar.svg';
import SwitchButton from '../Interactive/SwitchButton';
import { hideSidebar } from '../../store/sidebar';
import { getBoardData } from '../../store/board/boardsActions';
import CreateBoard from '../Modals/CreateBoard';
import useMedia from '../../Hooks/useMedia';
import { AnimeDownBig } from '../../styles/animations';
import reduceText from '../../helpers/reduceText';

function AsideDesktop({ setTheme }) {
  const dispatch = useDispatch();
  const { sidebar, boards } = useSelector((state) => state);
  const [showModalCreateBoard, setShowModalCreateBoard] = useState(false);
  const mobile = useMedia('(max-width: 768px)');

  const handleSidebar = () => {
    dispatch(hideSidebar());
  };

  const handleBoardData = (id) => {
    dispatch(getBoardData(id));
  };

  const createBoard = () => {
    setShowModalCreateBoard(true);
  };

  return (
    <Container
      sidebar={sidebar}
      mobile={mobile}
      onClick={(e) => e.stopPropagation()}
    >
      <AllBoards>All Boards ({boards.listBoards?.length})</AllBoards>
      <BoardList>
        {boards.listBoards?.map(({ name, id }) => (
          <BoardItem
            key={id}
            current={boards.board?.id === id}
            onClick={() => handleBoardData(id)}
          >
            <BoardSVG />
            {reduceText(name, 17)}
          </BoardItem>
        ))}
      </BoardList>
      <ButtonCreateBoard onClick={createBoard}>
        <BoardSVG />+ Create New Board
      </ButtonCreateBoard>

      <ThemeMode>
        <LightSVG />
        <SwitchButton setTheme={setTheme} />
        <DarkSVG />
      </ThemeMode>
      {!mobile && (
        <HideSidebar onClick={handleSidebar}>
          <HideSVG />
          <span>Hide Sidebar</span>
        </HideSidebar>
      )}

      {showModalCreateBoard && (
        <CreateBoard closeModal={setShowModalCreateBoard} />
      )}
    </Container>
  );
}

AsideDesktop.propTypes = {
  setTheme: PropTypes.func,
};

AsideDesktop.defaultProps = {
  setTheme: () => {},
};

export default AsideDesktop;

const Container = styled.aside`
  background: ${({ theme }) => theme.bgPrimary};
  padding-bottom: 32px;
  padding-right: ${({ sidebar }) => (sidebar ? '24px' : '0px')};
  border-right: 1px solid ${({ theme }) => theme.lines};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 700ms all;
  width: ${({ sidebar }) => (sidebar ? '300px' : '0')};
  white-space: nowrap;
  position: fixed;
  height: calc(100% - 90px);
  z-index: 600;
  left: ${({ sidebar }) => (sidebar ? '0' : '-300px')};
  border-radius: ${({ mobile }) => (mobile ? '8px;' : 'none')};
  @media (max-width: 768px) {
    padding-bottom: 16px;
    position: relative;
    animation: ${AnimeDownBig} 0.5s ease-in-out;
  }
`;

const AllBoards = styled.p`
  padding-left: 32px;
  margin-bottom: 16px;
  margin-top: 16px;
  text-transform: uppercase;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 2.4px;
  font-weight: 700;
  color: ${({ theme }) => theme.textSecundary};
`;

const BoardList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
  padding-right: 10px;
`;

const BoardItem = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0px 14px 32px;
  background: ${({ theme, current }) => current && theme.colorPrimary};
  color: ${({ theme, current }) => (
    current ? theme.white : theme.textSecundary)};
  border-radius: 0px 100px 100px 0px;
  transition: 0.4s ease-in-out;
  font-size: 15px;
  line-height: 19px;
  font-weight: 700;
  cursor: pointer;
  path {
    fill: ${({ theme, current }) => current && theme.white};
    transition: 0.4s ease-in-out;
  }
`;

const ButtonCreateBoard = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0px 14px 32px;
  color: ${({ theme }) => theme.colorPrimary};
  font-size: 15px;
  line-height: 19px;
  font-weight: 700;
  margin-bottom: 20px;
  cursor: pointer;
  path {
    fill: ${({ theme }) => theme.colorPrimary};
  }
`;

const ThemeMode = styled.div`
  background: ${({ theme }) => theme.bgSecundary};
  padding: 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-left: 24px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    margin-bottom: 0px;
  }
`;

const HideSidebar = styled.p`
  margin-left: 32px;
  display: flex;
  align-items: center;
  gap: 14px;
  font-weight: 700;
  font-size: 15px;
  line-height: 19px;
  color: ${({ theme }) => theme.textSecundary};
  cursor: pointer;
`;
