import React, { FC } from 'react';
import styled from 'styled-components';

import Circle from 'models/Circle';
import Role from 'models/Role';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  justify-content: flex-start;
  padding: 0 20px 0 40px;

  h1 {
    margin: 20px 0 40px 0;
  }
`;

const InfoSection = styled.section`
  h2 {
    border-bottom: 1px solid #d5dbe1;
    font-size: 24px;
    margin: 0;
    padding-bottom: 10px;
  }
  margin-bottom: 40px;
`;

const InfoDetail = styled.div`
  padding: 10px 0;
`;

type CircleInfoProps = {
  focus: Circle | Role;
};

const CircleInfo: FC<CircleInfoProps> = ({ focus }) => {
  return (
    <Wrapper>
      <h1>{focus.name}</h1>
      <InfoSection>
        <h2>Purpose</h2>
        <InfoDetail>{focus.purpose}</InfoDetail>
      </InfoSection>
      <InfoSection>
        <h2>Domains</h2>
        <InfoDetail>{focus.domains}</InfoDetail>
      </InfoSection>
      <InfoSection>
        <h2>Accountablities</h2>
        <InfoDetail>{focus.accountabilities}</InfoDetail>
      </InfoSection>
    </Wrapper>
  );
};

export default CircleInfo;
