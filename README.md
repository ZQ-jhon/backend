## 重置 mysql 密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';

## 基本步骤
1. 连接 mysql
2. CREATE TABLE
3. reflect relation: INSERT/REMOVE/UPDATE/SELECT => save/remove/update/has 