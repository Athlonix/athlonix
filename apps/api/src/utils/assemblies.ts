import { supabase } from '../libs/supabase.js';

export async function checkAssemblyAndUser(
  id_assembly: number,
  id_member: number,
): Promise<{ error: string; status: 400 | 404 } | true> {
  const { data: assembly, error: assemblyError } = await supabase
    .from('ASSEMBLIES')
    .select('id, closed')
    .eq('id', id_assembly)
    .single();

  if (assemblyError || !assembly) {
    return { error: 'Assembly not found', status: 404 };
  }

  if (assembly.closed) {
    return { error: 'Assembly closed', status: 400 };
  }

  const { data: member, error: memberError } = await supabase
    .from('USERS')
    .select('id, date_validity')
    .eq('id', id_member)
    .single();

  if (memberError || !member) {
    return { error: 'Member not found', status: 404 };
  }

  if (member.date_validity && new Date(member.date_validity) < new Date()) {
    return { error: 'Member subscription expired', status: 400 };
  }

  return true;
}

export async function getAssemblyWithCode(
  code: string,
): Promise<{ id: number; closed: boolean } | { error: string; status: 404 | 400 }> {
  const { data: assembly, error: assemblyError } = await supabase
    .from('ASSEMBLIES')
    .select('id, closed')
    .eq('code', code)
    .single();

  if (assemblyError || !assembly) {
    return { error: 'Assembly not found', status: 404 };
  }

  if (assembly.closed) {
    return { error: 'Assembly closed', status: 400 };
  }

  return assembly;
}

export async function addUserToAssembly(
  id_assembly: number,
  id_member: number,
): Promise<{ error: string; status: 500 | 400 } | true> {
  const { data: attendee } = await supabase
    .from('ASSEMBLIES_ATTENDEES')
    .select('id')
    .eq('id_assembly', id_assembly)
    .eq('id_member', id_member)
    .single();

  if (attendee) {
    return { error: 'Member already confirmed', status: 400 };
  }

  const { error } = await supabase.from('ASSEMBLIES_ATTENDEES').insert({ id_assembly: id_assembly, id_member });

  if (error) {
    return { error: 'Failed to confirm member', status: 500 };
  }

  return true;
}
