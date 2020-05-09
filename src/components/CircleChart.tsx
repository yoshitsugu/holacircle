import React, { FC } from 'react';

import Circle from 'models/Circle';
import Role from 'models/Role';
import CircleViewData from 'models/CircleViewData';
import useZoomableChart from 'hooks/useZoomableChart';

const circleToChartData = (circle: Circle): CircleViewData => {
  return {
    id: circle.id,
    name: circle.name,
    value: Circle.scale(circle),
    isLabel: false,
    children: circle.circles
      .map(circleToChartData)
      .concat(circle.roles.map(roleToChartData))
      .concat([
        {
          id: circle.id,
          name: circle.name,
          value: Math.max(Circle.scale(circle) / 4, 2),
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
    id: role.id,
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
  const d3Container = useZoomableChart(circleToChartData(rootCircle), 2000, 2000);

  return <svg style={{ width: '100%', height: '100%' }} ref={d3Container} />;
};

export default CircleChart;
