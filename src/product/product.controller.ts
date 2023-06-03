import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Get,
  Delete,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ProductDto } from './dto/createProduct.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductService } from './product.service';
import { RoleCheckInterceptor } from '../interceptor/checkrole';
import JwtAuthenticationGuard from '../auth/guard/Jwt-authentication.guard';
import { UpdateProductDto } from './dto/updateProduct.dto';
@Controller('product')
export class ProductController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productService: ProductService,
  ) {}

  @Post('uploadImage')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  @Post('createProduct')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(RoleCheckInterceptor)
  createProduct(@Body() body: ProductDto) {
    return this.productService.createProduct(body);
  }

  @Get('getFourProducts/:id')
  getFourProducts(@Param('id') id: string) {
    return this.productService.getFourProducts(id);
  }

  @Get('searchProductByBrandAndPrice')
  searchProductByBrandAndPrice(
    @Query('brand') brand: string,
    @Query('min') min: number,
    @Query('max') max: number,
    @Query('name') name: string,
  ) {
    const data = { brand, min, max, name };

    return this.productService.searchProductByBrandAndPrice(data);
  }

  // add base products
  @Get('createProducts')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(RoleCheckInterceptor)
  createBaseProduct() {
    return this.productService.createMultipleProduct();
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id') productId: string) {
    return this.productService.getProductById(productId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(RoleCheckInterceptor)
  updateProduct(
    @Param('id') productId: string,
    @Body() product: UpdateProductDto,
  ) {
    return this.productService.updateProduct(productId, product);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(RoleCheckInterceptor)
  deleteProduct(@Param('id') productId: string) {
    return this.productService.deleteProduct(productId);
  }
}
