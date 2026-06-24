import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "logging-middleware";

export function useNotifications(page = 1, type = "All", limit = null) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchNotifications({ page, limit, type })
      .then((data) => {
        if (cancelled) return;
        setNotifications(data.notifications || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => {
        if (cancelled) return;
        Log("frontend", "error", "hook", "load failed: " + err.message);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, type, limit]);

  return { notifications, total, totalPages, loading, error };
}
