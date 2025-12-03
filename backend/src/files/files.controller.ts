import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as path from 'path';
import { Response, Request } from 'express';
import { User } from '../users/user.entity';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request & { user?: User }) {
    console.log('Usuario en la solicitud:', req.user);
    if (!req.user || !req.user.id) {
      throw new Error('User not found');
    }
    return this.filesService.createFile(file, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list() {
    return this.filesService.getAllFiles();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async download(@Param('id') id: number, @Res() res: Response) {
    const file = await this.filesService.getFileById(id);
    if (!file) return res.status(404).send('Archivo no encontrado');
    res.download(path.join('./uploads', file.filename), file.original_name);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.filesService.deleteFile(id);
  }
}
