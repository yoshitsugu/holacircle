import Member from './Member';

type CircleViewData = {
  name: string;
  value: number;
  children: CircleViewData[];
  isLabel: boolean;
  isCircle: boolean;
  members: Member[];
};

export default CircleViewData;
