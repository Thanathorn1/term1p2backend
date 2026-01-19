import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// สร้าง type ProductDocument โดยรวม Product กับ Document ของ Mongoose
// ใช้สำหรับกำหนดชนิดข้อมูลให้ Model ใน Service
export type ProductDocument = Product & Document;

// @Schema บอก NestJS ว่า class นี้คือ MongoDB Schema
// timestamps: true จะสร้าง createdAt และ updatedAt ให้อัตโนมัติ
@Schema({ timestamps: true })
export class Product {

  // @Prop กำหนด field name
  // required: true คือจำเป็นต้องมีค่า
  @Prop({ required: true })
  name: string;

  // price: ราคาสินค้า
  // - required: ต้องมีค่าเสมอ
  // - min: ค่าต้องไม่ต่ำกว่า 0 (ห้ามติดลบ)
  // - type: ชนิดข้อมูลเป็นตัวเลข
  // - default: หากไม่กำหนดค่า จะตั้งเป็น 0
  @Prop({ required: true, min: 0, type: Number, default: 0 })
  price: number;


  // field description
  // ไม่บังคับกรอก
  @Prop()
  description: string;

  // field color
  // type: [String] หมายถึงเก็บข้อมูลเป็น array ของ string
  // default: [] ถ้าไม่ส่งค่ามา จะเป็น array ว่าง
  // รองรับหลายสี เช่น ["red", "blue", "black"]
  @Prop({ type: [String], default: [] })
  color: string[];
}

// แปลง class Product ให้เป็น Mongoose Schema
// เพื่อนำไปใช้กับ MongooseModule.forFeature()
export const ProductSchema = SchemaFactory.createForClass(Product);
