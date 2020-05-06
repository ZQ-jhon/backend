## 重置 mysql 密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';

## 基本步骤
1. 连接 mysql
2. CREATE TABLE
3. reflect relation: INSERT/REMOVE/UPDATE/SELECT => save/remove/update/has 

## Swagger
[http://127.0.0.1/docs](http://127.0.0.1/docs)

## Quick view all Endpoint
[[GET] http://127.0.0.1](http://127.0.0.1)

## TODO
Pre:
- [x] ~~Learnning mysql and sql language.~~
- [x] ~~Learnning Nest.js and TypeORM.~~
- [x] ~~Using X-MIND record process.~~

Base:
- [x] ~~Build boilerplate with Mysql + Nest.js + Rx.js + TypeORM~~ 
- [x] ~~UserModule and CommentModule devloped.~~
- [x] ~~Adding swagger document builder.~~
- [x] ~~Using postman in pre-push step.~~
- [x] ~~Create a front-end forms page for test easily.~~
- [x] ~~Deploy and running it in Tencent-CVM by PM2.~~
- [x] ~~JWT Bearer authrozation.~~
- [x] ~~Unified response interface.~~
- [ ] Written unit test.
- [ ] Intergration to my blog.

Optimization & Advanced:

- [ ] Custom middleware and decorater. 
- [ ] Exception Filter
- [ ] Pipe
- [ ] Guard
- [ ] Interceptor

## Test Coverage in unit-test
| File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ---------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files              | 88.24   | 50       | 63.16   | 90.91   |
| src                    | 92.86   | 100      | 75      | 90      |
| app.controller.ts      | 87.5    | 100      | 50      | 83.33   | 10                |
| app.service.ts         | 100     | 100      | 100     | 100     |
| src/modules/comment    | 88      | 50       | 70      | 90.24   |
| comment.controller.ts  | 93.75   | 50       | 100     | 92.86   | 30                |
| comment.entity.ts      | 85.71   | 100      | 33.33   | 90      | 19                |
| comment.service.ts     | 85      | 50       | 75      | 88.24   | 21,26             |
| src/modules/user       | 78.57   | 100      | 0       | 90      |
| user.entity.ts         | 78.57   | 100      | 0       | 90      | 18                |
| src/util               | 100     | 100      | 100     | 100     |
| err-thrower-builder.ts | 100     | 100      | 100     | 100     |
| make-observable.ts     | 100     | 100      | 100     | 100     |

## Questions in development
- OOM killer in linux 
resolution: commit #6e7608

- Auto build and restart nginx service
resolution: execute shell/script with git hooks and husky 
