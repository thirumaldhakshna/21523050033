const WEIGHT = { Placement: 3, Result: 2, Event: 1 };

export function sortByPriority(items) {
  return [...items].sort((a, b) => {
    let diff = (WEIGHT[b.Type] || 0) - (WEIGHT[a.Type] || 0);
    if (diff !== 0) return diff;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

export function getTopN(items, n = 10) {
  return sortByPriority(items).slice(0, n);
}
