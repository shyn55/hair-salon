const { exec } = require('child_process');
exec('node node_modules/vite/bin/vite.js preview --port 4175 --host', { cwd: __dirname }, (err, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
});
