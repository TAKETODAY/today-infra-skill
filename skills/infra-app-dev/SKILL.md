---
name: infra-app-dev
description:
  Use when building, extending, or debugging an application on TODAY Infrastructure (Java framework; Maven coordinates cn.taketoday, Java packages infra.*): bootstrapping a project, @InfraApplication, controllers and request mapping, dependency injection, transactions, JDBC, validation, @InfraTest/MockMvc/WebTestClient, and the infra.application Gradle plugin. 使用 TODAY Infrastructure 编写业务应用时使用。
---

# 用 TODAY Infrastructure 开发应用

TODAY Infrastructure（简称 infra）是一个独立的 Java 应用框架，不是 Spring Boot 的二进制兼容替代品。它的设计参考了 Spring，但 **包名、注解、Gradle 插件、配置前缀都不同**。写代码时不要凭 Spring 记忆直接套用。

## 先确认方向

| 任务                                                   | 用哪个 skill      |
|--------------------------------------------------------|-------------------|
| 用 infra 写业务应用、加接口、集成数据库、写测试        | **本 skill**      |
| 修改 `today-infrastructure` 仓库本身（含移植上游代码） | 不在本 skill 范围 |

## 最小可运行应用

```java
package com.example.demo;

import infra.app.Application;
import infra.app.InfraApplication;
import infra.web.annotation.GET;
import infra.web.annotation.RestController;

@RestController
@InfraApplication
public class DemoApplication {

  public static void main(String[] args) {
    Application.run(DemoApplication.class, args);
  }

  @GET("/hello")
  public String hello() {
    return "Hello, TODAY!";
  }
}
```

要点：

- `Application.run(Class<?>, String...)` 是静态入口，传入主配置类；不是 `SpringApplication.run`。
- `@InfraApplication` = `@InfraConfiguration` + `@EnableAutoConfiguration` + `@ComponentScan`（扫描主类所在包及子包）。
- 路由注解是 `@GET` / `@POST` / `@PUT` / `@DELETE` / `@PATCH`（在 `infra.web.annotation`），也支持 `@GetMapping` 等 Spring 风格别名。类级别仍用 `@RequestMapping` 表达前缀。
- 运行：`./gradlew infraRun --args='--server.port=8080'`。示例常用端口 8080；端口以启动日志实际输出为准。

## 与 Spring Boot 的对照

| 概念        | Spring                                           | TODAY Infrastructure                                                  |
|-------------|--------------------------------------------------|-----------------------------------------------------------------------|
| 包名        | `org.springframework.*`                          | `infra.*`                                                             |
| 启动类注解  | `@SpringBootApplication`                         | `@InfraApplication`                                                   |
| 启动入口    | `SpringApplication.run`                          | `Application.run`                                                     |
| 配置前缀    | `spring.*`                                       | `infra.*`（如 `infra.profiles.active`）                               |
| 测试注解    | `@SpringBootTest`                                | `@InfraTest`（`infra.test.app.context.InfraTest`）                    |
| 测试扩展    | `SpringExtension`                                | `InfraExtension`（`infra.test.context.junit.jupiter.InfraExtension`） |
| Gradle 插件 | `org.springframework.boot`                       | `infra.application`（门户发布名 `cn.taketoday.application`）          |
| Maven 坐标  | `org.springframework.boot:*`                     | `cn.taketoday:infra-starter-*`                                        |
| Mock MVC    | `MockMvcBuilders`（`infra.test.web.mock.setup`） | 同名，但包在 `infra.test.web.mock.setup`                              |

对照表只用于迁移心智， **API 细节必须查证**：签名、默认值、注解属性经常不同。

## 依赖选择

只引需要的 starter，不要全量引入。

| 需求                 | 依赖                                                               |
|----------------------|--------------------------------------------------------------------|
| 纯后端应用（无 Web） | `cn.taketoday:infra-starter-application` + `infra-starter-logback` |
| Web MVC + Netty      | `cn.taketoday:infra-starter-webmvc` + `infra-starter-netty-server` |
| 响应式 Web           | `infra-starter-web` + `infra-starter-reactor-server`               |
| JDBC / 事务          | `infra-starter-jdbc` / `infra-starter-transaction`                 |
| 校验                 | `infra-starter-validation`                                         |
| JSON                 | `infra-starter-jackson`（或 `-gson` / `-jsonb`）                   |
| 测试                 | `infra-starter-test`；Web 测试再加 `infra-starter-webmvc-test`     |

