import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Modal from './Modal';
import Button from '../Interactive/Button';
import { deleteBoard } from '../../store/board/boardsActions';
import { deleteTask } from '../../store/board/tasksActions';

const getDescriptions = (type, name) => {
  const descriptions = {
    board: `Are you sure you want to delete the ‘${name}’ board? This action will remove all columns and tasks and cannot be reversed.`,
    task: `Are you sure you want to delete the ‘${name}’ task and its subtasks? This action cannot be reversed.`,
  };
  return descriptions[type];
};

function DeleteModal({ id, closeModal, data }) {
  const dispatch = useDispatch();
  const closeDeleteModal = () => {
    closeModal(false);
  };

  const handleDelete = async () => {
    const body = {
      userId: data.userId,
    };
    if (data.type === 'board') {
      const response = await dispatch(deleteBoard({ boardId: id, body }));
      console.log(response);
    }
    if (data.type === 'task') {
      const response = await dispatch(deleteTask({ taskId: id, body }));
      console.log(response);
    }
    closeDeleteModal();
  };

  return (
    <Modal onClose={closeDeleteModal}>
      <DeleteModalContent>
        <Title>
          Delete this
          <span> {data.type}</span>
        </Title>
        <Description>{getDescriptions(data.type, data.name)}</Description>
        <ButtonsContainer>
          <Button
            bg="delete"
            color="white"
            hover="deleteHover"
            fnClick={handleDelete}
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
