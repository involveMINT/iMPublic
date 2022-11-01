import * as cp from 'child_process';

// Counts the lines of code within the git repo
let res = cp.execSync('git ls-files | xargs cat | wc -l').toString();
console.log('\nNumber of lines of code in the involveMINT repo:', res);
