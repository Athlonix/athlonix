export type Activity = {
  id: number;
  name: string;
  min_participants: number;
  max_participants: number;
  id_sport: number | null;
  id_address: number | null;
  days_of_week: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  description: string | null;
  frequency: 'weekly' | 'monthly' | 'yearly';
};

export type Occurence = {
  id_activity: number;
  date: Date;
  max_participants: number | null;
  min_participants: number | null;
};

export type ActivityWithOccurences = {
  activity: Activity;
  occurences: Occurence[];
};

export type Sport = {
  id: number;
  name: string;
  max_participants: number | null;
  min_participants: number;
};

export type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

export type User = {
  id: number;
  username: string;
};
