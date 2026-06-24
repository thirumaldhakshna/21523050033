import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const TYPES = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, v) => { if (v !== null) onChange(v); }}
      size="small"
      sx={{ flexWrap: "wrap", gap: 0.5 }}
    >
      {TYPES.map(t => (
        <ToggleButton key={t} value={t} sx={{ textTransform: "none", px: 2 }}>
          {t}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}