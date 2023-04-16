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


