import { PartialType } from '@nestjs/mapped-types';
import { CreatePerson4Dto } from './create-person4.dto';

export class UpdatePerson4Dto extends PartialType(CreatePerson4Dto) {}
