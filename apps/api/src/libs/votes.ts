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

  if (!filterMajority(returnedPoll, true).result) {
    return returnedPoll;
  }

  const filtered_sub_polls = [];
  let getNext = true;

  for (const sub_poll of poll.sub_polls) {
    filtered_sub_polls.push(sub_poll);
    const returned = filterMajority(sub_poll, getNext);
    getNext = returned.next;
    if (!returned.result) {
      break;
    }
  }

  return {
    ...returnedPoll,
    sub_polls: filtered_sub_polls,
  };
}

function filterMajority(poll: Poll, getNext: boolean) {
  if (new Date(poll.start_at) > new Date()) {
    if (getNext === false) return { result: false, next: getNext };
    return { result: true, next: false };
  }

  if (poll.end_condition === 'simple') return { result: true, next: getNext };

  if (poll.end_condition === 'absolute') {
    if (new Date(poll.end_at) > new Date()) return { result: true, next: getNext };
    if (poll.results.filter((result) => result.votes > poll.max_choices / 2).length > 0)
      return { result: false, next: getNext };
    return { result: true, next: getNext };
  }

  if (poll.end_condition === 'two-third') {
    if (new Date(poll.end_at) > new Date()) return { result: true, next: getNext };
    if (poll.results.filter((result) => result.votes > (poll.max_choices / 3) * 2).length > 0)
      return { result: false, next: getNext };
    return { result: true, next: getNext };
  }

  if (poll.end_condition === 'unanimous') {
    if (new Date(poll.end_at) > new Date()) return { result: true, next: getNext };
    if (poll.results.filter((result) => result.votes !== poll.max_choices).length > 0)
      return { result: false, next: getNext };
    return { result: true, next: getNext };
  }

  return { result: true, next: getNext };
}
