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
};

export default Circle;
