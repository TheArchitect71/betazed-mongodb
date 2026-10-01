import { Schema, Types } from 'mongoose';
export interface Person {
  owner: Types.ObjectId;
  name: string;
  role: string;
  organization: string;
  status: string;
  expertise: string;
  notes: string;
  spaceWalks?: number;
  spaceFlights?: number;
  missions?: string;
  almaMater?: string;
}
export const PersonSchema = new Schema<Person>(
  {
    owner: { type: Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true, maxlength: 120 },
    role: { type: String, required: true, maxlength: 120 },
    organization: { type: String, default: '', maxlength: 160 },
    status: { type: String, required: true, maxlength: 80 },
    expertise: { type: String, default: '', maxlength: 200 },
    notes: { type: String, default: '', maxlength: 4000 },
    spaceWalks: { type: Number, min: 0 },
    spaceFlights: { type: Number, min: 0 },
    missions: { type: String, maxlength: 2000 },
    almaMater: { type: String, maxlength: 1000 },
  },
  { timestamps: true },
);
