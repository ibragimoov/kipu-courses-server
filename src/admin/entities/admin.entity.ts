import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({ unique: [true, 'Логин уже используется'] })
  login: string;

  @Prop()
  password: string;

  @Prop({ default: 'Модератор' })
  name: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
