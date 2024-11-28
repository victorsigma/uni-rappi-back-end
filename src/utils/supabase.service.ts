import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseService {
  private supabase;
  private bucketName = 'uniexpress-img';  // Asegúrate de que el nombre del bucket sea correcto

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );
  }

  // Función para cargar un archivo
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}-${file.originalname}`;

    try {
      // Subir el archivo al bucket
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Error al subir archivo:', error);
        throw new Error(`Error al subir archivo: ${error.message}`);
      }

      if (!data) {
        throw new Error('El archivo no se subió correctamente.');
      }

      // Obtener la URL pública del archivo subido
      const publicURL = `https://${process.env.SUPABASE_URL.split('//')[1]}/storage/v1/object/public/${this.bucketName}/${fileName}`;

      return publicURL;
    } catch (error) {
      console.error('Error en uploadFile:', error);
      throw new Error(`Error en la carga del archivo: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    
    try {
      // Eliminar el archivo del bucket
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([fileName]);

      if (error) {
        console.error('Error al eliminar archivo:', error);
        throw new Error(`Error al eliminar archivo: ${error.message}`);
      }
    } catch (error) {
      console.error('Error en deleteFile:', error);
      throw new Error(`Error al eliminar archivo: ${error.message}`);
    }
  }
}
