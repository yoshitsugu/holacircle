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

let Circle = {
  scale(circle: Circle): number {
    const subScales =
      circle.circles.reduce((acc, circle) => acc + this.scale(circle), 0) + circle.roles.reduce((acc) => acc + 1, 0);
    return subScales + circle.circles.length + 1;
  },
};

export default Circle;
