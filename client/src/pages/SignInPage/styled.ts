import styled from 'styled-components/macro';

export const SignInContainer = styled.section`
  /* 헤더크기만큼 padding-top을 줌 */
  padding-top: 6vh;
`;

export const SignInWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 2.5rem;

  @media only screen and (min-width: 768px) {
    /* PC버전 rem 상대단위 기준점 */
  }
`;
