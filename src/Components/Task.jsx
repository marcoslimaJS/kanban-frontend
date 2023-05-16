import React, { forwardRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Task = forwardRef(
  (
    {
      id,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onClick,
      position,
      drop,
      title,
      subtasks,
    },
    ref,
  ) => {
    console.log(title);

    return (
      <TaskStyled
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={onClick(id)}
        position={position}
        drop={drop}
      >
        {title}
        <Subtask>
          {subtasks.filter(({ completed }) => completed).length}
          of subtasks
          {subtasks.length}
        </Subtask>
      </TaskStyled>
    );
  },
);
Task.propTypes = {
  id: PropTypes.string,
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseUp: PropTypes.func,
  onClick: PropTypes.func,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  drop: PropTypes.bool,
  title: PropTypes.string,
  subtasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      completed: PropTypes.bool,
    }),
  ),
};

Task.defaultProps = {
  id: '',
  onMouseDown: () => {},
  onMouseMove: () => {},
  onMouseUp: () => {},
  onClick: () => {},
  position: {},
  drop: false,
  title: '',
  subtasks: [],
};

export default Task;

const TaskStyled = styled.div`
  background: ${({ theme }) => theme.bgPrimary};
  box-shadow: 0px 4px 6px rgba(54, 78, 126, 0.101545);
  padding: 22px 16px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: move;
  position: ${({ drop }) => (drop ? 'absolute' : 'initial')};
  width: 236px;
  left: ${({ position }) => position && position.x}px;
  top: ${({ position }) => position && position.y}px;
  user-select: none;
`;

const Subtask = styled.p`
  color: ${({ theme }) => theme.textSecundary};
  margin-top: 8px;
  font-size: 14px;
`;
