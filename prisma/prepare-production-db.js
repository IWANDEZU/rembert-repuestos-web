const { execFileSync } = require("node:child_process");

if (process.env.POSTGRES_IMPORT_MODE === "true") {
  execFileSync("npx", ["prisma", "db", "push", "--skip-generate"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  execFileSync("node", ["prisma/migrate-sqlite-to-postgres.js"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}
