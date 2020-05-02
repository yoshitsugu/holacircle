import React, { FC, useEffect, useRef } from 'react';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import Circle from 'models/Circle';
import CircleChart from 'components/CircleChart';

const CircleChartContainer: FC<{}> = () => {
  const { rootCircle } = useSelector((state: RootState) => state.circle)
  return <CircleChart rootCircle={rootCircle} />
};

interface HierarchyData {
  name: string;
  value: number;
  children: HierarchyData[];
};

const circleToChartData = (circle: Circle): HierarchyData => {
  return {
    name: circle.name,
    value: circle.scale(),
    children: circle.circles.map(circleToChartData),
  };
}

export default CircleChartContainer;
