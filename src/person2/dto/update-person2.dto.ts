import { PartialType } from '@nestjs/mapped-types';
import { CreatePerson2Dto } from './create-person2.dto';

export class UpdatePerson2Dto extends PartialType(CreatePerson2Dto) {}
