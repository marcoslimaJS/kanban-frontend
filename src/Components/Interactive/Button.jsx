import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ReactComponent as AddIcon } from '../../assets/icon-add-task-mobile.svg';

function Button({ children, bg, hover, color, fnClick, type, mobile }) {
  return (
    <ButtonStyled bg={bg} hover={hover} color={color} onClick={fnClick} type={type}>
      {!mobile ? children : <AddIcon />}
    </ButtonStyled>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  bg: PropTypes.string,
  hover: PropTypes.string,
  color: PropTypes.string,
  fnClick: PropTypes.func,
  type: PropTypes.string,
  mobile: PropTypes.bool,
};

Button.defaultProps = {
  bg: 'colorPrimary',
  hover: 'colorSecundary',
  color: 'white',
  fnClick: () => {},
  type: 'button',
  mobile: false,
};

export default Button;

const ButtonStyled = styled.button`
  background: ${({ theme, bg }) => theme[bg]};
  color: ${({ theme, color }) => theme[color]};
  padding: 14px 22px;
  border-radius: 24px;
  font-size: 12px;
  width: 100%;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${({ theme, hover }) => theme[hover]};
  }
`;
