import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class UploadService {
  uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
  uploadPDF(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'pdf',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteByPublicId(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  deletePDF(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'image' },
        (error) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }
}
