import React, { FC, useEffect, useRef } from 'react';
import Circle from 'models/Circle';
import chart from './chart';

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

interface CircleChartProps {
  rootCircle: Circle
}

const CircleChart: FC<CircleChartProps> = ({
  rootCircle
}) => {
  const d3Container = useRef(null)

  useEffect(() => {
    if (d3Container.current) {
      chart(d3Container.current, circleToChartData(rootCircle), 300, 300)
    }
  })

  return <svg ref={d3Container} />
};

export default CircleChart;
