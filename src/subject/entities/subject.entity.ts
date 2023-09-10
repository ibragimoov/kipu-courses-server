import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Subject {
  @Prop()
  title: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
