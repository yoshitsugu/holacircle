import React, { FC } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from 'redux/rootReducer';
import CircleChart from 'components/CircleChart';
import CircleInfo from 'components/CircleInfo';
import Circle from 'models/Circle';
import Role from 'models/Role';
import { useGetRolesQuery } from 'generated/graphql';
import { setFocus } from 'redux/modules/focusModule';

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

const focusCircle = (circle: Circle | null, focus: number | null): Circle | Role | null => {
  if (circle === null || focus === null) {
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
  const queryResult = useGetRolesQuery({
    variables: {},
    fetchPolicy: 'cache-and-network',
  });
  const dispatch = useDispatch();
  const rootCircle = queryResult.data ? Circle.from(queryResult.data.role) : null;
  const { focus } = useSelector((state: RootState) => state.focus);
  if (!rootCircle) {
    return <Wrapper />;
  }
  if (!focus) {
    dispatch(setFocus(rootCircle.id));
  }
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
        <CircleInfo focus={circle} refetch={queryResult.refetch} />
      </Left>
      <Right>
        <CircleChart rootCircle={rootCircle} />
      </Right>
    </Wrapper>
  );
};

export default CircleChartContainer;
