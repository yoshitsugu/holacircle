import { User as GraphqlUser } from 'generated/graphql';

interface Member {
  id: number;
  name: string;
  email: string;
}

const Member = {
  from: (u: GraphqlUser): Member => {
    return {
      id: Number(u.id),
      name: u.name,
      email: u.email,
    };
  },
};

export default Member;
