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
  const [nextColumn, setNextColumn] = useState('');
  const [columnCurrent, setColumnCurrent] = useState('');
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

  const handleMouseMove = (event, taskId, columnId) => {
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
      const scroll = BoardElement.current.scrollLeft;
      const scrollTo = BoardElement.current.scrollTop;

      if (sidebar) {
        setPosition({ x: e.clientX - 440 + scroll, y: e.clientY - 135 + scrollTo });
      } else {
        setPosition({ x: e.clientX - 140 + scroll, y: e.clientY - 135 + scrollTo });
      }
      const x = sidebar ? position.x + 300 : position.x;
      const columns = columnsElement.current.filter((col) => col);

      const columnsPosition = columns.map((column) => {
        const { right } = column.getBoundingClientRect();
        return { x: right + window.scrollX, id: column.id };
      });
      console.log(columnsPosition);
      console.log(x);
      for (let i = 0; i < columnsPosition.length; i++) {
        const isLastColumn = (i === columnsPosition.length - 1) ? 0 : 120;
        if ((x + isLastColumn) < (columnsPosition[i].x + scroll)) {
          if (columnId === columns[i].id) {
            setNextColumn('');
            setColumnCurrent(columns[i].id);
          } else {
            setNextColumn(columns[i].id);
          }
          break;
        } else if (x > columnsPosition[columnsPosition.length - 1].x) {
          setNextColumn('');
        }
      }
    }
  };

  useEffect(() => {
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

    const columnsPosition = columns.map((column) => {
      const { right } = column.getBoundingClientRect();
      return { x: right + window.scrollX, id: column.id };
    });
    let taskCurrent = allTasks.find(({ id }) => id === dropTask);
    if (taskCurrent) getAllTasksOfBoard();
    taskCurrent = allTasks.find(({ id }) => id === dropTask);
    const scroll = BoardElement.current.scrollLeft;

    for (let i = 0; i < columnsPosition.length; i++) {
      const isLastColumn = (i === columnsPosition.length - 1) ? 0 : 120;
      if ((x + isLastColumn) < (columnsPosition[i].x + scroll)) {
        const sameColumn = taskIsAlreadyInTheColumn(columns[i], taskCurrent);
        if (!sameColumn) updateTask(columns[i], taskCurrent);
        break;
      }
    }
    setNextColumn('');
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (position) {
      adjustTaskInColumn();
    }
    setDropTask('');
    setPosition(null);
  };

  const handleViewTaskModal = (taskId) => {
    if (false /* wasMoved */) {
      // setWasMoved(false);
    } else {
      setModalViewTask(taskId);
    }
  };

  const openEditBoard = () => {
    showModalEditBoard(true);
  };

  const mouseLeaveBoard = () => {
    if (dropTask) {
      setDropTask('');
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const columns = columnsElement?.current;
    if (columns.length) {
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

  return (
    <div>
      {board?.columns.length ? (
        <Container
          sidebar={sidebar}
          mobile={mobile}
          ref={BoardElement}
          onMouseLeave={mouseLeaveBoard}
        >
          {board?.columns.map(({ name, id: columnId, tasks: tasksColumn }, index) => (
            <Column
              key={columnId}
              ref={(element) => {
                columnsElement.current[index] = element;
              }}
              id={columnId}
              next={nextColumn}
              isDragging={isDragging}
              current={columnCurrent}
            >
              <ColumnTitle>
                {name}
                {`(${tasksColumn.length})`}
              </ColumnTitle>
              {tasksColumn.map(({ title, id: taskId, subtasks, columnId }, i) => (
                <Task
                  ref={(element) => {
                    taskElement.current[i] = element;
                  }}
                  key={taskId}
                  onMouseDown={handleMouseDown}
                  onMouseMove={
                  isDragging ? (e) => handleMouseMove(e, taskId, columnId) : undefined
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
  align-items: center;
  gap: 20px;
  min-width: 280px;
  border: 3px dashed transparent;
  transition: 0.3s ease-in-out;
  border-radius: 6px;
  background: ${({ theme, isDragging, current, id, next }) => {
    if (isDragging) {
      if (current === id) {
        return 'initial';
      }
      if (id === next) {
        return theme.nextColumn;
      }
      return theme.possibleNextColumns;
    }
    return 'initial';
  }};
  border-color: ${({ isDragging, current, id, next }) => {
    if (isDragging) {
      if (current === id) {
        return 'transparent';
      }
      if (id === next) {
        return '#057232';
      }
      return '#063aac';
    }
    return 'transparent';
  }};
`;

const ColumnTitle = styled.h3`
  color: ${({ theme }) => theme.textSecundary};
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
  color: ${({ theme }) => theme.textPrimary};
  box-shadow: ${({ theme }) => theme.shadowSecundary};
  padding: 22px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: move;
  position: ${({ drop, id }) => (drop === id ? 'absolute' : 'initial')};
  width: 268px;
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
