import styled from 'styled-components';

import React, { FC, useEffect, useRef } from 'react';
import Circle from 'models/Circle';
import chart from './chart';

const Wrapper = styled.div`
  background: #fff;
  height: 100vh;
  width: 100vw;
`;

export interface HierarchyData {
  name: string;
  value: number;
  children: HierarchyData[];
  isLabel: boolean;
}

const circleToChartData = (circle: Circle): HierarchyData => {
  return {
    name: circle.name,
    value: circle.scale(),
    isLabel: false,
    children: circle.circles
      .map(circleToChartData)
      .concat([{ name: circle.name, value: 2, isLabel: true, children: [] }]),
  };
};

interface CircleChartProps {
  rootCircle: Circle;
}

const CircleChart: FC<CircleChartProps> = ({ rootCircle }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (d3Container.current) {
      chart(d3Container.current, circleToChartData(rootCircle), 300, 300);
    }
  });

  return (
    <Wrapper>
      <svg style={{ width: '100%', height: '100%' }} ref={d3Container} />
    </Wrapper>
  );
};

export default CircleChart;
