// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { safeUnlinkByRelativePath } from '../common/utils/file.utils';
import { deleteFileIfExists } from '../common/utils/file.utils';


@Injectable()
export class ProductsService {
  // Inject Product Model เข้ามาใช้งาน
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // ================= PRIVATE UTILS =================
  private toPublicImagePath(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/'); // กัน Windows path
    // ตัด uploads/ หรือ ./uploads/ ออก
    return normalized
      .replace(/^\.?\/?uploads\//, '')
      .replace(/^uploads\//, '');
  }

  // ================= CREATE =================
   async create(dto: CreateProductDto, file?: Express.Multer.File) {

    // รวมข้อมูลจาก body + ชื่อไฟล์รูป
    const product = new this.productModel({
      ...dto,

      // ถ้ามีไฟล์ → เก็บ filename
      // ถ้าไม่มี → null
      imageUrl: file ? `products/${file.filename}` : null,
    });

    // save ลง MongoDB จริง ๆ
    return await product.save();
  }

  // ================= CREATE MANY =================
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
  async update(
  id: string,
  dto: UpdateProductDto,
  file?: Express.Multer.File,
  ): Promise<Product> {
  const product = await this.productModel.findById(id).exec();

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  // 🟡 ถ้ามีอัปโหลดรูปใหม่
  if (file) {
    // 🔥 ลบรูปเก่า
    if (product.imageUrl) {
      deleteFileIfExists(product.imageUrl);
    }

    // เก็บ path ใหม่
    product.imageUrl = `products/${file.filename}`;
  }

  Object.assign(product, dto);
  return await product.save();
  }

  // ================= DELETE =================
 async remove(id: string): Promise<Product> {
  const product = await this.productModel.findById(id).exec();

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  // 🔥 ลบไฟล์รูปก่อน
  if (product.imageUrl) {
    deleteFileIfExists(product.imageUrl);
  }

  await product.deleteOne();
  return product;
  }

   // ================= SEARCH =================
  async search(query: any): Promise<Product[]> {
  const { name, minPrice, maxPrice, sortByPrice, color } = query;
  const filter: any = {};

  // ===== search by name =====
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  // ===== search color (มีสีนี้เป็นองค์ประกอบก็พอ) =====
  if (color) {
    filter.color = { $in: [color] };
  }

  // ===== search by price =====
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let queryBuilder = this.productModel.find(filter);

  // ===== sort =====
  if (sortByPrice === 'asc') {
    queryBuilder = queryBuilder.sort({ price: 1 });
  } else if (sortByPrice === 'desc') {
    queryBuilder = queryBuilder.sort({ price: -1 });
  }

  return queryBuilder.exec();
  }

}
