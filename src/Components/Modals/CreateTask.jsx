import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useForm from '../../Hooks/useForm';
import Modal from './Modal';
import Button from '../Interactive/Button';
import DropDown from '../Interactive/DropDown';
import Textarea from '../Interactive/Textarea';
import Input from '../Interactive/Input';
import { ReactComponent as Remove } from '../../assets/icon-cross.svg';
import { createTask, updateTask } from '../../store/board/tasksActions';
import { getTaskById } from '../../store/board/tasks';

function CreateTask({ taskId, closeModal }) {
  const task = useSelector(({ boards }) => getTaskById(boards.board, taskId));
  const { board } = useSelector((state) => state.boards);
  const dispatch = useDispatch();
  const options = board.columns.map(({ name, id }) => ({
    label: name,
    value: id,
  }));
  const [status, setStatus] = useState(options[options.length - 1]);
  const title = useForm(task?.title);
  const description = useForm(task?.description);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  console.log(task);
  console.log(subtasks);
  const closeModalCreateTask = () => {
    closeModal(false);
  };

  const createNewSubtask = () => {
    setSubtasks([...subtasks, { title: '', id: '', completed: false }]);
  };

  const removeSubtask = (index) => {
    const newValues = [...subtasks];
    newValues.splice(index, 1);
    setSubtasks(newValues);
  };

  const changeSubstasks = (event, index) => {
    const newValues = [...subtasks];
    const updatedSubtask = { ...newValues[index], title: event.target.value };
    newValues[index] = updatedSubtask;
    setSubtasks(newValues);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    console.log(title.value, description.value, subtasks);
    const body = {
      title: title.value,
      description: description.value,
      subtasks,
    };
    dispatch(createTask({ columnId: status.value, body }));
    closeModalCreateTask();
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    const body = {
      title: title.value,
      description: description.value,
      subtasks,
      columnId: status.value,
    };
    console.log('update');
    console.log(body);
    dispatch(updateTask({ taskId, body }));
    closeModalCreateTask();
  };

  console.log(title.value);

  return (
    <Modal onClose={closeModalCreateTask}>
      <CreateTaskContent onSubmit={!taskId ? handleCreateTask : handleUpdateTask}>
        <h2>Add New Task</h2>
        <Input
          label="Title"
          id="title"
          placeHolder="e.g. Take coffee break"
          defaultValue={task?.title}
          {...title}
        />
        <Textarea
          label="Description"
          id="description"
          placeHolder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
          defaultValue={task?.description}
          {...description}
        />
        <SubtasksContainer>
          <p>Subtasks</p>
          {subtasks.map((item, index) => (
            <SubtaskInput key={index}>
              <Input
                placeHolder="Subtask"
                defaultValue={item.title}
                onChange={(event) => changeSubstasks(event, index)}
              />
              <Remove onClick={() => removeSubtask(index)} data-index={index} />
            </SubtaskInput>
          ))}
          <Button
            bg="colorQuaternary"
            color="colorPrimary"
            type="button"
            fnClick={createNewSubtask}
          >
            + Add New Subtask
          </Button>
        </SubtasksContainer>
        <DropDown
          options={options}
          label="Status"
          value={status}
          setValue={setStatus}
        />
        <Button type="submit">{!taskId ? 'Create Task' : 'Save Changes'}</Button>
      </CreateTaskContent>
    </Modal>
  );
}

CreateTask.propTypes = {
  closeModal: PropTypes.func,
  taskId: PropTypes.string,
};

CreateTask.defaultProps = {
  closeModal: () => {},
  taskId: null,
};

export default CreateTask;

const CreateTaskContent = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SubtasksContainer = styled.div`
  p {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-weight: 700;
    color: ${({ theme }) => theme.textSecundary};
  }
`;

const SubtaskInput = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  svg {
    cursor: pointer;
  }
`;
