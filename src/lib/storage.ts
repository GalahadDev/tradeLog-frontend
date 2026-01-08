import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const uploadScreenshot = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Subir al bucket 'trade-screenshots'
    const { error: uploadError } = await supabase.storage
      .from('trade-screenshots')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    // 2. Obtener URL pública
    const { data } = supabase.storage
      .from('trade-screenshots')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error in storage service:', error);
    return null;
  }
};