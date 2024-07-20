'use server';

import type { SinglePost } from '../type/SinglePost';

const urlApi = process.env.ATHLONIX_API_URL;

export async function getBlogPost(id: number): Promise<{ data: SinglePost; status: number }> {
  const queryPath = `${urlApi}/blog/posts/${id}`;
  console.log(queryPath);
  const res = await fetch(`${urlApi}/blog/posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      cache: 'no-cache',
    },
  });

  const data = await res.json();
  console.log(data);
  return { data: data, status: res.status };
}
