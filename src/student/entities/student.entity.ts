import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Subject } from 'src/subject/entities/subject.entity';

export enum Status {
  accepted = 'Принят',
  new = 'Новая заявка',
  deleted = 'Исключен',
}

@Schema({
  timestamps: true,
})
export class Student {
  @Prop()
  uuid: string;

  @Prop()
  status: Status;

  @Prop()
  study_from: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  subjects: Subject[];

  @Prop()
  patronimic: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
