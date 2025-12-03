import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() body: { username: string; password: string; role?: string }) {
    return this.usersService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(+id);
  }

  // Endpoint para crear usuarios (solo admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('register')
  async register(@Body() body: { username: string; password: string; role: string }) {
    return this.usersService.createUser(body.username, body.password, body.role);
  }
  
}
