import { supabase } from './supabase.js';

export async function uploadFile(
  path: string,
  file: File,
  bucket: string,
): Promise<{ error?: string; data?: unknown }> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error('Error uploading file:', error.message);
    return { error: error.message };
  }
  return { data };
}

export async function upsertFile(
  path: string,
  file: File,
  bucket: string,
): Promise<{ error?: string; data?: unknown }> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });
  if (error) {
    return { error: error.message };
  }
  return { data };
}

export async function deleteFile(path: string, bucket: string): Promise<{ error?: string; data?: unknown }> {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    return { error: error.message };
  }
  return { data };
}
