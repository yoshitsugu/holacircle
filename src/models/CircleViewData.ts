import Member from './Member';

type CircleViewData = {
  id: number;
  name: string;
  value: number;
  children: CircleViewData[];
  isLabel: boolean;
  isCircle: boolean;
  members: Member[];
};

export default CircleViewData;
