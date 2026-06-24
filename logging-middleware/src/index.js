const LOG_API = "/evaluation-service/logs";

let token = "";

const STACKS = ["backend", "frontend"];
const LEVELS = ["debug", "info", "warn", "error", "fatal"];

// which packages are valid for which stack
const PKG_MAP = {
  backend: ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"],
  frontend: ["api", "component", "hook", "page", "state", "style"],
  shared: ["auth", "config", "middleware", "utils"]
};

function init(authToken) {
  token = authToken;
}

async function Log(stack, level, pkg, message) {
  if (!STACKS.includes(stack) || !LEVELS.includes(level)) {
    return { error: "invalid stack or level" };
  }

  let allowed = PKG_MAP[stack] || [];
  if (!allowed.includes(pkg) && !PKG_MAP.shared.includes(pkg)) {
    return { error: "invalid package for " + stack };
  }

  try {
    let resp = await fetch(LOG_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });

    if (!resp.ok) return { error: "status " + resp.status };
    return await resp.json();
  } catch (e) {
    return { error: e.message };
  }
}

export { init, Log };
