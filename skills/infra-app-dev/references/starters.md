# Starter 选择表

> 由 `scripts/build-modules.mjs` 从 `today-infrastructure` 的 starter 模块生成，请勿手工编辑。
> 生成时框架版本：`5.0-Draft.10-SNAPSHOT`

只引需要的 starter。坐标为 `cn.taketoday:<模块名>`，版本由 BOM 或 `infra-dependencies` 管理。

## 应用启动与日志

| Starter | 说明 |
|---|---|
| `infra-starter-application` | Infra application starter |
| `infra-starter-logback` | Starter for logging using Logback |
| `infra-starter-logging` | Starter for logging default logging |

## Web MVC 与服务器

| Starter | 说明 |
|---|---|
| `infra-starter-netty-server` | Starter for using Netty as the embedded container. |
| `infra-starter-webmvc` | Starter for building web, including RESTful, applications using Web MVC. |
| `infra-starter-webmvc-test` | Starter Web MVC Test. |
| `infra-starter-websocket` | Starter for building WebSocket applications using Infra MVC WebSocket support |

## Web API 与响应式

| Starter | 说明 |
|---|---|
| `infra-starter-reactor-netty` | — |
| `infra-starter-reactor-server` | Starter for using Reactor Netty as the embedded reactive HTTP server. |
| `infra-starter-web` | Starter for building web, including RESTful, applications using Web API. |
| `infra-starter-webclient` | Starter using reactive HTTP clients (WebClient and HTTP Service Clients) |

## HTTP 客户端

| Starter | 说明 |
|---|---|
| `infra-starter-http-service` | Starter for HTTP Service Interface Clients. |
| `infra-starter-restclient` | Starter using blocking HTTP clients (RestClient, RestTemplate and HTTP Service Clients) |
| `infra-starter-restclient-test` | Starter for testing Infra blocking HTTP clients (RestClient, RestTemplate and HTTP Service Clients) |

## 数据访问

| Starter | 说明 |
|---|---|
| `infra-starter-jdbc` | Starter for using JDBC with the HikariCP connection pool |
| `infra-starter-jdbc-test` | Starter for testing JDBC with the HikariCP connection pool |
| `infra-starter-persistence` | Starter for using JDBC and simple persistence lib |
| `infra-starter-sql` | Starter Infra SQL |
| `infra-starter-transaction` | Starter for Transaction |

## 序列化

| Starter | 说明 |
|---|---|
| `infra-starter-gson` | Starter for using GSON |
| `infra-starter-jackson` | Starter for Jackson |
| `infra-starter-json` | Starter for reading and writing JSON |
| `infra-starter-jsonb` | Starter for using aspect-oriented programming with AspectJ |

## 模板与邮件

| Starter | 说明 |
|---|---|
| `infra-starter-freemarker` | Starter for building MVC web applications using FreeMarker views |
| `infra-starter-groovy-templates` | Starter for using Groovy Templates |
| `infra-starter-mail` | Starter for using Java Mail and Infra email sending support |

## 校验与 AOP

| Starter | 说明 |
|---|---|
| `infra-starter-aspectj` | Starter for using aspect-oriented programming with AspectJ |
| `infra-starter-validation` | Starter for using Java Bean Validation with Hibernate Validator |

## 测试

| Starter | 说明 |
|---|---|
| `infra-starter-test` | Starter for testing Infra applications with libraries including JUnit Jupiter, Hamcrest and Mockito |

## 数据库迁移

| Starter | 说明 |
|---|---|
| `infra-starter-flyway` | Starter for using Flyway database migrations |
