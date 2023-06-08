import { IsInt } from 'class-validator';

export class CreatePerson2Dto {
  name: string;
  @IsInt()
  age: number;
  sex: boolean;
  hobby: Array<string>;
}
