import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findByUsername(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  async findAll() {
    return this.usersRepo.find();
  }

  async create(userDto: { username: string; password: string; role?: string }) {
    const hashed = await bcrypt.hash(userDto.password, 10);
    const user = this.usersRepo.create({ ...userDto, password: hashed });
    return this.usersRepo.save(user);
  }

  async findOne(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async delete(id: number) {
    return this.usersRepo.delete(id);
  }

  async createUser(username: string, password: string, role: string = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ username, password: hashedPassword, role });
    return this.usersRepo.save(user);
  }
}
