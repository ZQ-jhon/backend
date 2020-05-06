// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');
// import { exec } from 'child_process';
exec('nginx -s reload', (err, stdout, stderr) => {
    console.log(err, stdout, stderr);
});