## 重置 mysql 密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';

## 基本步骤
1. 连接 mysql
2. CREATE TABLE
3. reflect relation: INSERT/REMOVE/UPDATE/SELECT => save/remove/update/has 

## Swagger
[http://127.0.0.1/api](http://127.0.0.1/api)

## Quick view all Endpoint
[[GET] http://127.0.0.1](http://127.0.0.1)

## TODO
Pre:
- [x] Learnning mysql and sql language.
- [x] Learnning Nest.js and TypeORM.
- [x] Using X-MIND record process.

Base:
- [x] Build boilerplate with Mysql + Nest.js + Rx.js + TypeORM 
- [x] UserModule and CommentModule devloped.
- [x] Adding swagger document builder. 
- [x] Using postman in pre-push step.
- [x] Create a front-end forms page for test easily.
- [x] Deploy and running it in Tencent-CVM by PM2.
- [ ] JWT Bearer authrozation.
- [ ] Unified response interface.
- [ ] Written unit test.
- [ ] Intergration to my blog.

Optimization & Advanced:

- [ ] Custom middleware and decorater. 
- [ ] Exception Filter
- [ ] Pipe
- [ ] Guard
- [ ] Interceptor
