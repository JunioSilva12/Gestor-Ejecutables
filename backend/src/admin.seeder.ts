import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    const adminExists = await this.usersService.findByUsername('admin');
    if (!adminExists) {
      await this.usersService.createUser('admin', 'Admin123!', 'admin');
      console.log('Usuario administrador creado: admin / Admin123!');
    }
  }
}
