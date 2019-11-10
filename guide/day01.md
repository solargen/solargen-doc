# day01

## 一、开发环境搭建

### 1、JDK1.8

### 2、Mysql/Oracle

### 3、Maven

- 下载
- 解压
- 配置 settings.xml
  - 仓库路径
  - 镜像，如果配置了maven私服，配置私服地址

### 4、Tomcat

- 下载解压，如果是springboot项目，不需要tomcat

### 5、版本控制 -  TotoiseSVN/Git+TotoiseGit

### 6、开发工具 - Eclipse/MyEclipse/Idea

## 二、爱购商城-day01

### 1、知道商城，掌握商城分类

- B2B

- B2C

- C2C

- B2C2C

  我们的商城属于B2C,前期先树立良好的品牌形象，再去支持C2C，最终形态B2C2C

### 2、爱购商城项目的流程

- 传统项目
  - 可行性分析
  - 需求分析
    - 产品经理，项目需求分析师
  - 设计
    - 原型设计
    - 数据库设计
    - 架构设计
    - 概要设计
    - 详细设计
  - 编码阶段 -  开发
    - 提交高质量的代码 - 单元测试
  - 测试
    - 功能测试 - 自动化测试
    - 压力测试
  - 上线 - 部署项目，后期的运维
- 大型项目
  - 迭代开发 -- 敏捷开发
- 爱购商城
  - 需求分析 -- 见需求文档
    - 在线商城 -- 用户浏览商品
    - 平台管理 -- 后台的系统管理 后台用户和权限等
    - 支付中心 -- 支付
    - 用户中心 -- 用户的注册与登录
    - 商品模块 -- 管理商品信息（类型、品牌、属性管理、商品管理、上下架）
  - 原型设计 - 前端
    - UI
    - 项目经理/产品经理
  - 架构的设计
  - 。。。
  - 上线
    - 尽量不要说上线
    - 我开发完负责的模块就离职了。现在应该是测试阶段，项目还没有上线。

### 3、架构设计

![](E:\0515-java\课件\2019-10-08-B2C商城(爱购网)-day01\doc\01_后端架构设计.png)

- aigou-parent
  - aigou-plat-parent -- 平台服务
    - aigou-plat-interface -- domain、query、feign的client接口
    - aigou-plat-service -- controller、service、mapper
  - aigou-zuul -- 网关服务
  - aigou-basic -- 基础模块，封装基本的工具类
    - aigou-basic-util
    - 。。。。。
  - aigou-eureka -- 注册中心

### 4、搭建后端的架构

- 父模块 aigou-parent的搭建

  ```xml
  <properties>
          <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
          <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
          <java.version>1.8</java.version>
          <spring-cloud.version>Finchley.SR1</spring-cloud.version>
          <springboot.version>2.0.5.RELEASE</springboot.version>
      </properties>
  
      <dependencyManagement>
          <dependencies>
              <dependency>
                  <groupId>org.springframework.cloud</groupId>
                  <artifactId>spring-cloud-dependencies</artifactId>
                  <version>${spring-cloud.version}</version>
                  <type>pom</type>
                  <scope>import</scope>
              </dependency>
              <dependency>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-dependencies</artifactId>
                  <version>${springboot.version}</version>
                  <type>pom</type>
                  <scope>import</scope>
              </dependency>
          </dependencies>
      </dependencyManagement>
  ```

  

