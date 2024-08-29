import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Event extends mongoose.Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({
    type: mongoose.SchemaTypes.Mixed,
  })
  payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ name: 1, type: -1 }); // Compound index referencing multiple properties
