import { PartialType } from '@nestjs/mapped-types';
import { CreatePerson3Dto } from './create-person3.dto';

export class UpdatePerson3Dto extends PartialType(CreatePerson3Dto) {}
