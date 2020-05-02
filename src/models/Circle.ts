import Role from "./Role";

interface Circle {
  name: string
  roles: Role[]
  circles: Circle[]
}

export default Circle
