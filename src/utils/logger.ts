import pc from 'picocolors';

export const logger = {
  info(msg: string) {
    console.log(pc.cyan('ℹ'), msg);
  },
  success(msg: string) {
    console.log(pc.green('✓'), msg);
  },
  error(msg: string) {
    console.log(pc.red('✗'), msg);
  },
  warn(msg: string) {
    console.log(pc.yellow('⚠'), msg);
  },
  step(msg: string) {
    console.log(pc.blue('○'), msg);
  },
  plain(msg: string) {
    console.log(msg);
  },
};
