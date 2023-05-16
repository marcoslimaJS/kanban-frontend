import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Modal from './Modal';
import { getTaskById } from '../../store/board/tasks';
import { ReactComponent as ConfigSVG } from '../../assets/icon-vertical-ellipsis.svg';
import { ReactComponent as CheckIcon } from '../../assets/icon-check.svg';
import DropDown from '../Interactive/DropDown';
import DeleteModal from './DeleteModal';
import CreateTask from './CreateTask';

function ViewTask({ taskId, closeModal }) {
  const task = useSelector(({ boards }) => getTaskById(boards.board, taskId));
  const { refresh } = useSelector((state) => state.tasks);
  const { columns } = useSelector(({ boards }) => boards.board);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const isFirstRender = useRef(true);
  const dataTask = {
    name: task.title,
    userId: localStorage.getItem('userId'),
    type: 'task',
  };

  const options = columns.map(({ id, name }) => ({ label: name, value: id }));
  const [status, setStatus] = useState(options[options.length - 1]);

  if (!taskId) return null;

  const closeViewModal = () => {
    closeModal(false);
  };

  const handleShowConfigModal = () => {
    setShowConfigModal(!showConfigModal);
  };

  const handleDeleteTask = () => {
    setShowDeleteModal(true);
  };

  const handleEditTask = () => {
    setShowEditModal(true);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    closeViewModal();
  }, [refresh]);

  return (
    <Modal onClose={closeViewModal}>
      {(!showDeleteModal && !showEditModal) && (
      <ViewTaskContent>
        <Title>
          {task.title}
          <ConfigButton onClick={handleShowConfigModal}>
            <ConfigSVG />
            {showConfigModal && (
            <ConfigModal>
              <EditButton onClick={handleEditTask}>Edit Task</EditButton>
              <DeleteButton onClick={handleDeleteTask}>
                Delete Task
              </DeleteButton>
            </ConfigModal>
            )}
          </ConfigButton>
        </Title>
        <Description>{task.description}</Description>
        <Subtasks>
          <span>
            Subtasks (
            {task.subtasks.filter(({ completed }) => completed).length}
            {' '}
            of
            {' '}
            {task.subtasks.length}
            )
          </span>
          {task.subtasks.map(({ id, title, completed }) => (
            <Subtask key={id} completed={completed}>
              <Checkbox>{completed && <CheckIcon />}</Checkbox>
              <p>{title}</p>
            </Subtask>
          ))}
        </Subtasks>
        <DropDown
          options={options}
          label="Current Status"
          value={status}
          setValue={setStatus}
        />
      </ViewTaskContent>
      ) }
      {showDeleteModal && (
        <DeleteModal id={taskId} closeModal={setShowDeleteModal} data={dataTask} />
      )}
      {showEditModal && (
      <CreateTask taskId={taskId} closeModal={setShowEditModal} />
      )}
    </Modal>
  );
}

ViewTask.propTypes = {
  taskId: PropTypes.string,
  closeModal: PropTypes.func,
};

ViewTask.defaultProps = {
  taskId: null,
  closeModal: () => {},
};

export default ViewTask;

const ViewTaskContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  font-size: 20px;
  line-height: 23px;
`;

const ConfigButton = styled.button`
  cursor: pointer;
  position: relative;
  top: 5px;
  padding: 5px 10px;
`;

const ConfigModal = styled.div`
  position: absolute;
  top: 45px;
  left: -86px;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 10px 20px rgba(54, 78, 126, 0.25);
  background: ${({ theme }) => theme.bgPrimary};
  width: 192px;
`;

const EditButton = styled.div`
  color: ${({ theme }) => theme.textSecundary};
  text-align: start;
  cursor: pointer;
`;

const DeleteButton = styled.div`
  color: ${({ theme }) => theme.delete};
  text-align: start;
  cursor: pointer;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.textSecundary};
  line-height: 23px;
  font-size: 16px;
`;

const Subtasks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  span {
    font-weight: 700;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.textSecundary};
  }
`;

const Subtask = styled.div`
  background: ${({ theme }) => theme.bgSecundary};
  border-radius: 4px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 700;
  p {
    text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
    opacity: ${({ completed }) => (completed ? 0.5 : 1)};
  }
`;

const Checkbox = styled.div`
  height: 16px;
  width: 16px;
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 2px;
  background: ${({ theme, completed }) => (completed ? theme.colorPrimary : theme.white)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
