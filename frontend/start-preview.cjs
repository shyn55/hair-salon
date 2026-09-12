const { exec } = require('child_process');
const child = exec('node node_modules/vite/bin/vite.js preview --port 4175 --host', { cwd: __dirname });
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
