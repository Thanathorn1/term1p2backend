// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  // Inject Product Model เข้ามาใช้งาน
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // ================= CREATE =================
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async createMany(createProductDtos: CreateProductDto[]): Promise<Product[]> {
    return (await this.productModel.insertMany(createProductDtos)) as Product[];
  }

  // ================= READ =================
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // ================= UPDATE =================
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  // ================= DELETE =================
  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }

  // ================= SEARCH (ข้อ 2 ของ Assignment) =================
  async search(query: any): Promise<Product[]> {
    const {
      name,        // คำค้นหาชื่อสินค้า
      minPrice,    // ราคาต่ำสุด
      maxPrice,    // ราคาสูงสุด
      sortByPrice, // asc | desc
    } = query;

    // object สำหรับเก็บเงื่อนไขการค้นหา
    const filter: any = {};

    // ค้นหาชื่อสินค้าแบบบางส่วน (ไม่สนตัวพิมพ์เล็ก-ใหญ่)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    // ค้นหาราคาเป็นช่วง
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); // >=
      if (maxPrice) filter.price.$lte = Number(maxPrice); // <=
    }

    // สร้าง query จาก filter
    let queryBuilder = this.productModel.find(filter);

    // เรียงราคาตามที่ผู้ใช้กำหนด
    if (sortByPrice === 'asc') {
      queryBuilder = queryBuilder.sort({ price: 1 }); // ถูก → แพง
    } else if (sortByPrice === 'desc') {
      queryBuilder = queryBuilder.sort({ price: -1 }); // แพง → ถูก
    }

    // รัน query และคืนค่าผลลัพธ์
    return queryBuilder.exec();
  }
}