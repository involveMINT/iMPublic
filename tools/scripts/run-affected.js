const execSync = require('child_process').execSync;
const isMaster = process.argv[2] === 'False';
const type = process.argv[3] === true ? 'test' : 'lint';
const baseSha = isMaster ? 'origin/master~1' : 'origin/master';

execSync(`npx nx affected --target=${type} --base=${baseSha} --parallel --maxParallel=5`, {
  stdio: 'inherit',
});
