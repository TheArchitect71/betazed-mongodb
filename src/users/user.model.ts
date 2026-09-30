import { Schema } from 'mongoose';
export interface User {
  name: string;
  age: number;
  username?: string;
  password?: string;
}
export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
});
