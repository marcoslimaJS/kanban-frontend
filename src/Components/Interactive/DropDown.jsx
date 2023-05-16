import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ReactComponent as ArrowDown } from '../../assets/icon-chevron-down.svg';

function DropDown({ options, value, setValue, label }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    setValue(option);
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
      <Label>{label}</Label>
      <DropdownButton onClick={() => setIsOpen(!isOpen)} open={isOpen}>
        {value.label}
        <ArrowDown />
      </DropdownButton>
      {isOpen && (
        <DropdownOptions>
          {options.map((option) => (
            <DropdownOption
              key={option.value}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </DropdownOption>
          ))}
        </DropdownOptions>
      )}
    </DropdownContainer>
  );
}

DropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  setValue: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};

DropDown.defaultProps = {
  options: [],
  setValue: () => {},
  label: '',
  value: {},
};

export default DropDown;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  color: ${({ theme }) => theme.textSecundary};
  text-transform: capitalize;
`;

const Label = styled.p`
  margin-bottom: 8px;
  font-weight: 700;
  color: ${({ theme }) => theme.textSecundary};
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.colorTertiary};
  border-radius: 4px;
  padding: 12px 18px;
  cursor: pointer;
  user-select: none;
  border: 1px solid
    ${({ theme, open }) => (open ? theme.colorPrimary : theme.colorTertiary)};
  margin-bottom: 10px;
`;

const DropdownOptions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => (theme.name === 'dark' ? theme.bgSecundary : theme.white)};
  border-radius: 8px;
  list-style-type: none;
  z-index: 1;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const DropdownOption = styled.li`
  padding: 16px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colorTertiary};
  }
`;
