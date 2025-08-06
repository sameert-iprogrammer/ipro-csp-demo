// scripts/inject-csp.cjs
const fs = require("fs");
const path = require("path");

const env = process.env.NODE_ENV || "prod";
const cspConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "csp.json"), "utf8")
);
const csp = cspConfig[env] || cspConfig.default;

const indexPath = path.join(process.cwd(), "dist", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

if (!html.includes("Content-Security-Policy")) {
  const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  html = html.replace("<head>", `<head>\n  ${meta}`);
  fs.writeFileSync(indexPath, html);
  console.log(`✅ Injected CSP for "${env}"`);
} else {
  console.log("ℹ️ CSP already exists in index.html");
}
