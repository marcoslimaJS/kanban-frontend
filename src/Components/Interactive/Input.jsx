import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

function Input({ label, placeHolder, type, id, error, defaultValue, onChange, onBlur }) {
  return (
    <Container>
      {label && (
        <Label htmlFor={id} error={error}>
          {label}
        </Label>
      )}
      <InputStyle
        type={type}
        id={id}
        placeholder={placeHolder}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
        error={error}
      />
      <Error>{error}</Error>
    </Container>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  placeHolder: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

Input.defaultProps = {
  label: '',
  type: 'text',
  id: '',
  error: '',
  placeHolder: '',
  defaultValue: '',
  onChange: () => {},
  onBlur: () => {},
};

export default Input;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const InputStyle = styled.input`
  width: 100%;
  border-radius: 4px;
  outline: none;
  font-weight: 700;
  padding: 12px 16px;
  border: 1px solid ${({ theme, error }) => (!error ? theme.stroke : theme.delete)};
  background:  ${({ theme }) => theme.bgPrimary};
  color: ${({ theme }) => theme.textPrimary};
  font-family: 'Plus Jakarta Sans';
  &:focus {
    border-color: ${({ theme, error }) => (!error ? theme.colorPrimary : theme.delete)};
  }
  &::placeholder {
    color: ${({ theme }) => theme.textPrimary};
    opacity: 0.25;
  }
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.textSecundary};
  font-size: 14px;
`;

const Error = styled.span`
  color: ${({ theme }) => theme.delete};
  margin-left: 10px;
  margin-top: 5px;
  font-size: 14px;
  @media (max-width: 500px) {
    font-size: 12px;
  }
`;
