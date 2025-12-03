import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { File } from './files/file.entity';
import { AdminSeeder } from './admin.seeder';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USER || 'appuser',
      password: process.env.DB_PASS || 'apppass',
      database: process.env.DB_NAME || 'filemanager',
      entities: [User, File],
      synchronize: true,
      retryAttempts: 10, // número de reintentos
      retryDelay: 5000, // 5 segundos entre intentos
    }),
    AuthModule,
    UsersModule,
    FilesModule,
  ],
  providers: [AdminSeeder], // Registrar el seeder
})
export class AppModule {}
