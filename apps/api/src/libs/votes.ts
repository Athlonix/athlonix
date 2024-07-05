type Poll = {
  id: number;
  title: string;
  description: string | null;
  parent_poll: number | null;
  round: number;
  keep: number | null;
  end_condition: 'simple' | 'absolute' | 'two-third' | 'unanimous';
  start_at: string;
  end_at: string;
  max_choices: number;
  id_user: number;
  assembly: number | null;
  results: { id: number; votes: number; content: string | null }[];
};

type FullPoll = Poll & {
  sub_polls: Poll[];
};

export function getPolls(poll: FullPoll) {
  const returnedPoll = {
    ...poll,
    sub_polls: [],
  };

  const today = new Date();

  if (!filterMajority(returnedPoll)) {
    return returnedPoll;
  }

  const filtered_sub_polls = [];
  for (const sub_poll of poll.sub_polls) {
    filtered_sub_polls.push(sub_poll);
    if (!filterMajority(sub_poll)) break;
  }

  return {
    ...returnedPoll,
    sub_polls: filtered_sub_polls,
  };
}

function filterMajority(poll: Poll) {
  if (new Date(poll.start_at) > new Date()) return false;

  if (poll.end_condition === 'simple') return true;

  if (poll.end_condition === 'absolute') {
    if (new Date(poll.end_at) > new Date()) return true;
    if (poll.results.filter((result) => result.votes > poll.max_choices / 2).length > 0) return false;
    return true;
  }

  if (poll.end_condition === 'two-third') {
    if (new Date(poll.end_at) > new Date()) return true;
    if (poll.results.filter((result) => result.votes > (poll.max_choices / 3) * 2).length > 0) return false;
    return true;
  }

  if (poll.end_condition === 'unanimous') {
    if (new Date(poll.end_at) > new Date()) return true;
    if (poll.results.filter((result) => result.votes !== poll.max_choices).length > 0) return false;
    return true;
  }
}
