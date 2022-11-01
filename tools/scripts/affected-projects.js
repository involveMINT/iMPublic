const execSync = require('child_process').execSync;
const isMaster = process.argv[2] === 'False';
const frontend = process.argv[3] === 'true';
const baseSha = isMaster ? 'origin/master~1' : 'origin/master';

const state = findAffected();

console.log(frontend ? isFrontendAffected() : isBackendAffected());

function isBackendAffected() {
  return state === 3 || state === 1;
}

function isFrontendAffected() {
  return state === 3 || state === 2;
}

/**
 * Frontend and Backend affected -> 3
 * Frontend affected -> 2
 * Backend affected -> 1
 * None affected -> 0
 */
function findAffected() {
  const affectedProjects = (
    execSync(`npx nx print-affected --base=${baseSha} --target=build --select=tasks.target.project`) || ''
  )
    .toString()
    .trim()
    .split(', ');

  const frontendAffected = affectedProjects.includes('involvemint');
  const backendAffected = affectedProjects.includes('api');

  if (frontendAffected && backendAffected) return 3;
  if (frontendAffected) return 2;
  if (backendAffected) return 1;
  return 0;
}
