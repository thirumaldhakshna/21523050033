import { useState, useMemo } from "react";
import {
  Alert, Box, CircularProgress, Divider,
  FormControl, InputLabel, MenuItem, Select,
  Stack, Typography
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { sortByPriority } from "../utils/prioritySort";
import { Log } from "logging-middleware";

export function PriorityPage({ readStatus }) {
  const [filter, setFilter] = useState("All");
  const [topN, setTopN] = useState(10);

  let { notifications, loading, error } = useNotifications(1, filter);

  // filter out read ones, sort, pick top N
  let priorityList = useMemo(() => {
    let unread = notifications.filter(n => !readStatus.isRead(n.ID));
    return sortByPriority(unread).slice(0, topN);
  }, [notifications, topN, readStatus]);

  function changeFilter(val) {
    Log("frontend", "info", "page", "priority filter -> " + val);
    setFilter(val);
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <PriorityHighIcon sx={{ fontSize: 28, color: "warning.main" }} />
        <Typography variant="h5" fontWeight={700}>Priority Inbox</Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ marginBottom: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
          <NotificationFilter value={filter} onChange={changeFilter} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="topn-label">Show top</InputLabel>
            <Select
              labelId="topn-label"
              id="topn-select"
              value={topN}
              label="Show top"
              onChange={e => { Log("frontend", "info", "page", "top n=" + e.target.value); setTopN(e.target.value); }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && priorityList.length === 0 && (
        <Alert severity="info">No unread priority notifications right now.</Alert>
      )}

      {!loading && !error && priorityList.length > 0 && (
        <Stack spacing={1.5}>
          {priorityList.map(n => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isRead={false}
              onMarkRead={readStatus.markAsRead}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
