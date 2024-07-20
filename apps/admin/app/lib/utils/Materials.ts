'use server';

import { cookies } from 'next/headers';

const urlApi = process.env.ATHLONIX_API_URL;

export async function addMaterial(
  id_material: number,
  id_address: number,
  quantity: number,
): Promise<{ status: number }> {
  const res = await fetch(`${urlApi}/materials/${id_material}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
    body: JSON.stringify({
      id_address: id_address,
      quantity: quantity,
    }),
  });

  return { status: res.status };
}
