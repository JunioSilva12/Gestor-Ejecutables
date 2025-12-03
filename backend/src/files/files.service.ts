import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(@InjectRepository(File) private filesRepo: Repository<File>) {}

  async createFile(file: Express.Multer.File, userId: number) {
    const f = this.filesRepo.create({
      filename: file.filename,
      original_name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });
    return this.filesRepo.save(f);
  }

  async getAllFiles() {
    return this.filesRepo.find({ relations: ['user'] });
  }

  async getFileById(id: number) {
    return this.filesRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async deleteFile(id: number) {
    const file = await this.getFileById(id);
    if (!file) return null;
    fs.unlinkSync(path.join('./uploads', file.filename));
    return this.filesRepo.delete(id);
  }
}

