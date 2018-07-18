const shell = require('shelljs');

// 开始打包
shell.echo('---------------------------------------------------------');
shell.echo('| Start buildind node-server, frontend, manage frontend |');
shell.echo('---------------------------------------------------------');
shell.echo('\n');
// 1. install packages
shell.echo('-------------------');
shell.echo('1. Install packages');
shell.echo('-------------------');
shell.echo('\n');
shell.echo('-----------------------------');
shell.echo('1.1 Install server packages');
shell.echo('-----------------------------');
shell.echo('\n');
shell.exec('yarn install');
shell.echo('\n');

shell.echo('------------------------------------');
shell.echo('1.2 Install frontend packages');
shell.echo('------------------------------------');
shell.echo('\n');
shell.cd('web');
shell.exec('yarn install');
shell.cd('..');
shell.echo('\n');

shell.echo('------------------------------------');
shell.echo('1.3 Install mobile-frontend packages');
shell.echo('------------------------------------');
shell.echo('\n');
shell.cd('mobile');
shell.exec('yarn install');
shell.cd('..');
shell.echo('\n');

shell.echo('------------------------------------');
shell.echo('1.4 Install manage-frontend packages');
shell.echo('------------------------------------');
shell.echo('\n');
shell.cd('manage');
shell.exec('yarn install');
shell.cd('..');

shell.exec('yarn run clean');

shell.echo('\n');
shell.echo('------------------------------');
shell.echo(' 2. Build node-server');
shell.echo('------------------------------');
shell.echo('\n');
shell.exec('yarn build-server');

shell.echo('\n');
shell.echo('-----------------------------------');
shell.echo(' 3. Build web frontend');
shell.echo('-----------------------------------');
shell.echo('\n');
shell.cd('web');
shell.exec('yarn build');
shell.cd('..');

shell.echo('\n');
shell.echo('-----------------------------------');
shell.echo(' 4. Build mobile frontend');
shell.echo('-----------------------------------');
shell.echo('\n');
shell.cd('mobile');
shell.exec('yarn build');
shell.cd('..');

shell.echo('\n');
shell.echo('-----------------------------------');
shell.echo(' 5. Build manage frontend');
shell.echo('-----------------------------------');
shell.echo('\n');
shell.cd('manage');
shell.exec('yarn build');
shell.cd('..');

shell.echo('\n');
shell.echo('-----------------------------------------------------------------------------------------------------------------------');
shell.echo(' 5. Move web/mobile/manage frontend build files');
shell.echo('-----------------------------------------------------------------------------------------------------------------------');
shell.echo('\n');
// copy web build files to build
shell.cp('-R', 'web/build/', 'build/');
shell.cp('-R', 'mobile/build/', 'build/mobile/');
shell.cp('-R', 'manage/build/', 'build/manage/');
