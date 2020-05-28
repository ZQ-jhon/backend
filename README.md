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

* [x] ~~Learnning mysql and sql language.~~
* [x] ~~Learnning Nest.js and TypeORM.~~
* [x] ~~Using X-MIND record process.~~

Base:

* [x] ~~Build boilerplate with Mysql + Nest.js + Rx.js + TypeORM~~ 
* [x] ~~UserModule and CommentModule devloped.~~
* [x] ~~Adding swagger document builder.~~
* [x] ~~Using postman in pre-push step.~~
* [x] ~~Create a front-end forms page for test easily.~~
* [x] ~~Deploy and running it in Tencent-CVM by PM2.~~
* [x] ~~JWT Bearer authorization.~~
* [x] ~~Unified response interface.~~
* [x] ~~Written unit test.~~
* [ ] Written e2e test.
* [ ] Improve UT rate over 80% 

Optimization & Advanced:

* [x] ~~Custom middleware and decorator.(Catching every request/response as handler)~~ 
* [x] ~~Exception Filter(Catching exception)~~
* [x] ~~Pipe (DTO => Entity)~~
* [x] ~~Guard (Token Valid)~~
* [x] ~~Interceptor (Unified Response Interface)~~
* [x] ~~caching by Redis(JWT token cached to REDIS, if expire, re-sign new one)~~

## Test Coverage in unit-test

| File                        | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
|-----------------------------|-----------|------------|-----------|-----------|---------------------|
| All files                   | 57.14     | 3.51       | 18.03     | 54.32     |                     |
| src                         | 87.5      | 100        | 60        | 83.33     |                     |
| app.controller.ts           | 80        | 100        | 33.33     | 75        | 10, 15              |
| app.service.ts              | 100       | 100        | 100       | 100       |                     |
| src/constants               | 100       | 100        | 100       | 100       |                     |
| jwt-secret.ts               | 100       | 100        | 100       | 100       |                     |
| redis-inject-token.ts       | 100       | 100        | 100       | 100       |                     |
| src/filters                 | 33.33     | 0          | 0         | 23.08     |                     |
| http-exception.filter.ts    | 33.33     | 0          | 0         | 23.08     | 36-68               |
| src/interceptors            | 75        | 100        | 0         | 80        |                     |
| response.interceptor.ts     | 75        | 100        | 0         | 80        | 9                   |
| src/modules/auth            | 38.1      | 0          | 11.11     | 34.69     |                     |
| auth.controller.ts          | 60.87     | 0          | 25        | 57.14     | 17-25, 31, 40-41    |
| auth.guard.ts               | 47.83     | 0          | 50        | 42.86     | 16-31               |
| auth.service.ts             | 25.42     | 0          | 0         | 23.21     | 17-117              |
| src/modules/comment         | 83.33     | 12.5       | 45.45     | 80.85     |                     |
| comment.controller.ts       | 95.24     | 50         | 100       | 94.74     | 43                  |
| comment.dto.ts              | 100       | 100        | 100       | 100       |                     |
| comment.entity.ts           | 85.71     | 100        | 33.33     | 81.82     | 20-21               |
| comment.service.ts          | 60        | 0          | 0         | 53.85     | 12-23               |
| src/modules/log             | 62.71     | 0          | 9.09      | 67.39     |                     |
| log.controller.ts           | 84.62     | 100        | 33.33     | 81.82     | 16, 21              |
| log.dto.ts                  | 50        | 100        | 0         | 66.67     | 6-7                 |
| log.entity.ts               | 68.75     | 100        | 0         | 90        | 7                   |
| log.service.ts              | 50        | 0          | 0         | 47.37     | 15-34               |
| src/modules/redis-cache     | 53.85     | 100        | 0         | 45.45     |                     |
| redis-cache.service.ts      | 53.85     | 100        | 0         | 45.45     | 10-26               |
| src/modules/user            | 63.89     | 0          | 0         | 63.33     |                     |
| user-dto.pipe.ts            | 37.5      | 0          | 0         | 30.77     | 17-30               |
| user.dto.ts                 | 100       | 100        | 100       | 100       |                     |
| user.entity.ts              | 81.25     | 100        | 0         | 84.62     | 23-24               |
| src/util                    | 35.71     | 0          | 0         | 35.71     |                     |
| verify-auth-headers.ts      | 35.71     | 0          | 0         | 35.71     | 7-19                |

## Questions in development

* OOM(out of memory) killer in linux 

resolution: commit #6e7608

* Auto build and restart nginx service

resolution: execute shell/script with git hooks and husky 

* How to unified response interface

resolution: using interceptor for make response interface unified
