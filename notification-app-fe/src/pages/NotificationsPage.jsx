import { useState } from "react";
import {
  Alert, Badge, Box, CircularProgress, Divider,
  Pagination, Stack, Typography
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "logging-middleware";

export function NotificationsPage({ readStatus }) {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  let { notifications, totalPages, loading, error } = useNotifications(page, filter);
  let unread = readStatus.unreadCount(notifications);

  function changeFilter(val) {
    Log("frontend", "info", "page", "filter -> " + val);
    setFilter(val);
    setPage(1);
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unread} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>All Notifications</Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter value={filter} onChange={changeFilter} />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map(n => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isRead={readStatus.isRead(n.ID)}
              onMarkRead={readStatus.markAsRead}
            />
          ))}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => { Log("frontend", "info", "page", "page " + p); setPage(p); }}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
