import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useForm from '../../Hooks/useForm';
import Modal from './Modal';
import Button from '../Interactive/Button';
import Input from '../Interactive/Input';
import { ReactComponent as Remove } from '../../assets/icon-cross.svg';
import { createBoard, updateBoard } from '../../store/board/boardsActions';
import useResponse from '../../Hooks/useResponse';

function CreateBoard({ boardId, closeModal }) {
  const board = boardId && useSelector(({ boards }) => boards.board);
  const { loading } = useSelector(({ boards }) => boards);
  const dispatch = useDispatch();
  const name = useForm(board?.name);
  const [columns, setColumns] = useState(board?.columns || []);
  const closeModalCreateBoard = () => {
    closeModal(false);
  };
  const createNewColumn = () => {
    setColumns([...columns, { name: '', id: '' }]);
  };

  const removeColumns = (index) => {
    const newValues = [...columns];
    newValues.splice(index, 1);
    setColumns(newValues);
  };

  const changeColumns = (event, index) => {
    const newValues = [...columns];
    const updatedColumn = { ...newValues[index], name: event.target.value };
    newValues[index] = updatedColumn;
    setColumns(newValues);
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    const body = {
      name: name.value,
      columns,
    };
    if (name.validate()) {
      const response = await dispatch(
        createBoard({ userId: localStorage.getItem('userId'), body }),
      );
      useResponse({
        status: response.meta.requestStatus,
        type: 'board',
        result: 'created',
      });
      closeModalCreateBoard();
    }
  };

  const handleUpdateBoard = async (e) => {
    e.preventDefault();
    const body = {
      name: name.value,
      columns,
    };
    if (name.validate()) {
      const response = await dispatch(updateBoard({ boardId, body }));
      useResponse({
        status: response.meta.requestStatus,
        type: 'board',
        result: 'updated',
      });
      closeModalCreateBoard();
    }
  };

  return (
    <Modal onClose={closeModalCreateBoard}>
      <CreateBoardContent
        onSubmit={!boardId ? handleCreateBoard : handleUpdateBoard}
      >
        <h2>{!boardId ? 'Add New Board' : 'Edit Board'}</h2>
        <Input
          label="Name"
          id="name"
          placeHolder="e.g. Web Design"
          defaultValue={board?.name}
          {...name}
        />
        <ColumnsContainer>
          <p>Columns</p>
          {columns.map((item, index) => (
            <ColumnsInput key={index}>
              <Input
                placeHolder="Column"
                defaultValue={item.name}
                onChange={(event) => changeColumns(event, index)}
              />
              <Remove onClick={() => removeColumns(index)} data-index={index} />
            </ColumnsInput>
          ))}
          <Button
            bg="colorQuaternary"
            color="colorPrimary"
            type="button"
            fnClick={createNewColumn}
          >
            + Add New Column
          </Button>
        </ColumnsContainer>
        <Button type="submit" loading={loading}>
          {!boardId ? 'Create Board' : 'Save Changes'}
        </Button>
      </CreateBoardContent>
    </Modal>
  );
}

CreateBoard.propTypes = {
  closeModal: PropTypes.func,
  boardId: PropTypes.string,
};

CreateBoard.defaultProps = {
  closeModal: () => {},
  boardId: null,
};

export default CreateBoard;

const CreateBoardContent = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ColumnsContainer = styled.div`
  p {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-weight: 700;
    font-size: 14px;
    color: ${({ theme }) => theme.textSecundary};
  }
`;

const ColumnsInput = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  svg {
    cursor: pointer;
  }
`;
