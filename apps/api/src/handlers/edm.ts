import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteFile, uploadFile, upsertFile } from '../libs/storage.js';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  createFolderRoute,
  deleteFileRoute,
  deleteFolderRoute,
  downloadFileRoute,
  getAllFiles,
  updateFile,
  updateFolderRoute,
  uploadFileRoute,
} from '../routes/edm.js';
import { checkRole } from '../utils/context.js';
import { Role, type Variables } from '../validators/general.js';

export const edm = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

edm.openapi(getAllFiles, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  let {
    data: files,
    error,
    count: filesCount,
  } = await supabase.from('DOCUMENTS').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (error) {
    return c.json({ error: error.message }, 500);
  }

  // remove all documents where isAdmin is true if user is not admin
  const userAdmin = roles.includes(Role.ADMIN) || roles.includes(Role.DIRECTOR);
  if (!userAdmin && files) {
    files = files.filter((doc) => !doc.isAdmin);
  }

  let {
    data: folders,
    count: foldersCount,
    error: folderError,
  } = await supabase.from('FOLDERS').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (folderError) {
    return c.json({ error: folderError.message }, 500);
  }

  if (!userAdmin && folders) {
    folders = folders.filter((folder) => !folder.isAdmin);
  }

  return c.json({ files, filesCount: filesCount || 0, folders, foldersCount: foldersCount || 0 }, 200);
});

edm.openapi(uploadFileRoute, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { file, name, description, isAdmin, assembly, folder } = c.req.valid('form');

  const { error } = await uploadFile(name, file, 'edm');
  if (error) {
    return c.json({ error }, 500);
  }

  const { error: insertDoc } = await supabase
    .from('DOCUMENTS')
    .insert({ name: name, description: description, owner: user.id, isAdmin, type: file.type, assembly, folder });
  if (insertDoc) {
    return c.json({ error: 'Error inserting document' }, 500);
  }

  return c.json({ message: 'File uploaded' }, 200);
});

edm.openapi(deleteFileRoute, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { id, name } = c.req.valid('json');

  const { data: isOwner, error: ownerError } = await supabase
    .from('DOCUMENTS')
    .select('owner')
    .eq('id', id)
    .eq('name', name)
    .single();

  if (ownerError) {
    return c.json({ error: ownerError.message }, 500);
  }

  if (isOwner && isOwner.owner !== user.id) {
    return c.json({ error: 'You are not the owner of this document' }, 400);
  }

  const { error: deleteDoc } = await supabase.from('DOCUMENTS').delete().eq('id', id).eq('name', name);
  if (deleteDoc) {
    return c.json({ error: 'Error deleting document' }, 500);
  }

  const { error } = await deleteFile(name, 'edm');
  if (error) {
    return c.json({ error }, 500);
  }

  return c.json({ message: 'File deleted' }, 200);
});

edm.openapi(downloadFileRoute, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');

  const { data, error } = await supabase.from('DOCUMENTS').select('name, isAdmin').eq('id', id).single();
  if (error || !data) {
    return c.json({ error: 'File not found' }, 404);
  }

  if (data.isAdmin && !roles.includes(Role.ADMIN) && !roles.includes(Role.DIRECTOR)) {
    return c.json({ error: 'You do not have access to this file' }, 403);
  }

  const { data: file, error: downloadError } = await supabase.storage.from('edm').download(data.name);
  if (downloadError) {
    return c.json({ error: downloadError.message }, 500);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return c.newResponse(buffer, 200, { 'Content-Type': file.type });
});

edm.openapi(updateFile, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { id } = c.req.valid('param');
  const { file, description, isAdmin, folder, assembly } = c.req.valid('form');

  const { data: doc, error: docError } = await supabase.from('DOCUMENTS').select('name, type').eq('id', id).single();

  if (docError) {
    return c.json({ error: docError.message }, 500);
  }
  const { error: updateDoc } = await supabase
    .from('DOCUMENTS')
    .update({ description, isAdmin, updated_at: new Date().toLocaleDateString(), assembly, folder })
    .eq('id', id);
  if (updateDoc) {
    return c.json({ error: 'Error updating document' }, 500);
  }

  if (file) {
    const { error } = await upsertFile(doc.name, file, 'edm');
    if (error) {
      return c.json({ error }, 500);
    }
    if (doc.type !== file.type) {
      const { error: updateType } = await supabase.from('DOCUMENTS').update({ type: file.type }).eq('id', id);
      if (updateType) {
        return c.json({ error: 'Error updating document' }, 500);
      }
    }
  }

  return c.json({ message: 'File updated' }, 200);
});

edm.openapi(createFolderRoute, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { name, parent, isAdmin } = c.req.valid('json');

  const { error } = await supabase.from('FOLDERS').insert({ name, parent, creator: user.id, isAdmin });
  if (error) {
    return c.json({ error: 'Error creating folder' }, 500);
  }

  return c.json({ message: 'Folder created' }, 201);
});

edm.openapi(updateFolderRoute, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { id } = c.req.valid('param');
  const { name, parent, isAdmin } = c.req.valid('json');

  const { data, error } = await supabase
    .from('FOLDERS')
    .update({ name, parent, isAdmin })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Folder not found' }, 404);
  }

  return c.json({ data }, 200);
});

edm.openapi(deleteFolderRoute, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { id } = c.req.valid('param');

  const { error } = await supabase.from('FOLDERS').delete().eq('id', id);
  if (error) {
    return c.json({ error: 'Folder not found' }, 404);
  }

  return c.json({ message: 'Folder deleted' }, 200);
});
