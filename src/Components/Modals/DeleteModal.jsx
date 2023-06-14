import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import Button from '../Interactive/Button';
import { boardData, deleteBoard } from '../../store/board/boardsActions';
import { deleteTask } from '../../store/board/tasksActions';
import useResponse from '../../Hooks/useResponse';

const getDescriptions = (type, name) => {
  const descriptions = {
    board: `Are you sure you want to delete the ‘${name}’ board? This action will remove all columns and tasks and cannot be reversed.`,
    task: `Are you sure you want to delete the ‘${name}’ task and its subtasks? This action cannot be reversed.`,
  };
  return descriptions[type];
};

function DeleteModal({ id, closeModal, data, closeViewModal }) {
  const dispatch = useDispatch();
  const { boards, tasks } = useSelector((state) => state);
  const closeDeleteModal = () => {
    closeModal(false);
  };

  const handleDelete = async () => {
    const body = {
      userId: data.userId,
    };
    if (data.type === 'board') {
      const response = await dispatch(deleteBoard({ boardId: id, body }));
      useResponse({
        status: response.meta.requestStatus,
        type: 'board',
        result: 'deleted',
      });
      if (response.meta.requestStatus === 'fulfilled') {
        const firstId = boards.listBoards[0]?.id;
        dispatch(boardData(firstId));
      }
    }
    if (data.type === 'task') {
      const response = await dispatch(deleteTask({ taskId: id, body }));
      useResponse({
        status: response.meta.requestStatus,
        type: 'task',
        result: 'deleted',
      });
    }
    closeDeleteModal();
    closeViewModal(false);
  };

  return (
    <Modal onClose={closeDeleteModal}>
      <DeleteModalContent>
        <Title>
          Delete this
          <span>{data.type}</span>
        </Title>
        <Description>{getDescriptions(data.type, data.name)}</Description>
        <ButtonsContainer>
          <Button
            bg="delete"
            color="white"
            hover="deleteHover"
            fnClick={handleDelete}
            loading={boards.loading || tasks.loading}
          >
            Delete
          </Button>
          <Button
            bg="colorQuaternary"
            color="colorPrimary"
            fnClick={closeDeleteModal}
          >
            Cancel
          </Button>
        </ButtonsContainer>
      </DeleteModalContent>
    </Modal>
  );
}

DeleteModal.propTypes = {
  id: PropTypes.string,
  closeModal: PropTypes.func,
  closeViewModal: PropTypes.func,
  data: PropTypes.shape({
    name: PropTypes.string,
    userId: PropTypes.string,
    type: PropTypes.string,
  }),
};

DeleteModal.defaultProps = {
  id: '',
  closeModal: () => {},
  closeViewModal: () => {},
  data: {},
};

export default DeleteModal;

const DeleteModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.delete};
  font-size: 20px;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.textSecundary};
  font-size: 14px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
