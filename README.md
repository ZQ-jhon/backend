## 重置 mysql 密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';

## 启动 mysql 服务
`$ service mysql start` 
`$ mysql -u root -p 1234`


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
- [x] ~~Written unit test.~~
- [ ] Written e2e test.

Optimization & Advanced:

- [x] ~~Custom middleware and decorator.(Catching every request/response as handler)~~ 
- [x] ~~Exception Filter(Catching exception)~~
- [x] ~~Pipe (DTO => Entity)~~
- [x] ~~Guard (Token Valid)~~
- [x] ~~Interceptor (Unified Response Interface)~~
- [ ] caching by Redis(JWT token cached to REDIS)

## Test Coverage in unit-test
| File                        | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
| --------------------------- | --------- | ---------- | --------- | --------- | ------------------- |
| All files                   | 57.76     | 1.35       | 15        | 54.43     |
| src                         | 92.86     | 100        | 75        | 90        |
| app.controller.ts           | 87.5      | 100        | 50        | 83.33     | 10                  |
| app.service.ts              | 100       | 100        | 100       | 100       |
| src/filters                 | 40        | 0          | 0         | 30.77     |
| http-exception.filter.ts    | 40        | 0          | 0         | 30.77     | 37-67               |
| src/modules/auth            | 43.42     | 0          | 5.56      | 39.71     |
| auth.controller.ts          | 62.5      | 0          | 25        | 59.09     | 17-25,31,40-41      |
| auth.guard.ts               | 38.89     | 0          | 0         | 31.25     | 8-22                |
| auth.service.ts             | 32.35     | 0          | 0         | 30        | 13-79               |
| src/modules/comment         | 77.55     | 10         | 40        | 73.81     |
| comment.controller.ts       | 94.12     | 50         | 100       | 93.33     | 29                  |
| comment.entity.ts           | 85.71     | 100        | 33.33     | 81.82     | 20-21               |
| comment.service.ts          | 55.56     | 0          | 0         | 50        | 13-27               |
| src/modules/log             | 70        | 0          | 11.11     | 74.36     |
| log.controller.ts           | 81.82     | 100        | 33.33     | 77.78     | 13,18               |
| log.dto.ts                  | 100       | 100        | 100       | 100       |
| log.entity.ts               | 68.75     | 100        | 0         | 90        | 8                   |
| log.service.ts              | 57.89     | 0          | 0         | 56.25     | 15-28               |
| src/modules/user            | 50.82     | 0          | 0         | 47.17     |
| user-dto-pipe.pipe.ts       | 37.5      | 0          | 0         | 30.77     | 17-30               |
| user.dto.ts                 | 100       | 100        | 100       | 100       |
| user.entity.ts              | 78.57     | 100        | 0         | 81.82     | 19-20               |
| user.service.ts             | 37.04     | 0          | 0         | 32        | 13-98               |
| src/util                    | 33.33     | 0          | 0         | 33.33     |
| verify-auth-headers.ts      | 33.33     | 0          | 0         | 33.33     | 6-17                |
| --------------------------- | --------- | ---------- | --------- | --------- | ------------------- |

## Questions in development
- OOM(out of memory) killer in linux 
resolution: commit #6e7608

- Auto build and restart nginx service
resolution: execute shell/script with git hooks and husky 

- How to unified response interface
resolution: using interceptor for make response interface unified