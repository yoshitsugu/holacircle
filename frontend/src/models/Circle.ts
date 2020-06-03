import { Role as GraphqlRole } from 'generated/graphql';
import Role from './Role';
import Member from './Member';

type Circle = {
  id: number;
  name: string;
  members: Member[];
  roles: Role[];
  circles: Circle[];
  purpose: string;
  domains: string;
  accountabilities: string;
};

const Circle = {
  scale(circle: Circle): number {
    const subScales = circle.circles.reduce((acc, c) => acc + this.scale(c), 0) + circle.roles.reduce((a) => a + 1, 0);

    return subScales + circle.circles.length + 1;
  },
  from: (c: GraphqlRole): Circle => {
    return {
      id: Number(c.id),
      name: c.name,
      members: c.members.map((m) => Member.from(m)),
      roles: c.roles.filter((r) => !r.isCircle).map((r) => Role.from(r)),
      circles: c.roles.filter((r) => r.isCircle).map((r) => Circle.from(r)),
      purpose: c.purpose,
      domains: c.domains,
      accountabilities: c.accountabilities,
    };
  },
};

export default Circle;
