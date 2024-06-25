const days = new Map();
days.set(0, 'sunday');
days.set(1, 'monday');
days.set(2, 'tuesday');
days.set(3, 'wednesday');
days.set(4, 'thursday');
days.set(5, 'friday');
days.set(6, 'saturday');

interface ACTIVITIES_EXCEPTIONS {
  date: string;
  id: number;
  id_activity: number;
  max_participants: number | null;
  min_participants: number | null;
}

export function getOccurences(
  startDate: Date,
  endDate: Date,
  daysToFind: string[],
  exceptions: ACTIVITIES_EXCEPTIONS[],
) {
  const occurences = [];

  if (startDate > endDate) return [];

  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const dayOfWeek = currentDate.getDay();
    if (daysToFind.includes(days.get(dayOfWeek))) {
      const occurenceException = exceptions.find((e) => new Date(e.date).toDateString() === currentDate.toDateString());

      const occurence = {
        id_exception: null as number | null,
        date: new Date(currentDate),
        max_participants: null as number | null,
        min_participants: null as number | null,
      };
      if (occurenceException) {
        occurence.id_exception = occurenceException.id;
        occurence.max_participants = occurenceException.max_participants;
        occurence.min_participants = occurenceException.min_participants;
      }

      occurences.push(occurence);
    }
  }

  return occurences;
}
