import Role from "./Role";


export default class Circle {
  name: string = ''
  roles: Role[] = []
  circles: Circle[] = []

  constructor(init: Partial<Circle>) {
    Object.assign(this, init)
  }

  scale(): number {
    const subScales = this.circles.reduce((acc, circle) => acc + circle.scale(), 0)
    return subScales + this.circles.length + 1;
  }
}

