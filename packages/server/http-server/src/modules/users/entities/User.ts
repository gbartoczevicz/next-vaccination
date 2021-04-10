import { EntityID } from '@server/shared';

interface IUserProps {
  id?: EntityID;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export class User {
  private props: IUserProps;

  get id(): string {
    return this.props.id?.toValue();
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get password(): string {
    return this.props.password;
  }

  constructor(props: IUserProps) {
    this.props = {
      ...props,
      id: props.id || new EntityID()
    };
  }
}