完整列表见 `references/starters.md`（自动生成），或 `infra-docs/modules/application/`。

## Gradle 配置骨架

```groovy
plugins {
  id 'java'
  id 'infra.application' version '5.0-Draft.10'  // 换成你要用的框架版本
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
  toolchain { languageVersion = JavaLanguageVersion.of(17) }
}

repositories {
  mavenLocal()
  maven { url 'https://central.sonatype.com/repository/maven-snapshots/' }
  mavenCentral()
}

dependencies {
  implementation 'cn.taketoday:infra-starter-webmvc'
  implementation 'cn.taketoday:infra-starter-netty-server'
  testImplementation 'cn.taketoday:infra-starter-test'
}
```

需要依赖版本管理时，`io.spring.dependency-management` 插件可以导入 `infra-dependencies`；也可以直接用 `infra-bom`。

## 任务路由

按任务查对应 reference，不要一次加载全部。

| 任务                                         | 参考                                  |
|----------------------------------------------|---------------------------------------|
| 建工程、启动、打包、运行                     | `references/bootstrap.md`             |
| 控制器、参数绑定、返回值、异常处理、MVC 配置 | `references/web-mvc.md`               |
| 函数式端点、CORS、视图、REST 客户端          | `references/web-mvc-advanced.md`      |
| Session、WebSocket                           | `references/web-session-websocket.md` |
| Bean、注入、作用域、生命周期、配置类、@Value | `references/core-container.md`        |
| 资源加载、日志、空值安全、AOT                | `references/core-runtime.md`          |
| 切面、通知、切点、代理                       | `references/core-aop.md`              |
| 表达式语言                                   | `references/core-expression.md`       |
| 校验、类型转换、Formatter                    | `references/core-validation.md`       |
| JdbcTemplate、行映射、参数、嵌入式库         | `references/data-access.md`           |
| 声明式/编程式事务、传播、回滚                | `references/transaction.md`           |
| 持久化、实体映射、分页、审计                 | `references/persistence.md`           |
| @InfraTest、上下文管理、事务测试、测试注解   | `references/testing-context.md`       |
| MockMvc、WebTestClient                       | `references/testing-mvc.md`           |
| 缓存、调度、邮件、JMX                        | `references/integration.md`           |
| 从注解/类名反查文档                          | `references/api-index.md`             |
| 仓库根文件（README/CONTRIBUTING/示例）补漏   | `references/project-files.md`         |

## 关键约定

1. **配置写在 `application.properties` / `application.yaml`，前缀 `infra.*`**。例如 `infra.profiles.active=dev`、`infra.auto-configuration.exclude=...`。
2. **JDK 17+**。框架发布产物兼容 17，构建本身用更高 JDK。
3. **自动配置类**位于 `infra.context.annotation.config`，排除自动配置用 `infra.auto-configuration.exclude`。
4. **`@InfraApplication` 的 `scanBasePackages` 只影响组件扫描**，不扫描 `@ConfigurationProperties`；需要时加 `@ConfigurationPropertiesScan`。
5. **不要引入 Spring 的 jar** 指望它和 infra 共存——包名不同但语义相似，混用会产生难以定位的问题。
6. 测试用 **AssertJ + JUnit 5**，测试类以 `*Tests` 命名。

## 深挖

- 文档源码在本仓库 `infra-docs/modules/`（asciidoc），references 里的每个页面都标注了原文路径。
- 在线文档站：`https://today-tech.cn`（`infra-docs` 的 Antora 站点）。
- 真实应用参考：`https://github.com/TAKETODAY/today-blog`。
- 需要精确 API 时，直接读 `infra-docs` 原文或用 `codegraph` 查框架源码；不要根据本文的片段臆造方法重载。
