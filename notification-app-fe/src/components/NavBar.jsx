import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate, useLocation } from "react-router-dom";

export function NavBar() {
  let navigate = useNavigate();
  let location = useLocation();
  let tab = location.pathname === "/priority" ? 1 : 0;

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <NotificationsIcon color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mr: 3 }}>
          Notifications
        </Typography>
        <Tabs value={tab} onChange={(_, v) => navigate(v === 0 ? "/" : "/priority")}>
          <Tab label="All" id="tab-all" />
          <Tab label="Priority Inbox" id="tab-priority" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
