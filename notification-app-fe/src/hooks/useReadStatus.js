import { useState, useCallback } from "react";

const KEY = "read_notifications";

function loadIds() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function useReadStatus() {
  const [readIds, setReadIds] = useState(loadIds);

  const markAsRead = useCallback((id) => {
    setReadIds(prev => {
      if (prev.includes(id)) return prev;
      let next = [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isRead = useCallback((id) => readIds.includes(id), [readIds]);

  const unreadCount = useCallback(
    (list) => list.filter(n => !readIds.includes(n.ID)).length,
    [readIds]
  );

  return { markAsRead, isRead, unreadCount };
}
