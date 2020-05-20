import React, { FC } from 'react';
import styled from 'styled-components';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import CircleChart from 'components/CircleChart';
import CircleInfo from 'components/CircleInfo';
import Circle from 'models/Circle';
import Role from 'models/Role';

const Wrapper = styled.div`
  display: flex;

  *:focus {
    outline: none;
  }
`;

const Left = styled.div`
  background: transparent;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  height: 100vh;
  width: 60vw;
`;

const Right = styled.div`
  width: 40vw;
`;

const NoDetail = styled.div`
  padding: 40px;
`;

const focusCircle = (circle: Circle, focus: number | null): Circle | Role | null => {
  if (focus === null) {
    return null;
  }

  if (circle.id === focus) {
    return circle;
  }

  if (circle.roles.length > 0) {
    const f = circle.roles.find((role) => {
      return role.id === focus;
    });
    if (f) {
      return f;
    }
  }

  if (circle.circles.length > 0) {
    let f: Circle | Role | null = null;
    circle.circles.some((c) => {
      f = focusCircle(c, focus);
      return f;
    });
    if (f) {
      return f;
    }
  }

  return null;
};

const CircleChartContainer: FC<{}> = () => {
  const { rootCircle } = useSelector((state: RootState) => state.circle);
  const { focus } = useSelector((state: RootState) => state.focus);
  const circle = focusCircle(rootCircle, focus);

  if (!circle) {
    return (
      <Wrapper>
        <NoDetail>
          <CircleChart rootCircle={rootCircle} />
        </NoDetail>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Left>
        <CircleInfo focus={circle} />
      </Left>
      <Right>
        <CircleChart rootCircle={rootCircle} />
      </Right>
    </Wrapper>
  );
};

export default CircleChartContainer;