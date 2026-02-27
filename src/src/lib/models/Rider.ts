import { Schema, model, models } from "mongoose";

export type RiderStatus = "disponible" | "en_ruta" | "inactivo";

export interface IRider {
  _id?: string;
  name: string;
  phone: string;
  status: RiderStatus;
  businessId: string;
  activeOrders?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const RiderSchema = new Schema<IRider>(
  {
    name:       { type: String, required: true },
    phone:      { type: String, required: true },
    status:     {
      type: String,
      enum: ["disponible", "en_ruta", "inactivo"],
      default: "disponible",
    },
    businessId: { type: String, required: true },
  },
  { timestamps: true }
);

// Evita re-compilar el modelo en hot-reload de Next.js
const Rider = models.Rider || model<IRider>("Rider", RiderSchema);
export default Rider;
