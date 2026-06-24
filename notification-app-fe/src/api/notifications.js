import { API_BASE, AUTH_TOKEN } from "./config";
import { Log } from "logging-middleware";

export async function fetchNotifications({ page, limit, type } = {}) {
  let params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (type && type !== "All") params.set("notification_type", type);

  let url = API_BASE + "/notifications";
  if (params.toString()) url += "?" + params;

  try {
    Log("frontend", "info", "api", "fetching notifications page=" + page);

    let res = await fetch(url, {
      headers: { Authorization: "Bearer " + AUTH_TOKEN }
    });

    if (!res.ok) {
      Log("frontend", "error", "api", "fetch failed: " + res.status);
      throw new Error("request failed (" + res.status + ")");
    }

    let data = await res.json();
    Log("frontend", "debug", "api", "got " + (data.notifications?.length || 0) + " items");
    return data;
  } catch (err) {
    Log("frontend", "error", "api", err.message);
    throw err;
  }
}
