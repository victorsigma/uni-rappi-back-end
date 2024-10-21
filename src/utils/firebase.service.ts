import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private bucket;

  constructor() {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'uni-expresss.appspot.com',
    });

    this.bucket = app.storage().bucket();
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUpload = this.bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(`Error al subir archivo: ${error.message}`);
      });

      stream.on('finish', async () => {
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
        resolve(publicUrl);
      });

      stream.end(file.buffer);
    });
  }
}