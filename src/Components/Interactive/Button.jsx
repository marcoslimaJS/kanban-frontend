import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ReactComponent as AddIcon } from '../../assets/icon-add-task-mobile.svg';

function Button({
  children,
  bg,
  hover,
  color,
  fnClick,
  type,
  mobile,
  loading,
}) {
  return (
    <ButtonStyled
      bg={bg}
      hover={hover}
      color={color}
      onClick={fnClick}
      type={type}
      disabled={loading}
      loading={loading}
    >
      {!mobile ? children : <AddIcon />}
      {loading && <Loading />}
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
  loading: PropTypes.bool,
};

Button.defaultProps = {
  bg: 'colorPrimary',
  hover: 'colorSecundary',
  color: 'white',
  fnClick: () => {},
  type: 'button',
  mobile: false,
  loading: false,
};

export default Button;

const ButtonStyled = styled.button`
  background: ${({ theme, bg, loading, hover }) => (!loading ? theme[bg] : theme[hover])};
  color: ${({ theme, color }) => theme[color]};
  padding: 14px 22px;
  border-radius: 24px;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:hover {
    background: ${({ theme, hover }) => theme[hover]};
  }
`;

const Loading = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  border-top-color: #000;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
