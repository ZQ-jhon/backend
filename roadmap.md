# 数据库

## 前置知识

### 比特

- 计算机中存储数据的基本单位

### 字节

- 计算机处理数据的基本单位

### 位

- 比特的容器

### 编码

- 将数据按照一定的规律整合，便于加工传输

## 数据库的数据类型

### 字符类型

- 定长
- 不定长

### 数值

- 整数
- 单精度

	- 4字节 32位 有效位数为7位（6个有效位和1个小数位）

- 双精度

	- 8字节 64位 有效位数 为16位（15个有效位，1个小数位）

### 时间

- 时间戳
- Date

## 关系型数据库模型的常见概念

### 主键

- 某列中值唯一，不可重复的字段，字段的值最好跟业务无关

### 外键约束

- 外键可以通过数据库约束，这样会防止脏数据产生，例如，增加一个 student ，外键关联到 classID 为200 的班级，但不存在，此时，student 是无法写入 db的

### 联合主键

- 以两列作为主键，只要组合起来不完全一样，就可以作为每行数据的唯一标识符。一般不推荐使用

### 关系模型

- 一对一

	- 一个学生有一个名字，可以通过外键关联一个 name 表。大多数时候，其实一对一没有必要拆开，但为了更好地查询性能和维护成本，就要拆开。

- 一对多

	- 例如一个班级中，有多个学生。那么可以在 student 表中，设置 class_id 来映射到对应的班级表 classes 。此时，这种能够关联到外部表的字段，称为“外键”。

- 多对多

	- 例如，在上例中再引入教师表，每个教师都对应多个班级，每个班级也对应多个教师，此时应该建立一个 teacher _class 表来维系 class 和 teacher 的关系

### 索引

- 对某一列或多列提前排序，每次查询时不用扫描整张表，提高查询效率。如果列是散列，速度越快，非散列，查询越慢。
- 索引是不是越多越好？

	- 不是，索引就像目录，数据就像内容，如果一本书 10页内容，100页索引，效率肯定不高。1.数据少，没必要索引 2.如果是频繁更新，修改的列，索引会带来额外开销 3. 只对关键列建索引。数据库。 因此，主键由于跟业务解耦，不会变动，所以建索引是效率最高的。

- 建索引

	- ALTER TABLE student ADD INDEX Idx_number （columnName）

## 基本操作

### 建库

- CREAT DATABASE name；

### 建表

- CREAT TABLE name (field)；

### 删表

- DROP TABLE name;

### 数据操作

- 增 INSERT INTO TABLENAME(field) VALUES(value )，如果是插入多个值，可以:  Values(value1），（values 2）;
改 UPDATE TABLE_name SET 字段 =值  where ID=1 （也可以 id > 10）；
删 DELETE  FROM  表名。WHERE ...

### 查询

- Select 不一定需要 from 从句。他单独使用时，可以测试链接数据库是否正常。

	- Select id from student;
	- Select score where score > 80 AND SCORE < 90

- 投影查询

	- 查询某几个列

		- SELECT score, nam, I’d from student;
		- Select score, name, Id where id =2;

### 排序

- Select  * from student ORDER BY id desc;

### 分页

- SELECT * FROM student orderby score；

### 排序加分页

- SELECT * FROM student WHERE score >1 LIMIT 10  ORDER BY ID；

### 投影查询 

- 顾名思义，就是将所查询的列赋予一个临时的名字，显示在最终的结果中
- SELECT id 唯一编号，name 姓名 FROM student；                                                               更可以：SELECT student.id Sid, student.name s_name，class.id cid,class.name c_name FROM student, class;
- 再简洁一点：SELECT s.id Sid, s.name s_name，c.id cid,c.name c_name FROM student s, class c;

### 聚合查询

- COUNT 计数： SELECT COUNT（*）FROM student；
- AVG 平均值 ：SELECT AVG（score）from student；
- ma x
- min
-  Group by分组查询:  聚合某列的数据，分散展示到某行。例如查询查询班级平均分 ：     SELECT class_id,AVG(score) FROM student group by  class_id;

### 多表查询

- SELECT * FROM student ，class ；
- 例如查两张表 2栏2行 和 3栏4行 那么返回的结果是 一个 5栏X8行的表。栏相加，行相乘。又称为 笛卡尔查询

### 连接查询 

- 先选一张表作为结果集的主表。                          1.先确定主表，仍然使用FROM <表1>的语法；
2.再确定需要连接的表，使用INNER JOIN <表2>的语法；
3.然后确定连接条件，使用ON <条件...>，这里的条件是s.class_id = c.id，表示students表的class_id列与classes表的id列相同的行需要连接；
4.可选：加上WHERE子句、ORDER BY等子句。
- 内连接举例： SELECT s.id 序号，s.name 姓名，c.name 班级名 FROM class c INNER JOIN student s ON c.class_id = s.id;
- 外连接举例： SELECT s.id 序号，s.name 姓名，c.name 班级名 FROM class c right outer JOIN student s ON c.class_id = s.id;
- Inner join只滤出两张表都有的数据                  
right outer join 会返回右表都存在的行。
同理，left 会滤出只有左表存在的数据。
full outer join 会滤出两张表都存在的 行

## 高级操作

### 替换。REPLACE INTO 表名 （字段）VALUES (值)

### 插入或更新

//TODO:
- INSERT INTO ... ON DUPLICATE KEY UPDATE...