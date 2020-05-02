import React, { FC } from 'react';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import CircleChart from 'components/CircleChart';

const CircleChartContainer: FC<{}> = () => {
  const { rootCircle } = useSelector((state: RootState) => state.circle)

  return <CircleChart rootCircle={rootCircle} />
};

export default CircleChartContainer;
