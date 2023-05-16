import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

function Textarea({ label, placeHolder, type, id, error, defaultValue, onChange, onBlur }) {
  return (
    <Container>
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <TextareaStyle
        type={type}
        id={id}
        placeholder={placeHolder}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
      />
      <Error>{error}</Error>
    </Container>
  );
}

Textarea.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  placeHolder: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

Textarea.defaultProps = {
  label: '',
  type: 'text',
  id: '',
  error: '',
  placeHolder: '',
  defaultValue: '',
  onChange: () => {},
  onBlur: () => {},
};

export default Textarea;

const Container = styled.div`
  position: relative;
`;

const TextareaStyle = styled.textarea`
  width: 100%;
  border-radius: 4px;
  outline: none;
  font-weight: 700;
  padding: 12px 16px;
  resize: none;
  overflow-y: hidden;
  height: 112px;
  border: 1px solid ${({ theme }) => theme.stroke};
  font-family: 'Plus Jakarta Sans';
  &:focus {
    border-color: ${({ theme }) => theme.colorPrimary};
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
  span {
    font-size: 14px;
  }
`;

const Error = styled.span`
  color: ${({ theme }) => theme.delete};
  position: absolute;
  right: 16px;
  bottom: 34px;
  font-size: 14px;
`;
