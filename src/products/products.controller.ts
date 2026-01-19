import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Head,
  Options,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PRODUCT_IMAGE } from './products.constants';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  // ================= READ ALL =================
  // GET /products
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ================= SEARCH (ข้อ 2 Assignment) =================
  // GET /products/search?name=board&minPrice=10&maxPrice=5000&sortByPrice=desc
  @Get('search')
  search(@Query() query: any) {
    // ส่ง query parameters ไปให้ service จัดการเงื่อนไขการค้นหา
    return this.productsService.search(query);
  }

  // ================= READ ONE =================
  // GET /products/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // ================= HEAD =================
  // HEAD /products/:id
  @Head(':id')
  headOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // ================= OPTIONS =================
  // OPTIONS /products/:id
  @Options(':id')
  optionsOne() {
    return {};
  }

  // ================= CREATE =================
  // POST /products
  // - รับข้อมูลสินค้าจาก form-data
  // - รองรับการอัปโหลดไฟล์รูป (image) หรือไม่มีก็ได้
  @Post()
  @UseInterceptors(FileInterceptor('image')) // field name ต้องตรงกับ form-data
  create(
    @Body() dto: CreateProductDto,

    // รับไฟล์จาก multipart/form-data
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, // มีหรือไม่มีก็ได้
        validators: [
          new MaxFileSizeValidator({
            maxSize: PRODUCT_IMAGE.MAX_SIZE,
          }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    // ห้าม return object เอง
    // ส่งให้ service จัดการบันทึก DB
    return this.productsService.create(dto, file);
  }
  
  // ================= REPLACE (PUT) =================
  // PUT /products/:id
  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // ================= UPDATE (PATCH) =================
  // PATCH /products/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // ================= DELETE =================
  // DELETE /products/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
