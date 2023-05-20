import React from 'react';
import styled from 'styled-components';

function Loading() {
  return (
    <Container>
      <LoadingStyled />
    </Container>
  );
}

export default Loading;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow-y: auto;
  padding: 48px 16px;
`;

const LoadingStyled = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 8px solid #fff;
  border-top-color: ${({ theme }) => theme.colorPrimary};
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
