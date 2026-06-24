import { Card, CardContent, Chip, Typography, Box, Stack } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Log } from "logging-middleware";

const TYPE_MAP = {
  Placement: { color: "success", icon: <WorkIcon fontSize="small" /> },
  Result: { color: "info", icon: <SchoolIcon fontSize="small" /> },
  Event: { color: "warning", icon: <EventIcon fontSize="small" /> }
};

function formatTime(ts) {
  return new Date(ts).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export function NotificationCard({ notification, isRead, onMarkRead }) {
  let conf = TYPE_MAP[notification.Type] || TYPE_MAP.Event;

  function handleClick() {
    if (isRead) return;
    Log("frontend", "info", "component", "read: " + notification.ID);
    onMarkRead(notification.ID);
  }

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        bgcolor: isRead ? "background.default" : "action.hover",
        borderLeft: isRead ? "3px solid transparent" : "3px solid",
        borderLeftColor: isRead ? "transparent" : conf.color + ".main",
        transition: "all 0.2s",
        "&:hover": { boxShadow: 3 }
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
              <Chip
                icon={conf.icon}
                label={notification.Type}
                color={conf.color}
                size="small"
                variant="outlined"
              />
              {!isRead && <FiberManualRecordIcon sx={{ fontSize: 10, color: "primary.main" }} />}
            </Stack>
            <Typography variant="body1" fontWeight={isRead ? 400 : 600}>
              {notification.Message}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" whiteSpace="nowrap">
            {formatTime(notification.Timestamp)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
