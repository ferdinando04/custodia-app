import mongoose, { Schema, model, models } from "mongoose";

export type OrderStatus = "pendiente" | "en_camino" | "entregado" | "cancelado";

export interface IOrder {
  _id?: string;
  clienteName: string;
  clientePhone: string;
  address: string;
  items: string;          // descripción del pedido en texto libre
  total?: number;
  status: OrderStatus;
  riderId?: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    clienteName:  { type: String, required: true },
    clientePhone: { type: String, required: true },
    address:      { type: String, required: true },
    items:        { type: String, required: true },
    total:        { type: Number },
    status:       {
      type: String,
      enum: ["pendiente", "en_camino", "entregado", "cancelado"],
      default: "pendiente",
    },
    riderId:      { type: Schema.Types.ObjectId, ref: "Rider" },
    businessId:   { type: Schema.Types.ObjectId, required: true },
    notes:        { type: String },
  },
  { timestamps: true }
);

// Evita re-compilar el modelo en hot-reload de Next.js
const Order = models.Order || model<IOrder>("Order", OrderSchema);
export default Order;
