# 仓库根文件与示例片段

> 由 `scripts/sync-context7.mjs` 从 context7 的 `llms.txt` 生成，请勿手工编辑。
> 只保留 `infra-docs` 未覆盖的内容（README、CONTRIBUTING、infra-samples 等）；
> 文档正文的权威来源仍是 `infra-docs`，本文件用于补齐“项目怎么跑起来”这类信息。

条目 9 个（跳过：已在 infra-docs 覆盖 74、输出/占位 0、无代码 0）。

## `CONTRIBUTING.md`

### 克隆仓库并构建

克隆你的Fork仓库并使用Gradle Wrapper构建项目。构建工具链使用JDK 25，发布制品兼容Java 17及以上版本。

```bash
git clone https://github.com/YOUR_USERNAME/today-infrastructure.git
cd today-infrastructure
```

```bash
./gradlew build
```

## `README.md`

### 创建最小 HTTP 接口 (DemoApplication.java)

创建应用入口和控制器，使用 @InfraApplication、@RestController、@GET 注解。运行环境 JDK 17+。

```java
package example;

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

### 子模块 build.gradle 应用插件

使用上述任一配置后，子模块可应用 'infra.application' 插件。包含依赖 infra-starter-netty-server 和 infra-starter-webmvc。

```groovy
apply plugin: "java"
apply plugin: 'infra.application'

repositories {
  mavenLocal()
  maven { url "https://central.sonatype.com/repository/maven-snapshots/" }
  maven { url "https://maven.aliyun.com/repository/public" }
  mavenCentral()
}

dependencies {
  implementation 'cn.taketoday:infra-starter-netty-server'
  implementation 'cn.taketoday:infra-starter-webmvc'
}
```

### 克隆并运行示例 (bash)

直接运行 infra-samples 示例，无需手动创建工程。需要 Git 和 JDK，首次运行 Gradle 会下载依赖。Windows 使用 gradlew.bat。

```bash
git clone https://github.com/TAKETODAY/today-infrastructure.git
cd today-infrastructure/infra-samples
./gradlew infraRun --args='--server.port=8080'
```

### 启动服务 (bash)

在应用工程根目录执行，需要 Gradle Wrapper 和 infra.application 插件。Windows 使用 gradlew.bat。

```bash
./gradlew infraRun --args='--server.port=8080'
```

### Gradle 插件配置 (settings.gradle)

一般项目方式，在 settings.gradle 中配置 classpath。与 buildSrc 方式二选一。

```groovy
buildscript {
  repositories {
    mavenLocal()
    maven { url = "https://central.sonatype.com/repository/maven-snapshots/" }
    mavenCentral()
  }

  dependencies {
    classpath "cn.taketoday:infra-gradle-plugin:$infraVersion"
  }
}
```

### 复现性能测试：JVM 模式压测命令

用于复现 today-blog 带缓存分页查询 API 的压测。运行前需准备数据库、初始化数据、安装 wrk 并确认接口正常返回。包含克隆项目、启动应用（JVM 模式）、低并发延迟测试和高并发吞吐测试。Native Image 测试需额外记录 GraalVM 版本、构建参数和启动命令，此命令仅用于 JVM 模式。

```bash
# 克隆示例项目
git clone https://github.com/TAKETODAY/today-blog
cd today-blog

# 启动应用（JVM 模式）
./gradlew :blog-api:infraRun

# 低并发延迟测试
wrk -t2 -c10 -d30s --latency 'http://127.0.0.1:8080/api/articles?size=1'

# 高并发吞吐测试
wrk -t20 -c5000 -d1m --latency 'http://127.0.0.1:8080/api/articles?size=1'
```

### 验证接口 (curl + 响应)

服务启动后，在另一个终端执行 curl 验证。预期响应为 'Hello, TODAY!'。

```bash
curl http://localhost:8080/hello
```

## `infra-samples/hello-cli/README.md`

### 运行命令行应用

在 infra-samples 目录执行 Gradle 任务启动应用。Windows 使用 gradlew.bat。输出 Hello, World!。

```bash
./gradlew :hello-cli:infraRun
```
