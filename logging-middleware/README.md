## Logging Middleware

Reusable logging package that sends structured logs to the evaluation server.

### Usage

```js
import { init, Log } from "logging-middleware";

// initialize with your bearer token (call once at startup)
init("your_bearer_token");

// then log anywhere in the app
Log("frontend", "info", "api", "fetched 10 notifications");
Log("frontend", "error", "hook", "failed to load data");
```

### API

**`init(token)`** — Set the authorization token. Call this once before any `Log` calls.

**`Log(stack, level, package, message)`** — Send a log entry to the server.

- `stack`: `"backend"` or `"frontend"`
- `level`: `"debug"`, `"info"`, `"warn"`, `"error"`, `"fatal"`
- `package`: depends on stack (e.g. `"api"`, `"component"`, `"hook"`, `"page"` for frontend)
- `message`: descriptive log message

Returns a promise with the server response or `{ error: "..." }` on failure.
The function never throws — logging should not crash your app.
