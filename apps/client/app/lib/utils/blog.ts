'use server';

import type { SinglePost } from '../type/SinglePost';

const urlApi = process.env.ATHLONIX_API_URL;

export async function getBlogPost(id: number): Promise<{ data: SinglePost; status: number }> {
  const queryPath = `${urlApi}/blog/posts/${id}`;
  const res = await fetch(queryPath, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      cache: 'no-cache',
    },
  });

  const data = await res.json();
  return { data: data, status: res.status };
}
