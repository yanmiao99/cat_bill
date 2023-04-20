### 初始化数据库

```npx sequelize-cli init```

### 创建数据库 (需要在config/config.json中配置数据库信息之后再执行)

```npx sequelize db:create```

### 创建模型

```npx sequelize model:generate --name User --attributes username:string,password:string ```

### 迁移数据库

```npx sequelize db:migrate```

### 环境变量配置

``` NODE_ENV=development```

### 关于数据库设计

> 这是一个标准的一对多关系。一个用户可以有多个借款人，每个借款人可以有多条借款记录，这也是一个典型的一对多关系。

> 在 User 模型中定义一个 hasMany 关系来关联 LendPeople 模型，因为一个用户可以拥有多个借款人。

```User.hasMany(models.LendPeople);```

> 在 LendPeople 模型中定义 belongsTo 关系来关联 User 模型，因为一个借款人只能对应一个用户。

```LendPeople.belongsTo(models.User);```
> 在 LendPeople 模型中定义一个 hasMany 关系来关联 Lend 模型, 因为每个借款人可以有多条借款记录。

```LendPeople.hasMany(models.Lend);```
> 在 Lend 模型中定义 belongsTo 关系来关联 LendPeople 模型

```Lend.belongsTo(models.LendPeople);```



