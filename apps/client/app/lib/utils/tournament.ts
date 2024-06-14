'use server';

import type { Team } from '@/app/lib/type/Tournaments';
import { cookies } from 'next/headers';

const urlApi = process.env.ATHLONIX_API_URL;

export async function joinTeam(props: {
  id_tournament: number;
  team: Team;
}) {
  const res = await fetch(`${urlApi}/tournaments/${props.id_tournament}/teams/${props.team.id}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function leaveTeam(props: {
  id_tournament: number;
  team: Team;
}) {
  const res = await fetch(`${urlApi}/tournaments/${props.id_tournament}/teams/${props.team.id}/leave`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function getTournaments(props: { id: string }) {
  const res = await fetch(`${urlApi}/tournaments/${props.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function getTournamentsTeams(props: { id: string }) {
  const res = await fetch(`${urlApi}/tournaments/${props.id}/teams`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data: await res.json(), status: res.status };
}
