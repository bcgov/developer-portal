#!/usr/bin/env node
// from https://github.com/backstage/demo/blob/master/scripts/set-release-name.js
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch')
const { EOL } = require('os');

async function getBackstageVersion() {
  const rootPath = path.resolve(__dirname, '../../backstage.json');
  return fs.readJson(rootPath).then(_ => _.version);
}

async function getLatestRelease() {
  const response = await fetch('https://api.github.com/repos/backstage/backstage/releases/latest')
  const json = await response.json();
  return json
}

async function main() {
  
  // Get the current Backstage version from the backstage.json file
  const backstageVersion = await getBackstageVersion()
  // Get the latest Backstage Release from the GitHub API
  const latestRelease = await getLatestRelease()
  

  console.log(`Current Backstage version is: v${backstageVersion}`)
  console.log(`Latest Release version is: ${latestRelease.name}, published on: ${latestRelease.published_at}`)
  console.log()
 
  await fs.appendFile(process.env.GITHUB_OUTPUT, `release_version=${latestRelease.name.substring(1)}${EOL}`);
  
  await fs.appendFile(process.env.GITHUB_OUTPUT, `current_version=${backstageVersion}${EOL}`);
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});