  import { Injectable } from '@nestjs/common';
  import { createClient } from '@supabase/supabase-js';

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
      const fileName = `${Date.now()}-${file.originalname}`;
    
      try {
        const { data, error } = await this.supabase.storage
          .from(this.bucketName)
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });
    
        if (error) {
          // Agregar detalles adicionales del error
          console.error('Error al subir archivo:', error);
          throw new Error(`Error al subir archivo: ${error.message}`);
        }
    
        if (!data) {
          throw new Error('El archivo no se subió correctamente.');
        }
    
        const publicUrl = this.supabase.storage
          .from(this.bucketName)
          .getPublicUrl(fileName).publicURL;
    
        if (!publicUrl) {
          throw new Error('No se pudo generar la URL pública para el archivo.');
        }
    
        return publicUrl;
      } catch (error) {
        console.error('Error en uploadFile:', error);  // Para ver detalles del error
        throw new Error(`Error en la carga del archivo: ${error.message}`);
      }
    }
    
  }
