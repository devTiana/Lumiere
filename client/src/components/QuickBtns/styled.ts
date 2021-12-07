import styled from 'styled-components';

export const QuickBtnsContainer = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 2.8rem;
  display: flex;
  flex-direction: column;

  > a {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  > a:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  > a:last-child {
    margin-top: 0.2rem;
  }
`;