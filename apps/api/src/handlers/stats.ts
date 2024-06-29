import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { getStatics } from '../routes/stats.js';
import { checkRole } from '../utils/context.js';
import type { Variables } from '../validators/general.js';

export const stats = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

stats.openapi(getStatics, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const responseData = {
    totalMembers: await getTotalMembers(),
    totalSports: await getTotalSports(),
    totalActivities: await getTotalActivities(),
    totalTournaments: await getTotalTournaments(),
    membersByMonth: await getMembersByMonth(),
    donations: await getDonations(),
  };

  return c.json(responseData, 200);
});

async function getTotalMembers(): Promise<number> {
  const today = new Date();
  const { error, count } = await supabase
    .from('USERS')
    .select('id', { count: 'exact' })
    .gte('date_validity', `${today.toISOString()}`)
    .select();
  if (error || !count) {
    return 0;
  }
  return count || 0;
}

async function getTotalSports(): Promise<number> {
  const { error, count } = await supabase.from('SPORTS').select('id', { count: 'exact' }).select();
  if (error || !count) {
    return 0;
  }
  return count || 0;
}

async function getTotalActivities(): Promise<number> {
  const { error, count } = await supabase.from('ACTIVITIES').select('id', { count: 'exact' }).select();
  if (error || !count) {
    return 0;
  }
  return count || 0;
}

async function getTotalTournaments(): Promise<number> {
  const { error, count } = await supabase.from('TOURNAMENTS').select('id', { count: 'exact' }).select();
  if (error || !count) {
    return 0;
  }
  return count || 0;
}

async function getMembersByMonth(): Promise<{ month: string; members: number }[]> {
  const thisYearTimestamp = new Date().getFullYear();
  const today = new Date();
  const { data, error } = await supabase
    .from('USERS')
    .select('created_at')
    .gte('date_validity', `${today.toISOString()}`)
    .eq('status', 'approved')
    .gte('created_at', `${thisYearTimestamp}-01-01T00:00:00.000Z`)
    .select();
  if (error || !data) {
    return [];
  }
  const months = data.map((user) => {
    return new Date(user.created_at).toLocaleString('default', { month: 'long' });
  });
  const uniqueMonths = [...new Set(months)];
  const membersByMonth = uniqueMonths.map((month) => {
    return {
      month,
      members: months.filter((m) => m === month).length,
    };
  });
  return membersByMonth;
}

async function getDonations(): Promise<{ month: string; amount: number }[]> {
  const thisYearTimestamp = new Date().getFullYear();
  const { data, error } = await supabase
    .from('DONATIONS')
    .select('created_at, amount')
    .gte('created_at', `${thisYearTimestamp}-01-01T00:00:00.000Z`);

  if (error || !data) {
    return [];
  }
  const months = data.map((donation) => {
    return new Date(donation.created_at).toLocaleString('default', { month: 'long' });
  });
  const uniqueMonths = [...new Set(months)];
  const donationsByMonth = uniqueMonths.map((month) => {
    const amount = data
      .filter((donation) => new Date(donation.created_at).toLocaleString('default', { month: 'long' }) === month)
      .reduce((acc, donation) => acc + donation.amount, 0);
    return {
      month,
      amount,
    };
  });
  return donationsByMonth;
}
