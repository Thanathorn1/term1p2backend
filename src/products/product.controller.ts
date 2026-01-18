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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

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
  // รองรับทั้งสร้างรายการเดียว และหลายรายการ
  @Post()
  create(@Body() body: CreateProductDto | CreateProductDto[]) {
    // ถ้า body เป็น array → createMany
    if (Array.isArray(body)) {
      return this.productsService.createMany(body);
    }
    // ถ้าเป็น object เดียว → create
    return this.productsService.create(body);
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
