import React, { FC, useRef } from 'react';
import styled from 'styled-components';

import Circle from 'models/Circle';
import Role from 'models/Role';
import CircleViewData from 'models/CircleViewData';
import useZoomableChart from 'hooks/useZoomableChart';

const Wrapper = styled.div`
  background: #fff;
  height: 100vh;
  width: 100vw;

  *:focus {
    outline: none;
  }
`;

const circleToChartData = (circle: Circle): CircleViewData => {
  return {
    name: circle.name,
    value: circle.scale(),
    isLabel: false,
    children: circle.circles
      .map(circleToChartData)
      .concat(circle.roles.map(roleToChartData))
      .concat([
        {
          name: circle.name,
          value: Math.max(circle.scale() / 4, 2),
          isLabel: true,
          children: [],
          isCircle: false,
          members: [],
        },
      ]),
    isCircle: true,
    members: [],
  };
};

const roleToChartData = (role: Role): CircleViewData => {
  return {
    name: role.name,
    value: 1,
    isLabel: false,
    children: [],
    isCircle: false,
    members: role.members,
  };
};

interface CircleChartProps {
  rootCircle: Circle;
}

const CircleChart: FC<CircleChartProps> = ({ rootCircle }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  useZoomableChart(d3Container, circleToChartData(rootCircle), 2000, 2000);

  return (
    <Wrapper>
      <svg style={{ width: '100%', height: '100%' }} ref={d3Container} />
    </Wrapper>
  );
};

export default CircleChart;
