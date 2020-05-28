import styled from 'styled-components';

const HcButton = styled.button`
  position: relative;
  display: inline-block;
  padding: 0.25em 0.5em;
  text-decoration: none;
  color: #fff;
  background: #03a9f4;
  border: solid 1px #0f9ada;
  border-radius: 4px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 10px;
  min-width: 60px;
  font-size: 1rem;

  &:active {
    border: solid 1px #03a9f4;
    box-shadow: none;
    text-shadow: none;
  }
`;

export default HcButton;
