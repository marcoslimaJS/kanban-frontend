import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import { AnimeScale } from '../../styles/animations';

function Modal({ onClose, children }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()} >
        <CloseModalIcon>
          <CloseIcon onClick={onClose} />
        </CloseModalIcon>
        {children}
      </ModalWrapper>
    </ModalOverlay>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  onClose: () => {},
};

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9000;
  overflow-y: auto;
  padding: 32px 24px;
`;

const ModalWrapper = styled.div`
  background-color: #fff;
  border-radius: 6px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  font-size: 13px;
  animation: ${AnimeScale} 0.5s ease-in-out;
  position: relative;
`;

const CloseModalIcon = styled.span`
  svg {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    padding: 5px;
  }

  svg path {
    fill: ${({ theme }) => theme.colorPrimary};
    transition: 0.5s;
  }
  svg:hover path {
    fill: ${({ theme }) => theme.colorSecundary};
  }
`;
