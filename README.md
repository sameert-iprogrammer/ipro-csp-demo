# 🛡️ Content Security Policy (CSP) in React + Vite

This repository shows how to implement a strong Content Security Policy (CSP) in a **React + Vite** project without using a custom backend. Instead, we inject a CSP meta tag into the final HTML at build time using a simple script.

---

## 📽️ What’s Covered in the Video

- What is Content Security Policy (CSP)?
- How CSP protects your app from XSS attacks
- Static vs dynamic CSP setup
- Environment-based CSP rules using `csp.json`
- Injecting CSP into `index.html` at build time
- Practical demo in a Vite + React project

---

## 🗂️ Project Structure

```
project-root/
├── public/
├── src/
├── scripts/
│   └── inject-csp.cjs
├── csp.json
├── index.html
└── vite.config.js
```

---

## 📄 `csp.json` Configuration

```json
{
  "dev": "default-src * 'unsafe-inline' 'unsafe-eval';",
  "prod": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.example.com; base-uri 'self';",
  "default": "default-src 'self';"
}
```

- **dev**: Relaxed policy to allow Vite’s HMR features
- **prod**: Strict policy for secure deployment
- **default**: Fallback in case `NODE_ENV` is not specified

---

## 🛠️ `inject-csp.cjs` Script

```js
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
```

---

## 📌 Why `.cjs` Extension?

- Node.js treats `.cjs` files as **CommonJS modules**, which support `require()` syntax.
- Since this script uses `require()` instead of `import`, it must be named `.cjs` unless you configure your project for CommonJS.

### ✅ If You Want to Use `.js` Instead

Option 1: Keep using CommonJS

- Rename `inject-csp.cjs` to `inject-csp.js`
- Add `"type": "commonjs"` to your `package.json`

```json
{
  "type": "commonjs"
}
```

Option 2: Convert to ES Modules

- Rename to `inject-csp.js`
- Rewrite using `import` syntax:

```js
import fs from "fs";
import csp from "../csp.json" assert { type: "json" };
```

_Note: This requires Node.js 16.14+ and `"type": "module"` in your package.json_

---

## 🪟 Windows Support: Use `cross-env`

Windows doesn't support setting environment variables like `NODE_ENV=prod` in scripts.  
To fix this:

1. Install `cross-env`:

```bash
npm install cross-env --save-dev
```

2. Update your `package.json` script:

```json
"build": "vite build && cross-env NODE_ENV=prod node scripts/inject-csp.cjs"
```

Now it will work consistently on macOS, Linux, and Windows.

---

## 📦 Final `package.json` Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "vite build && NODE_ENV=prod node scripts/inject-csp.cjs",
  "preview": "vite preview"
}
```

(Replace `NODE_ENV=prod` with `cross-env NODE_ENV=prod` if you're using Windows.)

---

## 🔍 How to Test CSP

1. Run `npm run build`
2. Run `npm run preview`
3. Open DevTools → Console or Network tab
4. Look for any CSP violations or blocked resources

---

## 👨‍💻 Author

Created by [@Sameer Thite](https://github.com/TheJavaScriptDojoOfficial)  
Subscribe to [The JavaScript Dojo](https://www.youtube.com/@thejavascriptdojo)

---

## 📄 License

MIT © Sameer Thite
