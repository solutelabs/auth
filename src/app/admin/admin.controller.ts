import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { RolesGuard } from './guard/role.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Delete('delete/user/:id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.adminService.deleteUser(id);
  }

  @Post('create/user')
  @SetMetadata('roles', ['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createUser(@Body() user: CreateUserDto) {
    return await this.adminService.createUser(user);
  }

  @Put('update/user')
  @SetMetadata('roles', ['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(@Body() user: UpdateUserDto) {
    return await this.adminService.updateUser(user);
  }

  @Post('deactivate/user/:id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deactivateUser(@Param('id') id: string) {
    return await this.adminService.deactivateUser(id);
  }

  @Post('activate/user/:id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async activateUser(@Param('id') id: string) {
    return await this.adminService.activateUser(id);
  }
}
