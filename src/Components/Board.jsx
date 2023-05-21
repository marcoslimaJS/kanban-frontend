import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ViewTask from './Modals/ViewTask';
import useMedia from '../Hooks/useMedia';
import Button from './Interactive/Button';
import { updateTaskForColumn } from '../store/board/tasksActions';
import useResponse from '../Hooks/useResponse';
import Loading from './Interactive/Loading';
import { boardData } from '../store/board/boardsActions';

function Board({ showModalEditBoard }) {
  const { board } = useSelector((state) => state.boards);
  const { boards, sidebar, tasks } = useSelector((state) => state);
  const mobile = useMedia('(max-width: 640px)');
  const BoardElement = useRef(null);
  const columnsElement = useRef([]);
  const taskElement = useRef([]);
  const [allTasks, setAllTasks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  // const [wasMoved, setWasMoved] = useState(false);
  const [position, setPosition] = useState(null);
  const [modalViewTask, setModalViewTask] = useState(null);
  const [dropTask, setDropTask] = useState('');
  const isFirstRender = useRef(true);
  const dispatch = useDispatch();

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const getAllTasksOfBoard = () => {
    const columns = columnsElement.current.filter((col) => col);
    const tasksAll = columns.reduce((accum, column) => {
      const onlyTask = [...column.children].filter(({ id }) => id);
      return [...accum, ...onlyTask];
    }, []);
    setAllTasks(tasksAll);
  };

  const taskIsAlreadyInTheColumn = (column, task) => {
    const currentColumn = board.columns.find(({ id }) => id === column.id);
    return currentColumn.tasks.some(({ id }) => id === task.id);
  };

  const handleMouseMove = (event, taskId) => {
    // setWasMoved(true);
    const e = event.type === 'touchmove' ? event.touches[0] : event;
    if (isDragging) {
      setDropTask(taskId);
      const screenWidth = window.innerWidth;
      const scrollThreshold = mobile ? 100 : 150;

      if (e.clientX < scrollThreshold + (sidebar ? 310 : 10)) {
        // scroll para esquerda
        BoardElement.current.scrollBy({
          left: -150,
          behavior: 'smooth',
        });
      } else if (e.clientX > screenWidth - scrollThreshold) {
        // scroll para direita
        BoardElement.current.scrollBy({
          left: 200,
          behavior: 'smooth',
        });
      }

      const rect = BoardElement.current.getBoundingClientRect();
      console.log(rect);
      console.log(BoardElement.current.scrollLeft);
      const scroll = BoardElement.current.scrollLeft;
      const scrollTo = BoardElement.current.scrollTop;
      if (sidebar) {
        setPosition({ x: e.clientX - 440 + scroll, y: e.clientY - 135 + scrollTo });
      } else {
        setPosition({ x: e.clientX - 140 + scroll, y: e.clientY - 135 });
      }
    }
  };
  console.log(position);

  useEffect(() => {
    console.log('sgsgfgfdgf');
    setPosition((pos) => pos);
  }, [BoardElement?.current?.scrollLeft]);

  const updateTask = async (column, task) => {
    const response = await dispatch(updateTaskForColumn({
      taskId: task.id,
      body: {
        columnId: column.id,
      },
    }));
    useResponse({
      status: response.meta.requestStatus,
      type: 'task',
      result: 'updated',
    });
  };

  const adjustTaskInColumn = () => {
    const x = sidebar ? position.x + 300 : position.x;
    const columns = columnsElement.current.filter((col) => col);
    console.log(columns);
    const columnsPosition = columns.map((column) => {
      const { right } = column.getBoundingClientRect();
      return { x: right + window.scrollX };
    });
    let taskCurrent = allTasks.find(({ id }) => id === dropTask);
    if (taskCurrent) getAllTasksOfBoard();
    taskCurrent = allTasks.find(({ id }) => id === dropTask);

    console.log(columnsPosition);

    for (let i = 0; i < columnsPosition.length; i++) {
      if ((x + 0) < columnsPosition[i].x) {
        const sameColumn = taskIsAlreadyInTheColumn(columns[i], taskCurrent);
        if (!sameColumn) updateTask(columns[i], taskCurrent);
        break;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (position) {
      adjustTaskInColumn();
    }
    setDropTask('');
    setPosition(null);
    console.log('MouseUp no pulo');
  };

  const handleViewTaskModal = (taskId) => {
    console.log('CLIQUEEEEEEEEEEEEEEEE');
    console.log(taskId);
    if (false /* wasMoved */) {
      // setWasMoved(false);
    } else {
      // setModalViewTask(taskId);
    }
  };

  const openEditBoard = () => {
    showModalEditBoard(true);
  };

  useEffect(() => {
    const columns = columnsElement?.current;
    if (columns.length) {
      console.log('ifffffffff');
      getAllTasksOfBoard();
    }
  }, [sidebar, board?.columns]);

  useEffect(() => {
    const firstId = boards.listBoards[0]?.id;
    if (firstId) {
      dispatch(boardData(firstId));
    }
  }, [boards.deleted]);

  // Refresh no Board caso altere as tasks
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const refreshBoard = async () => {
      dispatch(boardData(board?.id));
    };
    refreshBoard();
  }, [tasks.refresh, boards.refresh]);

  console.log(boards?.listBoards);

  return (
    <div>
      {board?.columns.length ? (
        <Container sidebar={sidebar} mobile={mobile} ref={BoardElement}>
          {board?.columns.map(({ name, id: columnId, tasks: tasksColumn }, index) => (
            <Column
              key={columnId}
              ref={(element) => {
                columnsElement.current[index] = element;
              }}
              id={columnId}
            >
              <ColumnTitle>
                {name}
                {`(${tasksColumn.length})`}
              </ColumnTitle>
              {tasksColumn.map(({ title, id: taskId, subtasks }, i) => (
                <Task
                  ref={(element) => {
                    taskElement.current[i] = element;
                  }}
                  key={taskId}
                  onMouseDown={handleMouseDown}
                  onMouseMove={
                  isDragging ? (e) => handleMouseMove(e, taskId) : undefined
                }
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchMove={
                  isDragging ? (e) => handleMouseMove(e, taskId) : undefined
                }
                  onTouchEnd={handleMouseUp}
                  onClick={() => handleViewTaskModal(taskId)}
                  position={position}
                  drop={dropTask}
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
            </Column>
          ))}
          <NewColumn onClick={openEditBoard}>
            <p>+ New Column</p>
          </NewColumn>
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

Board.propTypes = {
  showModalEditBoard: PropTypes.func,
};

Board.defaultProps = {
  showModalEditBoard: () => {},
};

export default Board;

const Container = styled.main`
  position: relative;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 280px);
  grid-auto-flow: column;
  gap: 24px;
  overflow: auto;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
  height: calc(100vh - 90px);
  transition: 700ms all;
  width: ${({ sidebar, mobile }) => (
    sidebar && !mobile ? 'calc(100vw - 300px)' : '100vw')};
  margin-left: ${({ sidebar, mobile }) => (
    sidebar && !mobile ? '300px' : '0px')};
  @media (max-width: 768px) {
    width: ${({ sidebar, mobile }) => (
    sidebar && !mobile ? 'calc(100vw - 260px)' : '100vw')};
    margin-left: ${({ sidebar, mobile }) => (
    sidebar && !mobile ? '260px' : '0px')};
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 280px;
  border: 1px solid red;
`;

const ColumnTitle = styled.h3`
  text-transform: uppercase;
  letter-spacing: 2.4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  //position: fixed;
  &::before {
    content: '';
    display: inline-block;
    background: red;
    width: 15px;
    height: 15px;
    border-radius: 50%;
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
  cursor: move;
  position: ${({ drop, id }) => (drop === id ? 'absolute' : 'initial')};
  width: 280px;
  left: ${({ position }) => position && position.x}px;
  top: ${({ position }) => position && position.y}px;
  user-select: none;
`;

const Subtask = styled.p`
  color: ${({ theme }) => theme.textSecundary};
  margin-top: 8px;
  font-size: 13px;
`;

const NewColumn = styled.div`
  width: 280px;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.9s ease-in-out;
  color: ${({ theme }) => theme.textSecundary};
  background: ${({ theme }) => theme.bgTertiary};
  p {
    font-size: 20px;
    font-weight: 600;
    margin-top: 200px;
  }
  &:hover {
    background: ${({ theme }) => theme.bgTertiaryHover};
    transition: 0.9s ease-in-out;
  }
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
  padding-left: ${({ sidebar, mobile }) => (sidebar && !mobile ? '300px' : '0px')};

  button {
    max-width: 220px;
  }
`;
