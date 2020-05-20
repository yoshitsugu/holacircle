import Member from './Member';

type Role = {
  id: number;
  name: string;
  members: Member[];
  purpose: string;
  domains: string;
  accountabilities: string;
};

export default Role;
