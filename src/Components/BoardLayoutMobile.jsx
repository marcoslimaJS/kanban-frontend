import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ViewTask from './Modals/ViewTask';
import useMedia from '../Hooks/useMedia';
import Button from './Interactive/Button';
import Loading from './Interactive/Loading';
import { getBoardData } from '../store/board/boardsActions';
import colors from '../helpers/colors';

function BoardLayoutMobile({ showModalEditBoard, setShowModalCreateTask }) {
  const { board } = useSelector((state) => state.boards);
  const { boards, sidebar, tasks } = useSelector((state) => state);
  const mobile = useMedia('(max-width: 768px)');
  const [currentColumn, setCurrentColumn] = useState(board?.columns[0]);
  const [modalViewTask, setModalViewTask] = useState(null);
  const isFirstRender = useRef(true);
  const dispatch = useDispatch();

  const handleViewTaskModal = (taskId) => {
    setModalViewTask(taskId);
  };

  const openEditBoard = () => {
    showModalEditBoard(true);
  };

  const openCreateTask = () => {
    setShowModalCreateTask(true);
  };

  const handleChangeColumn = (columnId) => {
    const columnClicked = board.columns.find(({ id }) => id === columnId);
    setCurrentColumn(columnClicked);
  };

  useEffect(() => {
    setCurrentColumn(board?.columns[0]);
  }, [board]);

  useEffect(() => {
    const firstId = boards.listBoards[0]?.id;
    if (firstId) {
      dispatch(getBoardData(firstId));
    }
  }, [boards.deleted]);

  // Refresh no Board caso altere as tasks
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const refreshBoard = async () => {
      dispatch(getBoardData(board?.id));
    };
    refreshBoard();
  }, [tasks.refresh, boards.refresh]);

  return (
    <div style={{ height: '100%' }}>
      {board?.columns.length ? (
        <Container>
          <ColumnsList>
            {board?.columns.map(({ name, id }, i) => (
              <ColumnTitle
                key={id}
                onClick={() => handleChangeColumn(id)}
                current={currentColumn?.id === id}
                color={colors[i]}
              >
                {name}
                {' '}
                <span>{`(${board?.columns[i]?.tasks.length})`}</span>
              </ColumnTitle>
            ))}
          </ColumnsList>
          <Column>
            {currentColumn?.tasks.map(({ title, id: taskId, subtasks }) => (
              <Task
                key={taskId}
                onClick={() => handleViewTaskModal(taskId)}
                id={taskId}
              >
                {title}
                <Subtask>
                  {subtasks.filter(({ completed }) => completed).length}
                  {' '}
                  of
                  {' '}
                  {subtasks.length}
                  {' '}
                  subtasks
                </Subtask>
              </Task>
            ))}
            {!currentColumn?.tasks.length && (
              <ColumnEmpty>
                <p>This column is empty. Create a new task to get started.</p>
                <Button fnClick={openCreateTask}>+ Add New Task</Button>
              </ColumnEmpty>
            )}
          </Column>
          {modalViewTask && (
            <ViewTask taskId={modalViewTask} closeModal={setModalViewTask} />
          )}
        </Container>
      ) : (
        <BoardEmpty sidebar={sidebar} mobile={mobile}>
          <p>This board is empty. Create a new column to get started.</p>
          <Button fnClick={openEditBoard}>+ Add New Column</Button>
        </BoardEmpty>
      )}
      {(tasks.loading || boards.loading) && <Loading />}
    </div>
  );
}

BoardLayoutMobile.propTypes = {
  showModalEditBoard: PropTypes.func,
  setShowModalCreateTask: PropTypes.func,
};

BoardLayoutMobile.defaultProps = {
  showModalEditBoard: () => {},
  setShowModalCreateTask: () => {},
};

export default BoardLayoutMobile;

const Container = styled.main`
  position: relative;
  overflow: auto;
  height: calc(100vh - 90px);
  transition: 700ms all;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

const ColumnsList = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  overflow-x: auto;
  background: ${({ theme }) => theme.lines};
`;

const ColumnTitle = styled.h3`
  text-transform: uppercase;
  letter-spacing: 2.4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 12px 12px;
  border-radius: 6px;
  white-space: nowrap;
  color: ${({ current }) => (current ? '#fff' : '#000')};
  background: ${({ theme, current }) => (current ? theme.colorPrimary : theme.colorSecundary)};
  cursor: pointer;
  &::before {
    content: '';
    display: inline-block;
    background: ${({ color, theme }) => {
    if (color) return color;
    if (theme.name === 'light') return '#000';
    return '#fff';
  }};
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 10px;
  }
  span {
    line-height: 1.2px;
  }
`;

const Task = styled.div`
  background: ${({ theme }) => theme.bgPrimary};
  background: #b8b8ce;
  box-shadow: 0px 4px 6px rgba(54, 78, 126, 0.101545);
  padding: 22px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
`;

const Subtask = styled.p`
  color: ${({ theme }) => theme.textSecundary};
  margin-top: 8px;
  font-size: 13px;
`;

const BoardEmpty = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 32px;
  font-size: 18px;
  font-weight: 600;
  transition: 0.5s;
  text-align: center;
  color: ${({ theme }) => theme.textSecundary};
  padding: 16px;
  button {
    max-width: 220px;
  }
`;

const ColumnEmpty = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 32px;
  font-size: 18px;
  font-weight: 600;
  transition: 0.5s;
  text-align: center;
  margin-top: 120px;
  color: ${({ theme }) => theme.textSecundary};
  button {
    max-width: 220px;
  }
`;
