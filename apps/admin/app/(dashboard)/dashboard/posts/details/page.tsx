'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function page() {
  const searchParams = useSearchParams();
  const idPost = searchParams.get('id_post');
  const router = useRouter();

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/blog/posts/${idPost}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return <div>{idPost}</div>;
}

export default page;
