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
  async create(
    dto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const diskPath = file?.path?.replace(/\\/g, '/'); // uploads/products/uuid.jpg
    const imageUrl = diskPath
      ? this.toPublicImagePath(diskPath)
      : undefined; // products/uuid.jpg

    try {
      return await this.productModel.create({
        ...dto,
        ...(imageUrl ? { imageUrl } : {}),
      });
    } catch (err) {
      if (diskPath) {
        await safeUnlinkByRelativePath(diskPath); // rollback ไฟล์
      }
      throw new InternalServerErrorException('Create product failed');
    }
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
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
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

  // ================= SEARCH =================
  async search(query: any): Promise<Product[]> {
    const { name, minPrice, maxPrice, sortByPrice } = query;
    const filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let queryBuilder = this.productModel.find(filter);

    if (sortByPrice === 'asc') {
      queryBuilder = queryBuilder.sort({ price: 1 });
    } else if (sortByPrice === 'desc') {
      queryBuilder = queryBuilder.sort({ price: -1 });
    }

    return queryBuilder.exec();
  }
}
