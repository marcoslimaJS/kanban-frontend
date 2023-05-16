import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import light from '../../styles/light';
import dark from '../../styles/dark';

function SwitchButton({ setTheme }) {
  const changeTheme = () => {
    setTheme((theme) => (theme.name !== 'light' ? light : dark));
  };

  return (
    <Label>
      <Input
        type="checkbox"
        onChange={changeTheme}
      />
      <Switch />
    </Label>
  );
}

SwitchButton.propTypes = {
  setTheme: PropTypes.func,
};

SwitchButton.defaultProps = {
  setTheme: () => {},
};

export default SwitchButton;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
`;

const Switch = styled.div`
  position: relative;
  width: 40px;
  height: 20px;
  background: ${({ theme }) => theme.colorPrimary};
  border-radius: 32px;
  padding: 3px;
  transition: 300ms all;

  &::before {
    transition: 300ms all;
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 35px;
    top: 50%;
    left: 4px;
    background: ${({ theme }) => theme.white};
    transform: translate(0, -50%);
  }
`;

const Input = styled.input`
  display: none;
  &:checked + ${Switch} {
    &::before {
      transform: translate(18px, -50%);
    }
  }
`;
