# day02

## 一、Maven私服 - 扩展

```xml
<mirror>
	<id>nexus-itsource</id>
	<mirrorOf>*</mirrorOf>
	<name>Nexus itsource</name>
	<url>http://172.16.4.254:8081/repository/maven-public/</url>
</mirror>
```

通常情况下公司直接给你settings.xml文件，把这个文件替换你的maven中的settings.xml就可以了

![img](https://img2018.cnblogs.com/blog/398358/201907/398358-20190716100518508-94247349.jpg)

## 二、Git

### 1、Git概述

#### git和svn的区别

- git

​	分布式的版本控制，每个开发人员保留着完整的版本库信息，在没有网络的情况下也可以提交到本地版本库中，等有网络的时候再与其他开发人员进行版本库的同步。

​	对于分支的切换与合并操作非常方便。

- svn

​	集中式的版本控制，所有的版本信息统一保存在远程版本仓库中，容易出现单点故障。并且没有网络的情况下不能提交代码。

### 2、Git的安装

### 3、Git的操作

#### Git的命令行操作

- 项目经理

  - 创建版本库

    git init --bare itsource.git

  - 克隆版本库

    git clone 版本仓库地址 本地路径

  - 放入项目架构代码

  - 提交

    先设置user的相关信息

    ​	git config user.name "zhangsan"

    ​	git config user.email "xxxxx"

    ​	只针对于当前git仓库

    ​	全局设置 --global

    先添加到版本控制当中（添加到**暂存区**）

    ​	git add . 当前的所有的文件和目录

    提交到本地库

    ​	git commit 

    输入提交的信息

  - 推送

    git push

- 开发人员A 
  - 克隆  git clone
  - 修改代码
  - 添加修改到暂存区  git add
  - 提交 
  - 推送
- 开发人员B
  - 克隆
  - 修改代码
  - 添加修改到**暂存区** git add
  - 提交
  - 拉取   git pull
  - 推送

#### Git的图形化界面的操作 

​	略

#### Git的冲突

​	git的冲突并不会像svn那样产生多个冲突的版本文件，只有一个源文件

- 编辑冲突文件
- 标记为已解决
- 重新提交推送

#### Git的分支 -- 扩展

git分支是git的一个强大的应用之一，git已经把分支加入到了自己的logo中

- 创建分支

- 切换分支

- 合并分支

  我想把itsource分支合并到master分支上，先切换回master分支，再操作合并分支

### 4、Git集成到Idea中



### 5、Git代码仓库的搭建

方案选择：

- 自己搭建  Gitlab
- 使用别人搭建好的  GitHub  码云

**注意：**

- 我们现在使用的是GitHub,但是公司中基本不会使用GitHub或者码云，都是自己搭建的Gitlab

## 三、爱购网仓库的搭建

- 创建github的仓库
  - 注册github账号
  - 新建仓库
- 克隆仓库到本地
- 把项目的架构代码拷贝到本地仓库目录中
- 提交&推送
- 使用Idea重新从github上克隆



## 四、配置中心服务的搭建（集群版）

### 1、搭建git仓库

application-plat-dev.yml

```yaml
server:
  port: 8888
spring:
  application:
    name: AIGOU-PLAT

```

application-plat-zuul.yml

```yaml
server:
  port: 9527

spring:
  application:
    name: AIGOU-ZUUL

zuul:
  ignoredServices: '*' #只能通过路由访问，不能使用服务名访问
  routes:
    plat:
      serviceId: AIGOU-PLAT
      path: /plat/**
  prefix: /services
```



### 2、创建配置中心服务端

- 创建maven项目

- 添加依赖

  ```xml
  <dependencies>
  
          <!--web-->
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
  
          <!--config-server-->
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-config-server</artifactId>
          </dependency>
  
          <!--eureka-client依赖-->
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
          </dependency>
  
  
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  ```

  

- 配置

  application.yml

  ```yaml
  server:
    port: 6969
  
  spring:
    cloud:
      config:
        server:
          git:
            uri: https://github.com/jingjingwoxiangni/aigou-config.git
    application:
      name: AIGOU-CONFIG
  
  #将配置中心服务端注册到Eureka注册中心中
  eureka:
    client:
      serviceUrl:
        defaultZone: http://root:root@localhost:8761/eureka/ #注册中心的地址
    instance:
      prefer-ip-address: true
  
  
  ```

  

- 启动类

  ```java
  /**
   * @author solargen
   * @version 1.0
   * @description TODO
   * @date 2019/10/9 14:50
   */
  @SpringBootApplication
  @EnableConfigServer
  public class ConfigServerApplication {
  
      public static void main(String[] args) {
          SpringApplication.run(ConfigServerApplication.class,args);
      }
  
  }
  ```

  

- 测试

  localhost:6969/application-plat/dev

  ![1570606864134](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570606864134.png)

### 3、更改配置中心的客户端

- 添加依赖

  ```xml
  <!--config-client-->
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-config</artifactId>
          </dependency>
  ```

  

- 配置

  - 删除之前的配置文件

  - 创建bootstrap.yml配置文件

    ```yaml
    spring:
      cloud:
        config:
          profile: dev
          name: application-plat
          #uri: http://localhost:6969 #单机配置
          discovery:
            service-id: AIGOU-CONFIG #配置中心集群配置
            enabled: true
    #注册中心配置
    eureka:
      instance:
        prefer-ip-address: true
      client:
        serviceUrl:
          defaultZone: http://root:root@localhost:8761/eureka/
    ```

    需要注意的地方：

    比如配置中心仓库中有个配置文件application-zuul-dev.yml

    {spring.cloud.config.name}-{spring.cloud.config.profile}.yml

    其中

    spring.cloud.config.name = application-zuul

    spring.cloud.config.profile = dev

- 启动服务测试

  ![1570607089203](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570607089203.png)

## 五、前端知识的铺垫

### 1、NodeJS&Npm

nodejs就是js的服务端的运行环境，类似于JRE

npm是nodejs的包管理工具，类似于Maven

#### nodejs的安装

- 测试是否安装成功  node -v

#### npm的安装

- npm不需要独立安装
- 新版本的nodejs在安装好后默认就有了npm
- npm -version

#### npm的入门

​	npm在下载依赖的时候默认到中央仓库中下载，速度比较慢，某些资源由于不可抗因素被墙掉，所以我们可以像maven一样安装一个淘宝镜像(cnpm),以后使用cnpm去下载依赖，默认从淘宝镜像中下载。

```js
npm install -g cnpm --registry=https://registry.npm.taobao.org
```



- 使用npm创建前端项目

  npm init -y

  初始化一个nodejs的项目，会在项目的根目录下创建一个package.json的文件，类型与maven的pom.xml

- 添加依赖

  npm/cnpm install [-g] 模块名称

- 测试使用依赖

- 查看依赖

  npm/cnpm list 模块名称

- 删除依赖

  npm/cmpn uninstall 模块名称

### 2、ES6的前端语法

#### let&const

​	let 块级变量

​	const 常量

#### 解构表达式

​	数组解构

​	对象的解构

#### 箭头函数

​	简化匿名函数

#### Promise对象

​	异步

#### 模块化

​	import    export



### 3、webpack打包 -- 了解

- 创建一个前端项目

- 使用npm init -y初始化项目

- 在项目根目录创建一个build目录用来存放打包的结果

- 在项目的根目录创建一个src目录用来编写js源码

- src下创建util.js和main.js

  util.js

  ```js
  export default {
      sum(a,b){
          return a+b;
      }
  }
  ```

  main.js -- 入口的js文件（类似java的main方法）

  ```js
  import util from './util.js'
  let result = util.sum(1,2);
  document.write("计算的结果为:"+result);
  ```

- 在build目录下创建一个index.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script type="text/javascript" src="./bundle.js"></script>
  </head>
  <body>
  
  </body>
  </html>
  ```

- 全局安装webpack&webpack-cli

  cnpm install -g webpack

  cnpm isntall -g webpack-cli

- 在项目根目录下创建一个webpack.config.js配置文件

  ```js
  const path = require('path');
  
  module.exports = {
      entry: './src/main.js',
      output: {
          path: path.resolve(__dirname, 'build'),
          filename: 'bundle.js'
      }
  };
  ```

- 执行打包命令webpack

- 运行index.html

  ![1570620258262](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570620258262.png)

### 4、vue-cli 

#### 作用：快速创建一个前端的基于vue的项目

全局安装vue的脚手架

vue init webpack 项目名称 快速创建一个基于webpack模板的vue的前端项目

![1570621490380](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570621490380.png)

## 六、总结

### 1、重点

- Git的使用
- 爱购网的配置中心搭建起来
- ES6的前端语法

### 2、难点

- 爱购网的配置中心的搭建
- webpack是一个难点，不要钻牛角尖
- vue-cli搭建好项目后的一个修改

### 3、作业

- Git的两种操作方式 -- 截图
  - 命令行
  - 图形化界面
- 爱购网项目进度跟上
  - 仓库搭建
  - 配置中心
- ES6的新语法敲一遍

