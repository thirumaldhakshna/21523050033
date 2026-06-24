// finds the top 10 priority notifications from the API
// run: AUTH_TOKEN=xxx node stage1/priority.js

const API = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN = process.env.AUTH_TOKEN || "YOUR_TOKEN";

const WEIGHT = { Placement: 3, Result: 2, Event: 1 };

async function getNotifications() {
  let res = await fetch(API, {
    headers: { Authorization: "Bearer " + TOKEN }
  });
  if (!res.ok) throw new Error("API error: " + res.status);
  let data = await res.json();
  return data.notifications || [];
}

function topPriority(items, n) {
  return items
    .sort((a, b) => {
      let d = (WEIGHT[b.Type] || 0) - (WEIGHT[a.Type] || 0);
      return d !== 0 ? d : new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, n);
}

async function main() {
  console.log("fetching...\n");
  let all = await getNotifications();
  console.log("total: " + all.length + "\n");

  let top = topPriority(all, 10);
  console.log("=== top 10 priority ===\n");
  top.forEach((n, i) => {
    console.log((i + 1) + ". [" + n.Type + "] " + n.Message);
    console.log("   " + n.ID);
    console.log("   " + n.Timestamp + "\n");
  });
}

main().catch(e => { console.error(e.message); process.exit(1); });