- 注册中心eureka

  - POM

    ```xml
    <dependencies>
    
            <!--web-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
            </dependency>
            <!--eureka-server-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
            </dependency>
            <!--spring security-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-security</artifactId>
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

    

  - application.yml

    ```yaml
    server:
      port: 8761
    
    eureka:
      instance:
        hostname: localhost
      client:
        registerWithEureka: false
        fetchRegistry: false
        serviceUrl:
          defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
    
    spring:
      security:
        user:
          name: root
          password: root
    ```

    

  - 启动类

    ```java
    package cn.itsource.aigou;
    
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
    
    @SpringBootApplication
    @EnableEurekaServer
    public class EurekaApplication {
    
        public static void main(String[] args) {
            SpringApplication.run(EurekaApplication.class,args);
        }
    
    }
    
    ```

    

  - 配置类

    ```java
    package cn.itsource.aigou;
    
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
    
    @EnableWebSecurity
    public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.csrf().ignoringAntMatchers("/eureka/**");
            super.configure(http);
        }
    }
    ```

    

- 平台服务

  - aigou-plat-parent - 略

  - plat-interface - 暂时不需要配置

  - plat-service

    - POM

      ```xml
      <dependencies>
      
              <!--web-->
              <dependency>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-starter-web</artifactId>
              </dependency>
              <!--eureka-client-->
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

      

    - application.yml

      ```yaml
      server:
        port: 8888
      spring:
        application:
          name: AIGOU-PLAT
      
      eureka:
        instance:
          prefer-ip-address: true
        client:
          serviceUrl:
            defaultZone: http://root:root@localhost:8761/eureka/
      
      ```

      

    - 启动类

      ```java
      package cn.itsource.aigou;
      
      import org.springframework.boot.SpringApplication;
      import org.springframework.boot.autoconfigure.SpringBootApplication;
      import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
      
      @SpringBootApplication
      @EnableEurekaClient
      public class PlatApplication {
      
          public static void main(String[] args) {
              SpringApplication.run(PlatApplication.class,args);
          }
      
      }
      
      ```

  - aigou-basic模块 基础模块

    - basic-util

      ```java
      package cn.itsource.aigou.util;
      
      import java.util.ArrayList;
      import java.util.List;
      
      /**
       * 分页工具类
       * @author solargen
       */
      public class PageList<T> {
      
          private Integer total = 0;
          private List<T> rows = new ArrayList<>();
      
          public Integer getTotal() {
              return total;
          }
      
          public void setTotal(Integer total) {
              this.total = total;
          }
      
          public List<T> getRows() {
              return rows;
          }
      
          public void setRows(List<T> rows) {
              this.rows = rows;
          }
      
          public PageList() {
          }
      
          public PageList(Integer total, List<T> rows) {
              this.total = total;
              this.rows = rows;
          }
      }
      
      ```

      

      ```java
      package cn.itsource.aigou.util;
      
      /**
       * Ajax请求结果封装的工具类
       * @author solargen
       */
      public class AjaxResult {
      
          private Boolean success = true;
      
          private String message = "操作成功!";
      
          private Object restObj;
      
          private AjaxResult(){}
      
          public static AjaxResult me(){
              return new AjaxResult();
          }
      
          public Boolean getSuccess() {
              return success;
          }
      
          public AjaxResult setSuccess(Boolean success) {
              this.success = success;
              return this;
          }
      
          public String getMessage() {
              return message;
          }
      
          public AjaxResult setMessage(String message) {
              this.message = message;
              return this;
          }
      
          public Object getRestObj() {
              return restObj;
          }
      
          public AjaxResult setRestObj(Object restObj) {
              this.restObj = restObj;
              return this;
          }
      }
      
      ```

      

  - aigou-zuul 网关服务

    - pom

      ```xml
      <dependencies>
              <!--web-->
              <dependency>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-starter-web</artifactId>
              </dependency>
              <!--eureka-client-->
              <dependency>
                  <groupId>org.springframework.cloud</groupId>
                  <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
              </dependency>
              <!--zuul-->
              <dependency>
                  <groupId>org.springframework.cloud</groupId>
                  <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
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

      

    - application.yml

      ```yaml
      server:
        port: 9527
      
      spring:
        application:
          name: AIGOU-ZUUL
      
      eureka:
        instance:
          prefer-ip-address: true
        client:
          serviceUrl:
            defaultZone: http://root:root@localhost:8761/eureka/
      
      zuul:
        ignoredServices: '*' #只能通过路由访问，不能使用服务名访问
        routes:
          plat:
            serviceId: AIGOU-PLAT
            path: /plat/**
        prefix: /services
      ```

      

    - 启动类

      ```java
      package cn.itsource.aigou;
      
      import org.springframework.boot.SpringApplication;
      import org.springframework.boot.autoconfigure.SpringBootApplication;
      import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
      
      /**
       * 网关服务的入口类
       * @author solargen
       */
      @SpringBootApplication
      @EnableZuulProxy
      public class ZuulApplication {
      
          public static void main(String[] args) {
              SpringApplication.run(ZuulApplication.class,args);
          }
      
      }
      
      ```

### 5、测试接口-Postman

- 给aigou-plat平台服务创建了一个登录接口

  ```java
  package cn.itsource.aigou.controller;
  
  import cn.itsource.aigou.domain.User;
  import cn.itsource.aigou.util.AjaxResult;
  import io.swagger.annotations.Api;
  import io.swagger.annotations.ApiImplicitParam;
  import io.swagger.annotations.ApiImplicitParams;
  import io.swagger.annotations.ApiOperation;
  import org.springframework.web.bind.annotation.PostMapping;
  import org.springframework.web.bind.annotation.RequestBody;
  import org.springframework.web.bind.annotation.RestController;
  
  @RestController
  public class LoginController {
  
      /**
       * 登录接口
       * @return
       */
      @PostMapping("/login")
      public AjaxResult login(@RequestBody User user){
          if("admin".equals(user.getUsername())&&"admin".equals(user.getPassword())){
              return AjaxResult.me().setSuccess(true).setMessage("登录成功!");
          }
          return AjaxResult.me().setSuccess(false).setMessage("登录失败!");
      }
  }
  
  ```

  

- 安装postman -- 略

- 使用postman

  - 请求的url
  - 请求的方式
  - 请求的参数
    - json参数 -》body-》raw-》json
  - send

### 6、接口文档工具-swagger

- 为什么使用swagger？

  - 可以根据扫描controller自动生成接口文档的描述
  - 可以使用swagger直接测试接口

- 单个服务

  - POM

    ```xml
    <!--swagger依赖-->
            <dependency>
                <groupId>io.springfox</groupId>
                <artifactId>springfox-swagger2</artifactId>
                <version>2.9.2</version>
            </dependency>
            <dependency>
                <groupId>io.springfox</groupId>
                <artifactId>springfox-swagger-ui</artifactId>
                <version>2.9.2</version>
            </dependency>
    ```

    

  - 配置类

    ```java
    package cn.itsource.aigou.config;
    
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
     
    import springfox.documentation.builders.ApiInfoBuilder;
    import springfox.documentation.builders.PathSelectors;
    import springfox.documentation.builders.RequestHandlerSelectors;
    import springfox.documentation.service.ApiInfo;
    import springfox.documentation.service.Contact;
    import springfox.documentation.spi.DocumentationType;
    import springfox.documentation.spring.web.plugins.Docket;
    import springfox.documentation.swagger2.annotations.EnableSwagger2;
     
    /**
    * @ClassName: swagger2配置
    * @Description: TODO
    * @author xx
    * @date 2018年7月5日
    */
     
    @Configuration
    @EnableSwagger2
    public class Swagger2 {
     
        @Bean
        public Docket createRestApi() {
            return new Docket(DocumentationType.SWAGGER_2)
                    .apiInfo(apiInfo())
                    .select()
                    .apis(RequestHandlerSelectors.basePackage("cn.itsource.aigou.controller"))
                    .paths(PathSelectors.any())
                    .build();
        }
    
    
        private ApiInfo apiInfo() {
            return new ApiInfoBuilder()
                    .title("平台服务api")
                    .description("平台服务接口文档说明")
                    .contact(new Contact("solargen", "", " lishugen@itsource.cn"))
                    .version("1.0")
                    .build();
        }
    
    }
    ```

    

  - 接口添加适当的注解用来描述接口

    ```java
    package cn.itsource.aigou.controller;
    
    import cn.itsource.aigou.domain.User;
    import cn.itsource.aigou.util.AjaxResult;
    import io.swagger.annotations.Api;
    import io.swagger.annotations.ApiImplicitParam;
    import io.swagger.annotations.ApiImplicitParams;
    import io.swagger.annotations.ApiOperation;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RestController;
    
    @RestController
    @Api(tags = "登录的Controller")
    public class LoginController {
    
        /**
         * 登录接口
         * @return
         */
        @ApiOperation(value = "登录的接口")
        @PostMapping("/login")
        public AjaxResult login(@RequestBody User user){
            if("admin".equals(user.getUsername())&&"admin".equals(user.getPassword())){
                return AjaxResult.me().setSuccess(true).setMessage("登录成功!");
            }
            return AjaxResult.me().setSuccess(false).setMessage("登录失败!");
        }
    }
    
    ```

  - 浏览器访问 localhost:8888(当前服务的端口)/swagger-ui.html

    ![1570522956687](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1570522956687.png)

- 网关配置swagger

  - 为什么要在网关中配置swagger？

    如果只在每一个服务配置了swagger，前端需要记录每个服务的ip和端口来访问swagger，查看接口文档，比较麻烦，我们可以在网关中配置swagger，前端直接访问网关的swagger，通过配置的列表可以切换到对应的服务中，查看当前服务都有哪些接口。

  - 实战

    - POM

      ```xml
      <!--swagger依赖-->
              <dependency>
                  <groupId>io.springfox</groupId>
                  <artifactId>springfox-swagger2</artifactId>
                  <version>2.9.2</version>
              </dependency>
              <dependency>
                  <groupId>io.springfox</groupId>
                  <artifactId>springfox-swagger-ui</artifactId>
                  <version>2.9.2</version>
              </dependency>
      ```

      

    - 配置类

      ```java
      package cn.itsource.aigou.config;
      
      import org.springframework.context.annotation.Bean;
      import org.springframework.context.annotation.Configuration;
      import org.springframework.context.annotation.Primary;
      import org.springframework.stereotype.Component;
      import springfox.documentation.builders.ApiInfoBuilder;
      import springfox.documentation.service.ApiInfo;
      import springfox.documentation.service.Contact;
      import springfox.documentation.spi.DocumentationType;
      import springfox.documentation.spring.web.plugins.Docket;
      import springfox.documentation.swagger.web.SwaggerResource;
      import springfox.documentation.swagger.web.SwaggerResourcesProvider;
      import springfox.documentation.swagger.web.UiConfiguration;
      import springfox.documentation.swagger2.annotations.EnableSwagger2;
      
      import java.util.ArrayList;
      import java.util.List;
      
      @Configuration
      @EnableSwagger2
      public class SwaggerConfig {
      
          @Bean
          public Docket createRestApi() {
              return new Docket(DocumentationType.SWAGGER_2)
                      .apiInfo(apiInfo());
          }
      
          private ApiInfo apiInfo() {
              return new ApiInfoBuilder()
                      .title("分布式购物系统")
                      .description("购物系统接口文档说明")
                      .contact(new Contact("", "", ""))
                      .version("1.0")
                      .build();
          }
      
      }
      ```

      ```java
      package cn.itsource.aigou.config;
      
      import org.springframework.context.annotation.Primary;
      import org.springframework.stereotype.Component;
      import springfox.documentation.swagger.web.SwaggerResource;
      import springfox.documentation.swagger.web.SwaggerResourcesProvider;
      
      import java.util.ArrayList;
      import java.util.List;
      
      @Component
      @Primary
      public class DocumentationConfig implements SwaggerResourcesProvider {
          @Override
          public List<SwaggerResource> get() {
              List resources = new ArrayList<>();
             //product,user等都是网关中配置路径,而且如果有前缀,需要加上
              resources.add(swaggerResource("平台管理", "/services/plat/v2/api-docs", "1.0"));
              resources.add(swaggerResource("商品系统", "/product/v2/api-docs", "2.0"));
              resources.add(swaggerResource("用户系统", "/user/v2/api-docs", "2.0"));
              resources.add(swaggerResource("基础系统", "/common/v2/api-docs", "2.0"));
              return resources;
          }
      
          private SwaggerResource swaggerResource(String name, String location, String version) {
              SwaggerResource swaggerResource = new SwaggerResource();
              swaggerResource.setName(name);
              swaggerResource.setLocation(location);
              swaggerResource.setSwaggerVersion(version);
              return swaggerResource;
          }
      }
      ```

      

      **注意：**

      **网关中配置swagger后，单个的服务也需要配置swagger，否则不会生效**

## 三、总结

### 1、重点

- 架构设计图纸，必须理解每一个箭头
- 后端架构的搭建
- postman的使用
- 项目背景，项目模块的整理

### 2、难点

- 架构图
- 后端架构的搭建
- eureka的认证

### 3、面试题

- 描述一下你的商城项目
- 说明一下你的项目流程
- 项目的人员组成，项目周期









