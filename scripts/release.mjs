#!/usr/bin/env node
/**
 * Publishes a MedScribe version in one command.
 *
 *   npm run release            → publishes the version already in package.json
 *   npm run release -- 1.0.1   → bumps to 1.0.1, commits, then publishes
 *   npm run release -- 1.0.1 --dry-run   → shows what would happen
 *
 * Pushing the tag `vX.Y.Z` starts .github/workflows/release.yml, which builds
 * the Windows installer and the signed Android APK and creates the Release.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const requested = args.find((a) => !a.startsWith("--"));

const read = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();
const run = (cmd) => {
  console.log(`  $ ${cmd}`);
  if (!dryRun) execSync(cmd, { stdio: "inherit" });
};
const fail = (message) => {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
};

const current = JSON.parse(readFileSync("package.json", "utf8")).version;
const version = requested ?? current;
const tag = `v${version}`;

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  fail(`"${version}" no es una versión válida. Usa el formato 1.2.3.`);
}
if (read("git status --porcelain")) {
  fail("Tienes cambios sin guardar. Haz commit (o descártalos) antes de publicar.");
}
if (read("git branch --show-current") !== "main") {
  fail("Publica desde la rama main.");
}
if (read(`git tag --list ${tag}`)) {
  fail(`La versión ${tag} ya existe. Elige otra, por ejemplo: npm run release -- ${bump(version)}`);
}

console.log(`\nPublicando MedScribe ${tag}${dryRun ? " (simulación)" : ""}\n`);

if (version !== current) {
  run(`npm version ${version} --no-git-tag-version`);
  run("git add package.json package-lock.json");
  run(`git commit -m "Versión ${version}"`);
}
run(`git tag ${tag}`);
run("git push origin main");
run(`git push origin ${tag}`);

const repo = read("git remote get-url origin").replace(/\.git$/, "");
console.log(`
✔ Listo. GitHub está compilando los instaladores (~10-15 min):
  ${repo}/actions
  Cuando termine, estarán en ${repo}/releases/tag/${tag}
`);

function bump(v) {
  const [major, minor, patch] = v.split(".").map(Number);
  return `${major}.${minor}.${patch + 1}`;
}
