const { spawn } = require('child_process');

let shuttingDown = false;
const processes = [];

const spawnProc = (command, args, name) => {
  const proc = spawn(command, args, { stdio: 'inherit' });
  processes.push(proc);

  proc.on('exit', (code, signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.log(`[${name}] exited (${reason}). Shutting down...`);
    processes.forEach((p) => {
      if (!p.killed) {
        p.kill('SIGTERM');
      }
    });
    process.exit(code ?? 0);
  });

  return proc;
};

const shutdown = () => {
  if (shuttingDown) return;
  shuttingDown = true;
  processes.forEach((p) => {
    if (!p.killed) {
      p.kill('SIGTERM');
    }
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

spawnProc('npm', ['--prefix', 'backend', 'start'], 'backend');
spawnProc('npm', ['--prefix', 'Dashboard-view', 'run', 'dev'], 'dashboard');
