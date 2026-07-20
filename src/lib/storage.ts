import { sb } from './supabase'

export function safeName(n: string) {
  return n.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '')
}

/** Upload a file to the public `media` bucket and return its public URL. */
export async function uploadToStorage(folder: string, file: File): Promise<string> {
  const path = `${folder}/${Date.now()}-${safeName(file.name)}`
  const { error } = await sb.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl
}

/** Extract the storage path from a public `media` URL (for cleanup on delete). */
export function pathFromUrl(url: string | null): string | null {
  if (!url) return null
  const parts = url.split('/storage/v1/object/public/media/')
  return parts.length > 1 ? decodeURIComponent(parts[1]) : null
}
