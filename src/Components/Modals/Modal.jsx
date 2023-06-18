import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import { AnimeScale } from '../../styles/animations';

function Modal({ onClose, children, noIcon }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalWrapper noIcon={noIcon}>
        <ModalContent onClick={(e) => e.stopPropagation()} noPadding={noIcon}>
          {!noIcon && (
            <CloseModalIcon>
              <CloseIcon onClick={onClose} />
            </CloseModalIcon>
          )}
          {children}
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  noIcon: PropTypes.bool,
};

Modal.defaultProps = {
  onClose: () => {},
  noIcon: false,
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
  padding: 32px 24px;
`;

const ModalWrapper = styled.div`
  background: ${({ theme }) => theme.bgPrimary};
  color: ${({ theme }) => theme.textPrimary};
  border-radius: 6px;
  padding: 24px 32px 32px 24px;
  padding-top: ${({ noIcon }) => (!noIcon ? '48px' : '24px')};
  max-width: 480px;
  width: 100%;
  font-size: 13px;
  animation: ${AnimeScale} 0.5s ease-in-out;
  position: relative;
`;

const ModalContent = styled.div`
  padding: 0px 24px;
  padding: ${({ noPadding }) => (!noPadding ? '0px 24px' : '0px')};
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
    background: ${({ theme }) => theme.scrollColor};
  }
  &::-webkit-scrollbar-track {
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colorPrimary};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colorSecundary};
  }
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
