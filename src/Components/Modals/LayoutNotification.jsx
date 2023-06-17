import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AnimeScale } from '../../styles/animations';

function LayoutNotification({ closeModal }) {
  return (
    <ModalOverlay>
      <ModalWrapper>
        <ImagesContainer>
          <ImageDefault>
            <img src="/default-layout.png" alt="" />
          </ImageDefault>
          <ImageDefault>
            <img src="/default-layout.png" alt="" />
          </ImageDefault>
        </ImagesContainer>
      </ModalWrapper>
    </ModalOverlay>
  );
}

LayoutNotification.propTypes = {
  closeModal: PropTypes.func,
};

LayoutNotification.defaultProps = {
  closeModal: () => {},
};

export default LayoutNotification;

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
  padding: 48px 32px 32px 24px;
  width: 100%;
  max-width: 800px;
  font-size: 13px;
  animation: ${AnimeScale} 0.5s ease-in-out;
  position: relative;
`;

const ImagesContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const ImageDefault = styled.div`
  padding: 15px 0px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  img {
    max-height: 300px;
  }
`;

const ImageSimple = styled.div``;
