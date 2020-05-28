import { Role as GraphqlRole } from 'generated/graphql';
import Member from './Member';

type Role = {
  id: number;
  name: string;
  members: Member[];
  purpose: string;
  domains: string;
  accountabilities: string;
};

const Role = {
  from: (c: GraphqlRole): Role => {
    return {
      id: Number(c.id),
      name: c.name,
      members: [],
      purpose: c.purpose,
      domains: c.domains,
      accountabilities: c.accountabilities,
    };
  },
};

export default Role;
