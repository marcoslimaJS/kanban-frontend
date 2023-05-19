import { useEffect, useState } from 'react';
import styled from 'styled-components';

function ResponseStatus({ status, type }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 5000);
  }, []);

  return (
    <Container show={show}>
      <p>
        {type}
        criado com Sucesso
      </p>
    </Container>
  );
}

export default ResponseStatus;

const Container = styled.div`
  position: fixed;
  right: 0px;
  top: 0px;
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  z-index: 9999999;
  box-shadow: 2px 6px 9px rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
`;
