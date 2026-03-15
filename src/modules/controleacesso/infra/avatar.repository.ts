import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "avatars";

export class AvatarRepository {
  constructor(private supabase: SupabaseClient) {}

  async upload(userId: string, file: File): Promise<string> {
    const path = `${userId}/avatar.webp`;

    const { error } = await this.supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        upsert: true,
        contentType: file.type || "image/webp",
      });

    if (error) throw new Error(`Erro ao fazer upload do avatar: ${error.message}`);

    const { data: urlData } = this.supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  async delete(userId: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(BUCKET)
      .remove([`${userId}/avatar.webp`]);

    if (error) throw new Error(`Erro ao remover avatar: ${error.message}`);
  }
}
