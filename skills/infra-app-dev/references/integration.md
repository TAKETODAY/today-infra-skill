# 集成能力

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

REST 客户端、缓存、调度、邮件、JMX、动态语言。

覆盖文档：26 页（含示例 15 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- 集成 —— `integration`
- **附录** —— `integration/appendix`
- 缓存抽象 —— `integration/cache`
- **基于注解的声明式缓存** —— `integration/cache/annotations`
- 基于 XML 的声明式缓存 —— `integration/cache/declarative-xml`
- **JCache (JSR-107) 注解** —— `integration/cache/jsr-107`
- 插入不同的后端缓存 —— `integration/cache/plug`
- 如何设置 TTL/TTI/驱逐策略/XXX 功能？ —— `integration/cache/specific-config`
- **配置缓存存储** —— `integration/cache/store-configuration`
- 理解缓存抽象 —— `integration/cache/strategies`
- **CDS** —— `integration/cds`
- JVM 检查点恢复 —— `integration/checkpoint-restore`
- **电子邮件** —— `integration/email`
- JMX —— `integration/jmx`
- **将您的 Bean 导出到 JMX** —— `integration/jmx/exporting`
- **控制 Bean 的管理接口** —— `integration/jmx/interface`
- **使用 JSR-160 连接器** —— `integration/jmx/jsr160`
- **控制 Bean 的 ObjectName 实例** —— `integration/jmx/naming`
- **通知** —— `integration/jmx/notifications`
- **通过代理访问 MBean** —— `integration/jmx/proxy`
- 更多资源 —— `integration/jmx/resources`
- **REST 客户端** —— `integration/rest-clients`
- **任务执行与调度** —— `integration/scheduling`
- 语言支持 —— `languages`
- **动态语言支持** —— `languages/dynamic`
- Apache Groovy —— `languages/groovy`

## 集成

> 原文：[`integration`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration.adoc)

### 概述

本章节涵盖了框架与多项技术集成。

## 附录

> 原文：[`integration/appendix`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/appendix.adoc)

### 概述

##### jee 模式

jee 元素处理与 Jakarta EE (Enterprise Edition) 配置相关的问题， 例如查找 JNDI 对象和定义 EJB 引用。 要使用 jee 模式中的元素，您需要在 Infra XML 配置文件的顶部包含以下序言。 以下代码段中的文本引用了正确的模式，以便 jee 命名空间中的元素可供您使用：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jee="http://www.springframework.org/schema/jee"
  xsi:schemaLocation="
    http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/jee
    https://www.springframework.org/schema/jee/spring-jee.xsd">

  <!-- bean definitions here -->

</beans>
```

##### <jee:jndi-lookup/> (简单)

以下示例展示了如何在不使用 jee 模式的情况下使用 JNDI 查找数据源：

```xml
<bean id="dataSource" class="infra.jndi.JndiObjectFactoryBean">
  <property name="jndiName" value="jdbc/MyDataSource"/>
</bean>
<bean id="userDao" class="com.foo.JdbcUserDao">
  <!-- Infra will do the cast automatically (as usual) -->
  <property name="dataSource" ref="dataSource"/>
</bean>
```

##### <jee:jndi-lookup/> (带有单个 JNDI 环境设置)

以下示例展示了如何在不使用 jee 的情况下使用 JNDI 查找环境变量：

##### <jee:jndi-lookup/> (带有多个 JNDI 环境设置)

以下示例展示了如何在不使用 jee 的情况下使用 JNDI 查找多个环境变量：

##### <jee:jndi-lookup/> (复杂)

以下示例展示了如何在不使用 jee 的情况下使用 JNDI 查找数据源和许多不同的属性：

## 缓存抽象

> 原文：[`integration/cache`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cache.adoc)

### 概述

自 3.1 起，TODAY Framework 支持在现有 Infra 应用中透明地添加缓存。与 事务 支持类似，缓存抽象允许以一致方式使用多种缓存解决方案， 对代码影响最小。 缓存抽象显著扩展，支持 JSR-107 注解 并提供更多自定义选项。

## 基于注解的声明式缓存

> 原文：[`integration/cache/annotations`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cache/annotations.adoc)

### 概述

对于缓存声明，Infra 缓存抽象提供了一组 Java 注解：

#### @Cacheable 注解

顾名思义，您可以使用 @Cacheable 来划分可缓存的方法——即结果存储在缓存中的方法，以便在随后的调用（使用相同的参数）中，直接返回缓存中的值，而无需实际调用该方法。在最简单的形式中，注解声明需要与注解方法关联的缓存名称，如下例所示：

```java
@Cacheable("books")
public Book findBook(ISBN isbn) {...}
```

##### 自定义键生成声明

由于缓存是通用的，目标方法很可能具有各种无法直接映射到缓存结构之上的签名。当目标方法有多个参数，其中只有部分参数适合缓存（而其余参数仅由方法逻辑使用）时，这一点往往变得显而易见。考虑以下示例：

```java
@Cacheable("books")
public Book findBook(ISBN isbn, boolean checkWarehouse, boolean includeUsed);
```

##### 自定义缓存解析

默认的缓存解析非常适合使用单个 CacheManager 且没有复杂缓存解析要求的应用程序。 对于使用多个缓存管理器的应用程序，您可以设置每个操作要使用的 cacheManager，如下例所示：

##### 同步缓存

在多线程环境中，某些操作可能会针对相同的参数并发调用（通常在启动时）。默认情况下，缓存抽象不锁定任何内容，并且相同的值可能会被计算多次，从而破坏了缓存的目的。 对于这些特定情况，您可以使用 sync 属性来指示底层缓存提供程序在计算值时锁定缓存条目。结果是，只有一个线程忙于计算值，而其他线程则被阻塞，直到缓存中的条目更新。以下示例显示了如何使用 sync 属性：

##### 使用 CompletableFuture 和响应式返回类型进行缓存

缓存注解将 CompletableFuture 和响应式返回类型纳入考量，自动相应地调整缓存交互。 对于返回 CompletableFuture 的方法，该 future 生成的对象将在完成时被缓存，并且缓存命中的缓存查找将通过 CompletableFuture 检索：

##### 条件缓存

有时，方法可能并不总是适合缓存（例如，它可能取决于给定的参数）。缓存注解通过 condition 参数支持此类用例，该参数接受一个 SpEL 表达式，该表达式的计算结果为 true 或 false。如果是 true，则缓存该方法。如果不是，则其行为就像该方法未缓存一样（即，无论缓存中有什么值或使用什么参数，每次都会调用该方法）。例如，仅当参数 name 的长度小于 32 时，才会缓存以下方法：

#### @CachePut 注解

当需要在不干扰方法执行的情况下更新缓存时，可以使用 @CachePut 注解。即，始终调用该方法，并将其结果放入缓存中（根据 @CachePut 选项）。它支持与 @Cacheable 相同的选项，应用于缓存填充而不是方法流优化。以下示例使用 @CachePut 注解：

#### @CacheEvict 注解

缓存抽象不仅允许填充缓存存储，还允许驱逐。此过程对于从缓存中删除过时或未使用的数据很有用。与 @Cacheable 相反，@CacheEvict 划分了执行缓存驱逐的方法（即，充当从缓存中删除数据的触发器的方法）。与其兄弟类似，@CacheEvict 需要指定受操作影响的一个或多个缓存，允许指定自定义缓存和键解析或条件，并具有一个额外的参数 (allEntries)，该参数指示是否需要执行范围广泛的缓存驱逐，而不仅仅是条目驱逐（基于键）。以下示例驱逐 books 缓存中的所有条目：

#### @Caching 注解

有时，需要指定相同类型的多个注解（例如 @CacheEvict 或 @CachePut）——例如，因为不同缓存之间的条件或键表达式不同。@Caching 允许在同一方法上使用多个嵌套的 @Cacheable、@CachePut 和 @CacheEvict 注解。以下示例使用两个 @CacheEvict 注解：

#### @CacheConfig 注解

到目前为止，我们已经看到缓存操作提供了许多自定义选项，并且您可以为每个操作设置这些选项。但是，如果某些自定义选项适用于类的所有操作，则配置起来可能会很繁琐。例如，为类的每个缓存操作指定要使用的缓存名称可以用单个类级别定义替换。这就是 @CacheConfig 发挥作用的地方。以下示例使用 @CacheConfig 设置缓存名称：

#### 启用缓存注解

重要的是要注意，即使声明了缓存注解也不会自动触发它们的操作 - 就像 Infra 中的许多事情一样，该功能必须以声明方式启用（这意味着如果您怀疑缓存是罪魁祸首，您可以通过仅删除一行配置而不是代码中的所有注解来禁用它）。 要启用缓存注解，请将注解 @EnableCaching 添加到您的一个 @Configuration 类中：

#### 使用自定义注解

此功能仅适用于基于代理的方法，但可以通过使用 AspectJ 稍加努力来启用。 spring-aspects 模块仅为标准注解定义了一个切面。如果您定义了自己的注解，还需要为这些注解定义一个切面。查看 AnnotationCacheAspect 以获取示例。 缓存抽象允许您使用自己的注解来标识什么方法触发缓存填充或驱逐。这作为一种模板机制非常方便，因为它消除了重复缓存注解声明的需要，如果指定了键或条件，或者如果您的代码库中不允许外部导入（infra），这尤其有用。与其 构造型 注解类似，您可以将 @Cacheable、@CachePut、@CacheEvict 和 @CacheConfig 用作 元注解（即可以注解其他注解的注解）。在以下示例中，我们将常见的 @Cacheable 声明替换为我们自己的自定义注解：

## 基于 XML 的声明式缓存

> 原文：[`integration/cache/declarative-xml`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cache/declarative-xml.adoc)

### 概述

如果注解不是一种选择（可能是由于无法访问源代码或没有外部代码），则可以使用 XML 进行声明式缓存。因此，您可以指定目标方法和外部缓存指令（类似于声明式事务管理 建议），而不是注解缓存方法。上一节中的示例可以转换为以下示例： 在前面的配置中，bookService 被设为可缓存。要应用的缓存语义封装在 cache:advice 定义中，这会导致 findBooks 方法用于将数据放入缓存，而 loadBooks 方法用于驱逐数据。这两个定义都针对 books 缓存工作。 aop:config 定义通过使用 AspectJ 切入点表达式将缓存建议应用于程序中的适当点（更多信息可在 Infra 面向切面编程 中找到）。在前面的示例中，考虑了 BookService 中的所有方法，并将缓存建议应用于它们。 声明式 XML 缓存支持所有基于注解的模型，因此在两者之间移动应该相当容易。此外，两者都可

## JCache (JSR-107) 注解

> 原文：[`integration/cache/jsr-107`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cache/jsr-107.adoc)

### 概述

从 4.1 版开始，Infra 缓存抽象完全支持 JCache 标准 (JSR-107) 注解：@CacheResult、@CachePut、@CacheRemove 和 @CacheRemoveAll 以及 @CacheDefaults、@CacheKey 和 @CacheValue 配套组件。 即使不将缓存存储迁移到 JSR-107，您也可以使用这些注解。内部实现使用 Infra 缓存抽象，并提供符合规范的默认 CacheResolver 和 KeyGenerator 实现。换句话说，如果您已经在使用 Infra 缓存抽象，则可以切换到这些标准注解，而无需更改缓存存储（或配置）。

#### 功能摘要

对于熟悉 Infra 缓存注解的人员，下表描述了 Infra 注解与其 JSR-107 对应项之间的主要区别： JCache 具有 javax.cache.annotation.CacheResolver 的概念，它与 Infra CacheResolver 接口相同，只是 JCache 仅支持单个缓存。默认情况下，简单的实现根据注解上声明的名称检索要使用的缓存。应当注意，如果在注解上未指定缓存名称，则会自动生成默认名称。有关更多信息，请参阅 @CacheResult#cacheName() 的 javadoc。 CacheResolver 实例由 CacheResolverFactory 检索。可以为每个缓存操作自定义工厂，如下例所示：

```java
	@CacheResult(cacheNames="books", cacheResolverFactory=MyCacheResolverFactory.class) <1>
	public Book findBook(ISBN isbn)
```

## 插入不同的后端缓存

> 原文：[`integration/cache/plug`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cache/plug.adoc)

### 概述

显然，有很多缓存产品可以用作后备存储。对于那些不支持 JSR-107 的产品，您需要提供 CacheManager 和 Cache 实现。这听起来可能比实际上要难，因为在实践中，这些类往往是简单的 适配器，它们将缓存抽象框架映射到存储 API 之上，就像 Caffeine 类所做的那样。大多数 CacheManager 类可以使用 infra.cache.support 包中的类（例如 AbstractCacheManager，它负责样板代码，只留下实际映射需要完成）。

## 如何设置 TTL/TTI/驱逐策略/XXX 功能？

> 原文：[`integration/cache/specific-config`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cache/specific-config.adoc)

### 概述

直接通过您的缓存提供程序。缓存抽象是一个抽象，而不是缓存实现。您使用的解决方案可能支持其他解决方案不支持的各种数据策略和不同的拓扑结构（例如，JDK ConcurrentHashMap —— 在缓存抽象中公开它将是无用的，因为没有后备支持）。此类功能应直接通过后备缓存（配置时）或通过其本机 API 进行控制。

## 配置缓存存储

> 原文：[`integration/cache/store-configuration`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cache/store-configuration.adoc)

### 概述

缓存抽象提供了多种存储集成选项。要使用它们，您需要声明一个适当的 CacheManager（一个控制和管理 Cache 实例并可用于检索这些实例以进行存储的实体）。

#### 基于 JDK ConcurrentMap 的缓存

基于 JDK 的 Cache 实现位于 infra.cache.concurrent 包下。它允许您使用 ConcurrentHashMap 作为后备 Cache 存储。以下示例显示了如何配置两个缓存：

```xml
<!-- simple cache manager -->
<bean id="cacheManager" class="infra.cache.support.SimpleCacheManager">
  <property name="caches">
    <set>
      <bean class="infra.cache.concurrent.ConcurrentMapCacheFactoryBean" p:name="default"/>
      <bean class="infra.cache.concurrent.ConcurrentMapCacheFactoryBean" p:name="books"/>
    </set>
  </property>
</bean>
```

#### Caffeine 缓存

Caffeine 是 Guava 缓存的 Java 8 重写版，其实现位于 infra.cache.caffeine 包中，并提供了对 Caffeine 多个功能的访问。 以下示例配置了一个按需创建缓存的 CacheManager：

```xml
<bean id="cacheManager"
    class="infra.cache.caffeine.CaffeineCacheManager"/>
```

#### JSR-107 缓存

Infra 缓存抽象也可以使用符合 JSR-107 标准的缓存。JCache 实现位于 infra.cache.jcache 包中。 同样，要使用它，您需要声明适当的 CacheManager。 以下示例显示了如何执行此操作：

#### 处理没有后备存储的缓存

有时，在切换环境或进行测试时，您可能会在没有配置实际后备缓存的情况下进行缓存声明。由于这是一个无效的配置，因此在运行时会抛出异常，因为缓存基础设施无法找到合适的存储。在这种情况下，与其删除缓存声明（这可能很繁琐），不如连接一个简单的虚拟缓存，该缓存不执行任何缓存操作——即，它强制每次都调用缓存的方法。 以下示例显示了如何执行此操作：

## 理解缓存抽象

> 原文：[`integration/cache/strategies`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cache/strategies.adoc)

### 概述

术语“缓冲区”和“缓存”往往互换使用。但这请注意，它们代表不同的事物。传统上，缓冲区用作快速实体和慢速实体之间数据的中间临时存储。由于一方必须等待另一方（这会影响性能），缓冲区通过允许整个数据块一次移动而不是小块移动来缓解这种情况。数据仅从缓冲区写入和读取一次。此外，缓冲区对于至少一方是可见的。 另一方面，根据定义，缓存是隐藏的，任何一方都不知道发生了缓存。它也提高了性能，但是通过让相同的数据以快速的方式被多次读取来实现的。 您可以在此处找到有关缓冲区和缓存之间差异的进一步解释。 在其核心，缓存抽象将缓存应用于 Java 方法，从而根据缓存中可用的信息减少执行次数。也就是说，每次调用目标方法时，抽象都会应用一种缓存行为，检查是否已使用给定参数调用了该方法。如果已调用，则返回缓存的结果，而无需调用实际方法。如果该方法尚未被调用，则调用该方法，并将结果缓存并返回给用户，以便下次调用该方法时，返

## CDS

> 原文：[`integration/cds`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/cds.adoc)

### 概述

类数据共享 (CDS) 是一项 JVM 功能，可以帮助减少 Java 应用程序的启动时间和内存占用。 要使用此功能，应为应用程序的特定类路径创建一个 CDS 归档。TODAY Framework 提供了一个挂钩点，以简化归档的创建。一旦归档可用，用户应通过 JVM 标志选择使用它。

#### 创建 CDS 归档

可以在应用程序退出时创建应用程序的 CDS 归档。Infra Framework 提供了一种操作模式，其中进程可以在 ApplicationContext 刷新后自动退出。在此模式下，所有非延迟初始化的单例都已实例化，并且已调用 InitializingBean#afterPropertiesSet 回调；但生命周期尚未开始，并且尚未发布 ContextRefreshedEvent。 要创建归档，必须指定两个额外的 JVM 标志： 要创建 CDS 归档，您的 JDK 必须具有基本映像。如果您将上述标志添加到启动脚本中，您可能会收到如下警告：

```shell
  -XX:ArchiveClassesAtExit is unsupported when base CDS archive is not loaded. Run with -Xlog:cds for more info.
```

#### 使用归档

一旦归档可用，请将 -XX:SharedArchiveFile=application.jsa 添加到您的启动脚本以使用它，假设工作目录中有一个 application.jsa 文件。 要弄清楚缓存的有效性，您可以通过添加额外的属性来启用类加载日志：-Xlog:class+load:file=cds.log。这将创建一个 cds.log，其中包含加载类的每次尝试及其来源。从缓存加载的类应具有“共享对象文件”源，如以下示例所示：

```shell
  [0.064s][info][class,load] infra.core.env.EnvironmentCapable source: shared objects file (top)
  [0.064s][info][class,load] infra.beans.factory.BeanFactory source: shared objects file (top)
  [0.064s][info][class,load] infra.beans.factory.HierarchicalBeanFactory source: shared objects file (top)
  [0.065s][info][class,load] infra.context.MessageSource source: shared objects file (top)
```

## JVM 检查点恢复

> 原文：[`integration/checkpoint-restore`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/checkpoint-restore.adoc)

### 概述

TODAY Framework 与 Project CRaC 实现的检查点/恢复集成，以允许实现能够减少基于 Infra 的 Java 应用程序在 JVM 上的启动和预热时间的系统。 使用此功能需要： WARNING: 当请求检查点时，在 -XX:CRaCCheckpointTo=PATH 指定的路径中生成的文件包含正在运行的 JVM 的内存表示，其中可能包含机密和其他敏感数据。使用此功能时应假设 JVM“看到”的任何值（例如来自环境的配置属性）都将存储在这些 CRaC 文件中。因此，应仔细评估生成、存储和访问这些文件的位置和方式的安全性影响。 从概念上讲，检查点和恢复与单个 bean 的 Infra Lifecycle 契约 一致。

## 电子邮件

> 原文：[`integration/email`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/email.adoc)

### 概述

本节介绍如何使用 TODAY Framework 发送电子邮件。 为了使用 TODAY Framework 的电子邮件支持，您的应用程序的类路径中需要以下 JAR： 该库可以在网上免费获得——例如，在 Maven Central 中为 com.sun.mail:jakarta.mail。请确保使用最新的 2.x 版本（使用 jakarta.mail 包命名空间），而不是 Jakarta Mail 1.6.x（使用 javax.mail 包命名空间）。 TODAY Framework 提供了一个有用的实用程序库用于发送电子邮件，它使您免受底层邮件系统细节的影响，并负责代表客户端进行低级资源处理。 infra.mail 包是 Infra Framework 电子邮件支持的根级包。发送电子邮件的核心接口是 MailSender 接口。SimpleMailMessage 类是一个简单的值对象，封装

#### 用法

假设我们有一个名为 OrderManager 的业务接口，如下例所示：

```java
public interface OrderManager {

  void placeOrder(Order order);

}
```

##### 基本 MailSender 和 SimpleMailMessage 用法

以下示例显示了如何在有人下订单时使用 MailSender 和 SimpleMailMessage 发送电子邮件：

```java
import infra.mail.MailException;
import infra.mail.MailSender;
import infra.mail.SimpleMailMessage;

public class SimpleOrderManager implements OrderManager {

  private MailSender mailSender;
  private SimpleMailMessage templateMessage;

  public void setMailSender(MailSender mailSender) {
    this.mailSender = mailSender;
  }

  public void setTemplateMessage(SimpleMailMessage templateMessage) {
    this.templateMessage = templateMessage;
  }

  public void placeOrder(Order order) {

    // 进行业务计算...

    // 调用协作者以持久化订单...

    // 创建模板消息的线程安全“副本”并对其进行自定义
    SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
    msg.setTo(order.getCustomer().getEmailAddress());
    msg.setText(
      "Dear " + order.getCustomer().getFirstName()
        + order.getCustomer().getLastName()
        + ", thank you for placing order. Your order number is "
        + order.getOrderNumber());
    try {
      this.mailSender.send(msg);
    }
    catch (MailException ex) {
      // 简单地记录并继续...
      System.err.println(ex.getMessage());
    }
  }

}
```

##### 使用 JavaMailSender 和 MimeMessagePreparator

本节介绍了 OrderManager 的另一种实现，它使用 MimeMessagePreparator 回调接口。在以下示例中，mailSender 属性的类型为 JavaMailSender，以便我们可以使用 JavaMail MimeMessage 类：

#### 使用 JavaMail MimeMessageHelper

在处理 JavaMail 消息时，一个非常有用的类是 infra.mail.javamail.MimeMessageHelper，它可以使您免于使用冗长的 JavaMail API。使用 MimeMessageHelper，创建一个 MimeMessage 非常容易，如下例所示：

##### 附件

以下示例向您展示了如何使用 MimeMessageHelper 发送带有单个 JPEG 图像附件的电子邮件：

##### 内联资源

以下示例向您展示了如何使用 MimeMessageHelper 发送带有内联图像的电子邮件：

## JMX

> 原文：[`integration/jmx`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/jmx.adoc)

### 概述

Infra 中的 JMX (Java Management Extensions) 支持提供的功能使您可以轻松透明地将 Infra 应用程序集成到 JMX 基础设施中。 本章不是 JMX 的介绍。它并不试图解释您为什么要使用 JMX。如果您是 JMX 的新手，请参阅本章末尾的 更多资源。 具体来说，Infra JMX 支持提供四个核心功能： 这些功能旨在无需将您的应用程序组件耦合到 Infra 或 JMX 接口和类即可工作。实际上，在大多数情况下，您的应用程序类无需知道 Infra 或 JMX 即可利用 Infra JMX 功能。

## 将您的 Bean 导出到 JMX

> 原文：[`integration/jmx/exporting`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/jmx/exporting.adoc)

### 概述

Infra JMX 框架中的核心类是 MBeanExporter。该类负责获取您的 Infra Bean 并将它们注册到 JMX MBeanServer。例如，考虑以下类：

```java
package infra.jmx;

public class JmxTestBean implements IJmxTestBean {

  private String name;
  private int age;
  private boolean isSuperman;

  public int getAge() {
    return age;
  }

  public void setAge(int age) {
    this.age = age;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public int add(int x, int y) {
    return x + y;
  }

  public void dontExposeMe() {
    throw new RuntimeException();
  }
}
```

#### 创建 MBeanServer

上一节 中显示的配置假设应用程序运行在一个已经运行了一个（且只有一个）MBeanServer 的环境中。在这种情况下，Infra 尝试定位正在运行的 MBeanServer 并将您的 Bean 注册到该服务器（如果有）。当您的应用程序在具有自己的 MBeanServer 的容器（如 Tomcat 或 IBM WebSphere）内运行时，此行为非常有用。 但是，这种方法在独立环境中或在不提供 MBeanServer 的容器内运行时毫无用处。为了解决这个问题，您可以通过将 infra.jmx.support.MBeanServerFactoryBean 类的实例添加到您的配置中来声明性地创建 MBeanServer 实例。您还可以通过将 MBeanExporter 实例的 server 属性的值设置为 MBeanServerFactoryBean 返回的 MBeanServer 值来确保使用

```xml
<beans>

  <bean id="mbeanServer" class="infra.jmx.support.MBeanServerFactoryBean"/>

  <!--
  此 bean 需要急切地预实例化才能进行导出；
  这意味着它不得标记为延迟初始化
  -->
  <bean id="exporter" class="infra.jmx.export.MBeanExporter">
    <property name="beans">
      <map>
        <entry key="bean:name=testBean1" value-ref="testBean"/>
      </map>
    </property>
    <property name="server" ref="mbeanServer"/>
  </bean>

  <bean id="testBean" class="infra.jmx.JmxTestBean">
    <property name="name" value="TEST"/>
    <property name="age" value="100"/>
  </bean>

</beans>
```

#### 重用现有的 MBeanServer

如果未指定服务器，MBeanExporter 会尝试自动检测正在运行的 MBeanServer。这在大多数环境中都有效，其中仅使用一个 MBeanServer 实例。但是，当存在多个实例时，导出器可能会选择错误的服务器。在这种情况下，您应该使用 MBeanServer agentId 来指示要使用哪个实例，如下例所示：

#### MBean 的自动注册

通过 MBeanExporter 导出且已经是有效 MBean 的任何 Bean 都将按原样注册到 MBeanServer，而无需 Infra 的进一步干预。您可以通过将 autodetect 属性设置为 true 来使 MBeanExporter 自动检测 MBean，如下例所示：

#### 控制注册行为

考虑这样一个场景：Infra MBeanExporter 尝试使用 ObjectName bean:name=testBean1 向 MBeanServer 注册 MBean。如果已经使用相同的 ObjectName 注册了 MBean 实例，则默认行为是失败（并抛出 InstanceAlreadyExistsException）。 您可以精确控制当 MBean 向 MBeanServer 注册时发生的情况。Infra JMX 支持允许三种不同的注册行为，以控制当注册过程发现 MBean 已在相同的 ObjectName 下注册时的注册行为。下表总结了这些注册行为： 上表中的值在 RegistrationPolicy 类上定义为枚举。如果要更改默认注册行为，则需要将 MBeanExporter 定义上的 registrationPolicy 属性的值设置为这些值之一。 以下示例显示了如何从

## 控制 Bean 的管理接口

> 原文：[`integration/jmx/interface`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/jmx/interface.adoc)

### 概述

在 上一节 的示例中，您对 Bean 的管理接口几乎没有控制权。每个导出的 Bean 的所有 public 属性和方法都分别作为 JMX 属性和操作公开。为了对导出的 Bean 的哪些属性和方法实际上作为 JMX 属性和操作公开进行更细粒度的控制，Infra JMX 提供了一种全面且可扩展的机制来控制 Bean 的管理接口。

#### 使用源代码级元数据：Java 注解

通过使用 MetadataMBeanInfoAssembler，您可以使用源代码级元数据定义 Bean 的管理接口。元数据的读取由 infra.jmx.export.metadata.JmxAttributeSource 接口封装。Infra JMX 提供了一个使用 Java 注解的默认实现，即 infra.jmx.export.annotation.AnnotationJmxAttributeSource。您必须使用 JmxAttributeSource 接口的实现实例配置 MetadataMBeanInfoAssembler 才能使其正常工作（没有默认值）。 要将 Bean 标记为导出到 JMX，您应该使用 ManagedResource 注解来注解 Bean 类。您必须使用 ManagedOperation 注解标记要公开为操作的每个方法，并使用 ManagedAttribute 注

```java
package infra.jmx;

import infra.jmx.export.annotation.ManagedResource;
import infra.jmx.export.annotation.ManagedOperation;
import infra.jmx.export.annotation.ManagedAttribute;

@ManagedResource(
    objectName="bean:name=testBean4",
    description="My Managed Bean",
    log=true,
    logFile="jmx.log",
    currencyTimeLimit=15,
    persistPolicy="OnUpdate",
    persistPeriod=200,
    persistLocation="foo",
    persistName="bar")
public class AnnotationTestBean implements IJmxTestBean {

  private String name;
  private int age;

  @ManagedAttribute(description="The Age Attribute", currencyTimeLimit=15)
  public int getAge() {
    return age;
  }

  public void setAge(int age) {
    this.age = age;
  }

  @ManagedAttribute(description="The Name Attribute",
      currencyTimeLimit=20,
      defaultValue="bar",
      persistPolicy="OnUpdate")
  public void setName(String name) {
    this.name = name;
  }

  @ManagedAttribute(defaultValue="foo", persistPeriod=300)
  public String getName() {
    return name;
  }

  @ManagedOperation(description="Add two numbers")
  @ManagedOperationParameters({
    @ManagedOperationParameter(name = "x", description = "The first number"),
    @ManagedOperationParameter(name = "y", description = "The second number")})
  public int add(int x, int y) {
    return x + y;
  }

  public void dontExposeMe() {
    throw new RuntimeException();
  }

// ... 省略，完整示例见原文
```

#### 使用 AutodetectCapableMBeanInfoAssembler 接口

为了进一步简化配置，Infra 包含了 AutodetectCapableMBeanInfoAssembler 接口，该接口扩展了 MBeanInfoAssembler 接口以添加对 MBean 资源自动检测的支持。如果您使用 AutodetectCapableMBeanInfoAssembler 的实例配置 MBeanExporter，则允许它对包含要向 JMX 公开的 Bean 进行“投票”。 AutodetectCapableMBeanInfo 接口的唯一实现是 MetadataMBeanInfoAssembler，它投票包含标记有 ManagedResource 属性的任何 Bean。这种情况下的默认方法是使用 Bean 名称作为 ObjectName，这会导致类似于以下的配置：

```xml
<beans>

  <bean id="exporter" class="infra.jmx.export.MBeanExporter">
    <!-- 注意这里没有明确配置 'beans' -->
    <property name="autodetect" value="true"/>
    <property name="assembler" ref="assembler"/>
  </bean>

  <bean id="testBean" class="infra.jmx.JmxTestBean">
    <property name="name" value="TEST"/>
    <property name="age" value="100"/>
  </bean>

  <bean id="assembler" class="infra.jmx.export.assembler.MetadataMBeanInfoAssembler">
    <property name="attributeSource">
      <bean class="infra.jmx.export.annotation.AnnotationJmxAttributeSource"/>
    </property>
  </bean>

</beans>
```

#### 使用 Java 接口定义管理接口

除了 MetadataMBeanInfoAssembler 之外，Infra 还包括 InterfaceBasedMBeanInfoAssembler，它允许您根据一组接口中定义的方法集来约束公开的方法和属性。 尽管公开 MBean 的标准机制是使用接口和简单的命名方案，但 InterfaceBasedMBeanInfoAssembler 通过消除命名约定的需要、允许您使用多个接口以及消除 Bean 实现 MBean 接口的需要来扩展此功能。 考虑以下接口，该接口用于定义我们前面显示的 JmxTestBean 类的管理接口：

#### 使用 MethodNameBasedMBeanInfoAssembler

MethodNameBasedMBeanInfoAssembler 允许您指定作为属性和操作公开给 JMX 的方法名称列表。以下代码显示了一个示例配置：

## 使用 JSR-160 连接器

> 原文：[`integration/jmx/jsr160`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/jmx/jsr160.adoc)

### 概述

对于远程访问，Infra JMX 模块在 infra.jmx.support 包中提供了两个 FactoryBean 实现，用于创建服务器端和客户端连接器。

#### 服务器端连接器

要让 Infra JMX 创建、启动并公开 JSR-160 JMXConnectorServer，可以使用以下配置：

```xml
	<bean id="serverConnector" class="infra.jmx.support.ConnectorServerFactoryBean"/>
```

#### 客户端连接器

要创建到远程启用 JSR-160 的 MBeanServer 的 MBeanServerConnection，可以使用 MBeanServerConnectionFactoryBean，如下例所示：

```xml
<bean id="clientConnector" class="infra.jmx.support.MBeanServerConnectionFactoryBean">
  <property name="serviceUrl" value="service:jmx:rmi://localhost/jndi/rmi://localhost:1099/jmxrmi"/>
</bean>
```

#### 基于 Hessian 或 SOAP 的 JMX

JSR-160 允许扩展客户端和服务器之间的通信方式。前面部分中显示的示例使用了 JSR-160 规范（IIOP 和 JRMP）和（可选）JMXMP 要求的强制性基于 RMI 的实现。通过使用其他提供程序或 JMX 实现（例如 MX4J），您可以利用诸如 SOAP 或 Hessian 之类的协议通过简单的 HTTP 或 SSL 等，如下例所示：

## 控制 Bean 的 ObjectName 实例

> 原文：[`integration/jmx/naming`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/jmx/naming.adoc)

### 概述

在幕后，MBeanExporter 委托给 ObjectNamingStrategy 的实现，为它注册的每个 bean 获取 ObjectName 实例。默认情况下，默认实现 KeyNamingStrategy 使用 beans Map 的键作为 ObjectName。此外，KeyNamingStrategy 可以将 beans Map 的键映射到 Properties 文件（或多个文件）中的条目，以解析 ObjectName。除了 KeyNamingStrategy 之外，Infra 还提供了另外两个 ObjectNamingStrategy 实现：IdentityNamingStrategy（基于 bean 的 JVM 标识构建 ObjectName）和 MetadataNamingStrategy（使用源代码级元数据获取 ObjectName）。

#### 从属性中读取 ObjectName 实例

您可以配置自己的 KeyNamingStrategy 实例，并将其配置为从 Properties 实例而不是使用 bean 键读取 ObjectName 实例。KeyNamingStrategy 尝试使用与 bean 键对应的键在 Properties 中定位条目。如果未找到条目或 Properties 实例为 null，则使用 bean 键本身。 以下代码显示了 KeyNamingStrategy 的示例配置：

```xml
<beans>

  <bean id="exporter" class="infra.jmx.export.MBeanExporter">
    <property name="beans">
      <map>
        <entry key="testBean" value-ref="testBean"/>
      </map>
    </property>
    <property name="namingStrategy" ref="namingStrategy"/>
  </bean>

  <bean id="testBean" class="infra.jmx.JmxTestBean">
    <property name="name" value="TEST"/>
    <property name="age" value="100"/>
  </bean>

  <bean id="namingStrategy" class="infra.jmx.export.naming.KeyNamingStrategy">
    <property name="mappings">
      <props>
        <prop key="testBean">bean:name=testBean1</prop>
      </props>
    </property>
    <property name="mappingLocations">
      <value>names1.properties,names2.properties</value>
    </property>
  </bean>

</beans>
```

#### 使用 MetadataNamingStrategy

MetadataNamingStrategy 使用每个 bean 上 ManagedResource 属性的 objectName 属性来创建 ObjectName。以下代码显示了 MetadataNamingStrategy 的配置：

```xml
<beans>

  <bean id="exporter" class="infra.jmx.export.MBeanExporter">
    <property name="beans">
      <map>
        <entry key="testBean" value-ref="testBean"/>
      </map>
    </property>
    <property name="namingStrategy" ref="namingStrategy"/>
  </bean>

  <bean id="testBean" class="infra.jmx.JmxTestBean">
    <property name="name" value="TEST"/>
    <property name="age" value="100"/>
  </bean>

  <bean id="namingStrategy" class="infra.jmx.export.naming.MetadataNamingStrategy">
    <property name="attributeSource" ref="attributeSource"/>
  </bean>

  <bean id="attributeSource"
      class="infra.jmx.export.annotation.AnnotationJmxAttributeSource"/>

</beans>
```

#### 配置基于注解的 MBean 导出

如果您更喜欢使用 基于注解的方法 来定义管理接口，则可以使用 MBeanExporter 的一个便捷子类：AnnotationMBeanExporter。定义此子类的实例时，您不再需要 namingStrategy、assembler 和 attributeSource 配置，因为它始终使用标准 Java 基于注解的元数据（自动检测也始终启用）。实际上，与其定义 MBeanExporter bean，不如使用 @EnableMBeanExport @Configuration 注解支持的更简单的语法，如下例所示：

## 通知

> 原文：[`integration/jmx/notifications`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/jmx/notifications.adoc)

### 概述

Infra JMX 产品包括对 JMX 通知的全面支持。

#### 注册通知监听器

Infra JMX 支持使得向任意数量的 MBean 注册任意数量的 NotificationListeners 变得容易（这包括由 Infra MBeanExporter 导出的 MBean 和通过其他机制注册的 MBean）。例如，考虑这样一个场景：每当目标 MBean 的属性发生更改时，都希望得到通知（通过 Notification）。以下示例将通知写入控制台：

```java
package com.example;

import javax.management.AttributeChangeNotification;
import javax.management.Notification;
import javax.management.NotificationFilter;
import javax.management.NotificationListener;

public class ConsoleLoggingNotificationListener
    implements NotificationListener, NotificationFilter {

  public void handleNotification(Notification notification, Object handback) {
    System.out.println(notification);
    System.out.println(handback);
  }

  public boolean isNotificationEnabled(Notification notification) {
      return (notification instanceof AttributeChangeNotification);
  }

}
```

#### 发布通知

Infra 不仅支持注册接收 Notifications，还支持发布 Notifications。 NOTE: 本节实际上仅与已通过 MBeanExporter 公开为 MBean 的 Infra 托管 Bean 相关。任何现有的用户定义的 MBean 都应使用标准 JMX API 进行通知发布。 Infra JMX 通知发布支持的关键接口是 NotificationPublisher 接口（定义在 infra.jmx.export.notification 包中）。任何将通过 MBeanExporter 实例导出为 MBean 的 Bean 都可以实现相关的 NotificationPublisherAware 接口，以获得对 NotificationPublisher 实例的访问权限。NotificationPublisherAware 接口通过一个简单的 setter 方法向实现 B

```java
package infra.jmx;

import infra.jmx.export.notification.NotificationPublisherAware;
import infra.jmx.export.notification.NotificationPublisher;
import javax.management.Notification;

public class JmxTestBean implements IJmxTestBean, NotificationPublisherAware {

  private String name;
  private int age;
  private boolean isSuperman;
  private NotificationPublisher publisher;

  // 为清晰起见省略了其他 getter 和 setter

  public int add(int x, int y) {
    int answer = x + y;
    this.publisher.sendNotification(new Notification("add", this, 0));
    return answer;
  }

  public void dontExposeMe() {
    throw new RuntimeException();
  }

  public void setNotificationPublisher(NotificationPublisher notificationPublisher) {
    this.publisher = notificationPublisher;
  }

}
```

## 通过代理访问 MBean

> 原文：[`integration/jmx/proxy`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/jmx/proxy.adoc)

### 概述

Infra JMX 允许您创建代理，将调用重新路由到在本地或远程 MBeanServer 中注册的 MBean。这些代理为您提供了一个标准的 Java 接口，通过该接口您可以与 MBean 进行交互。以下代码显示了如何为在本地 MBeanServer 中运行的 MBean 配置代理：

```xml
<bean id="proxy" class="infra.jmx.access.MBeanProxyFactoryBean">
  <property name="objectName" value="bean:name=testBean"/>
  <property name="proxyInterface" value="infra.jmx.IJmxTestBean"/>
</bean>
```

## 更多资源

> 原文：[`integration/jmx/resources`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/jmx/resources.adoc)

### 概述

本节包含有关 JMX 的更多资源的链接：

## REST 客户端

> 原文：[`integration/rest-clients`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/rest-clients.adoc)

### 概述

TODAY Framework 提供了以下选项来调用 REST 端点：

##### 创建 RestClient

RestClient 是使用静态 create 方法之一创建的。 您还可以使用 builder() 获取具有更多选项的构建器，例如指定要使用的 HTTP 库（请参阅 <<rest-request-factories>>）和要使用的消息转换器（请参阅 <<rest-message-conversion>>），设置默认 URI、默认路径变量、默认请求头或 uriBuilderFactory，或注册拦截器和初始化器。 一旦创建（或构建），RestClient 就可以安全地供多个线程使用。 以下示例显示了如何创建默认的 RestClient，以及如何构建自定义的 RestClient。

```java
RestClient defaultClient = RestClient.create();

RestClient customClient = RestClient.builder()
  .requestFactory(new HttpComponentsClientHttpRequestFactory())
  .configureMessageConverters(converters -> converters.addCustomConverter(new MyCustomMessageConverter()))
  .baseUrl("https://example.com")
  .defaultUriVariables(Map.of("variable", "foo"))
  .defaultHeader("My-Header", "Foo")
  .defaultCookie("My-Cookie", "Bar")
  .defaultApiVersion("1.2")
  .apiVersionInserter(ApiVersionInserter.useHeader("API-Version"))
  .requestInterceptor(myCustomInterceptor)
  .requestInitializer(myCustomInitializer)
  .build();
```

##### 检索响应

设置请求后，通过调用 retrieve() 访问 HTTP 响应。 可以使用 body(Class) 或 body(ParameterizedTypeReference)（对于列表等参数化类型）访问响应正文。 body 方法将响应内容转换为各种类型——例如，字节可以转换为 String，JSON 可以使用 Jackson 转换为对象，依此类推（请参阅 <<rest-message-conversion>>）。 响应也可以转换为 ResponseEntity，从而可以访问响应头和正文。 此示例显示了如何使用 RestClient 执行简单的 GET 请求。

```java
String result = restClient.get() <1>
  .uri("https://example.com") <2>
  .retrieve() <3>
  .body(String.class); <4>

System.out.println(result); <5>
```

##### 错误处理

默认情况下，RestClient 在检索具有 4xx 或 5xx 状态代码的响应时会抛出 RestClientException 的子类。 可以使用 onStatus 覆盖此行为。

##### Exchange

对于更高级的场景，RestClient 通过 exchange() 方法提供对底层 HTTP 请求和响应的访问，该方法可用于代替 retrieve()。 使用 exchange() 时不应用状态处理程序，因为 exchange 函数已经提供了对完整响应的访问，允许您执行任何必要的错误处理。

##### Jackson JSON 视图

要仅序列化对象属性的子集，可以指定 Jackson JSON 视图，如下例所示：

##### Multipart

要发送多部分数据，您需要提供一个 MultiValueMap<String, Object>，其值可以是部分内容的对象、文件部分的 Resource 或具有头的部分内容的 HttpEntity。 例如：

#### HTTP 接口

TODAY Framework 允许您将 HTTP 服务定义为具有 @HttpExchange 方法的 Java 接口。 您可以将此类接口传递给 HttpServiceProxyFactory 以创建代理，该代理通过 HTTP 客户端（如 RestClient 或 WebClient）执行请求。 您还可以从 @Controller 实现该接口以进行服务器请求处理。 首先创建带有 @HttpExchange 方法的接口：

##### 错误处理

要自定义错误响应处理，您需要配置底层 HTTP 客户端。 对于 RestClient: 默认情况下，RestClient 对 4xx 和 5xx HTTP 状态代码引发 RestClientException。 要自定义此行为，请注册适用于通过客户端执行的所有响应的响应状态处理程序：

## 任务执行与调度

> 原文：[`integration/scheduling`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/integration/scheduling.adoc)

### 概述

TODAY Framework 分别通过 TaskExecutor 和 TaskScheduler 接口提供了用于异步执行和任务调度的抽象。 Infra 还提供了这些接口的实现，这些实现支持线程池或在应用服务器环境中委托给 CommonJ。 最终，在通用接口背后使用这些实现，屏蔽了 Java SE 和 Jakarta EE 环境之间的差异。

##### 使用 TaskExecutor

Infra 的 TaskExecutor 实现通常与依赖注入一起使用。 在以下示例中，我们定义了一个使用 ThreadPoolTaskExecutor 异步打印一组消息的 bean：

```java
import infra.core.task.TaskExecutor;

public class TaskExecutorExample {

  private class MessagePrinterTask implements Runnable {

    private String message;

    public MessagePrinterTask(String message) {
      this.message = message;
    }

    public void run() {
      System.out.println(message);
    }
  }

  private TaskExecutor taskExecutor;

  public TaskExecutorExample(TaskExecutor taskExecutor) {
    this.taskExecutor = taskExecutor;
  }

  public void printMessages() {
    for(int i = 0; i < 25; i++) {
      taskExecutor.execute(new MessagePrinterTask("Message" + i));
    }
  }
}
```

#### Infra TaskScheduler 抽象

除了 TaskExecutor 抽象之外，Infra 还有一个 TaskScheduler SPI，其中包含各种用于调度任务在未来某个时间点运行的方法。 以下清单显示了 TaskScheduler 接口定义：

```java
public interface TaskScheduler {

  Clock getClock();

  ScheduledFuture schedule(Runnable task, Trigger trigger);

  ScheduledFuture schedule(Runnable task, Instant startTime);

  ScheduledFuture scheduleAtFixedRate(Runnable task, Instant startTime, Duration period);

  ScheduledFuture scheduleAtFixedRate(Runnable task, Duration period);

  ScheduledFuture scheduleWithFixedDelay(Runnable task, Instant startTime, Duration delay);

  ScheduledFuture scheduleWithFixedDelay(Runnable task, Duration delay);

}
```

##### Trigger 接口

Trigger 接口本质上受 JSR-236 启发。 Trigger 的基本思想是，执行时间可以根据过去的执行结果甚至任意条件来确定。 如果这些决定考虑了前一次执行的结果，则该信息在 TriggerContext 中可用。 Trigger 接口本身非常简单，如下清单所示：

##### 启用调度注解

要启用对 @Scheduled 和 @Async 注解的支持，您可以将 @EnableScheduling 和 @EnableAsync 添加到您的一个 @Configuration 类中，如下例所示：

##### @Scheduled 注解

您可以将 @Scheduled 注解连同触发器元数据一起添加到方法中。 例如，以下方法每五秒（5000 毫秒）以固定延迟调用一次，这意味着周期是从每个前次调用的完成时间开始测量的。

##### 响应式方法或 Kotlin 挂起函数上的 @Scheduled 注解

从 TODAY Framework 6.1 开始，几种类型的响应式方法也支持 @Scheduled 方法：

##### @Async 注解

您可以在方法上提供 @Async 注解，以便异步调用该方法。 换句话说，调用者在调用时立即返回，而方法的实际执行发生在已提交给 Infra TaskExecutor 的任务中。 在最简单的情况下，您可以将注解应用于返回 void 的方法，如下例所示：

##### 使用 @Async 限定执行器

默认情况下，在方法上指定 @Async 时，使用的执行器是 启用异步支持时配置的 那个， 即如果您使用 XML 则是“annotation-driven”元素，或者您的 AsyncConfigurer 实现（如果有）。 但是，当您需要指示在执行给定方法时应使用除默认执行器之外的执行器时，可以使用 @Async 注解的 value 属性。 以下示例显示了如何执行此操作：

##### 使用 @Async 进行异常管理

当 @Async 方法具有 Future 类型的返回值时，很容易管理在方法执行期间抛出的异常，因为此异常在对 Future 结果调用 get 时抛出。 但是，对于 void 返回类型，异常是未捕获的且无法传输。您可以提供 AsyncUncaughtExceptionHandler 来处理此类异常。 以下示例显示了如何执行此操作：

##### 'scheduler' 元素

以下元素创建一个具有指定线程池大小的 ThreadPoolTaskScheduler 实例：

##### executor 元素

以下内容创建一个 ThreadPoolTaskExecutor 实例：

##### 'scheduled-tasks' 元素

Infra 任务命名空间最强大的功能是支持配置要在 Infra 应用程序上下文中调度的任务。 这遵循类似于 Infra 中其他“method-invokers”的方法，例如 JMS 命名空间提供的用于配置消息驱动 POJO 的方法。 基本上，ref 属性可以指向任何 Infra 管理的对象，method 属性提供要在该对象上调用的方法的名称。 以下清单显示了一个简单的示例：

##### 使用 JobDetailFactoryBean

Quartz JobDetail 对象包含运行作业所需的所有信息。 Infra 提供了一个 JobDetailFactoryBean，它为 XML 配置目的提供了 bean 风格的属性。 考虑以下示例：

##### 使用 MethodInvokingJobDetailFactoryBean

通常，您只需要在特定对象上调用一个方法。 通过使用 MethodInvokingJobDetailFactoryBean，您可以完全做到这一点，如下例所示：

##### 使用触发器和 SchedulerFactoryBean 连接作业

我们已经创建了作业详细信息和作业。我们还回顾了允许您在特定对象上调用方法的便捷 bean。 当然，我们仍然需要调度作业本身。这是通过使用触发器和 SchedulerFactoryBean 完成的。 Quartz 中有多种触发器可用，Infra 提供了两个具有便捷默认值的 Quartz FactoryBean 实现：CronTriggerFactoryBean 和 SimpleTriggerFactoryBean。 触发器需要被调度。Infra 提供了一个 SchedulerFactoryBean，它公开了要设置为属性的触发器。 SchedulerFactoryBean 使用这些触发器调度实际作业。 以下清单同时使用了 SimpleTriggerFactoryBean 和 CronTriggerFactoryBean： 前面的示例设置了两个触发器，一个每 50 秒运行一次，启动延迟为 10 

## 语言支持

> 原文：[`languages`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/languages.adoc)

### 概述

## 动态语言支持

> 原文：[`languages/dynamic`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/languages/dynamic.adoc)

### 概述

Infra 为使用由动态语言（如 Groovy）定义的类和对象提供了全面的支持。 这种支持使您能够用受支持的动态语言编写任意数量的类，并让 Infra 容器透明地实例化、配置和依赖注入生成的对象。 Infra 脚本支持主要针对 Groovy 和 BeanShell。除了这些特定支持的语言外，JSR-223 脚本机制也被支持， 用于与任何支持 JSR-223 的语言提供者集成，例如 JRuby。 您可以在 场景 中找到这种动态语言支持可以立即发挥作用的完整工作示例。

#### 第一个示例

本章的大部分内容都在详细描述动态语言支持。在深入研究动态语言支持的所有细节之前，我们先看一个用动态语言定义的 bean 的快速示例。 这个第一个 bean 的动态语言是 Groovy。（此示例的基础取自 Infra 测试套件。如果您想查看其他任何受支持语言的等效示例，请查看源代码）。 下一个示例显示了 Messenger 接口，Groovy bean 将实现该接口。请注意，此接口是用纯 Java 定义的。 被注入了对 Messenger 引用的依赖对象并不知道底层实现是一个 Groovy 脚本。以下清单显示了 Messenger 接口：

```java
package infra.scripting;

public interface Messenger {

  String getMessage();
}
```

##### 可刷新 Bean

Infra 中动态语言支持的最引人注目的增值之一（也许是唯一的）是“可刷新 bean”功能。 可刷新 bean 是一个由动态语言支持的 bean。通过少量的配置，由动态语言支持的 bean 可以监视其底层源文件资源的更改， 并在动态语言源文件更改时（例如，当您在文件系统上编辑并保存对文件的更改时）重新加载自身。 这使您可以将任意数量的动态语言源文件部署为应用程序的一部分，配置 Infra 容器以创建由动态语言源文件支持的 bean（使用本章描述的机制）， 并且（稍后，随着需求的变化或某些其他外部因素的介入）编辑动态语言源文件，并使其所做的任何更改反映在由更改后的动态语言源文件支持的 bean 中。 无需关闭正在运行的应用程序（或在 Web 应用程序的情况下重新部署）。经如此修改的由动态语言支持的 bean 会从更改后的动态语言源文件中获取新的状态和逻辑。 NOTE: 此功能默认是关闭的。 

```xml
<beans>

  <!-- 由于存在 'refresh-check-delay' 属性，此 bean 现在是 '可刷新' 的 -->
  <lang:groovy id="messenger"
      refresh-check-delay="5000" <!-- 开启刷新，检查间隔为 5 秒 -->
      script-source="classpath:Messenger.groovy">
    <lang:property name="message" value="I Can Do The Frug" />
  </lang:groovy>

  <bean id="bookingService" class="x.y.DefaultBookingService">
    <property name="messenger" ref="messenger" />
  </bean>

</beans>
```

##### 内联动态语言源文件

动态语言支持还可以满足直接嵌入在 Infra bean 定义中的动态语言源文件的需求。更具体地说，<lang:inline-script/> 元素允许您直接在 Infra 配置文件中定义动态语言源代码。 一个例子可能会阐明内联脚本功能的工作原理：

##### 理解动态语言支持 Bean 上下文中的构造函数注入

关于 Infra 动态语言支持，有一件非常重要的事情需要注意。即，您（目前）不能为由动态语言支持的 bean 提供构造函数参数（因此，构造函数注入不可用于由动态语言支持的 bean）。 为了使这种对构造函数和属性的特殊处理 100% 清楚，以下代码和配置的混合是行不通的：

##### Groovy Beans

本节描述如何在 Infra 中使用用 Groovy 定义的 bean。 Groovy 主页包含以下描述： “Groovy 是一种用于 Java 2 平台的敏捷动态语言，它具有 Python、Ruby 和 Smalltalk 等语言中人们非常喜欢的许多特性，使其可供使用类似 Java 语法的 Java 开发人员使用。” 如果您从头阅读本章，您已经 看过一个示例 的 Groovy 动态语言支持的 bean。 现在考虑另一个示例（再次使用来自 Infra 测试套件的示例）：

##### 使用回调自定义 Groovy 对象

GroovyObjectCustomizer 接口是一个回调，允许您将额外的创建逻辑挂钩到创建 Groovy 支持的 bean 的过程中。 例如，此接口的实现可以调用任何所需的初始化方法，设置一些默认属性值，或指定自定义 MetaClass。 以下清单显示了 GroovyObjectCustomizer 接口定义：

##### BeanShell Beans

本节描述如何在 Infra 中使用 BeanShell bean。 BeanShell 主页 包含以下描述： BeanShell 是一个小型、免费、可嵌入的 Java 源代码解释器，具有动态语言特性，用 Java 编写。 BeanShell 动态运行标准 Java 语法，并使用常见的脚本便利扩展它，如松散类型、命令和像 Perl 和 JavaScript 中的方法闭包。 与 Groovy 相比，BeanShell 支持的 bean 定义需要一些（小的）额外配置。Infra 中 BeanShell 动态语言支持的实现很有趣， 因为 Infra 创建了一个 JDK 动态代理，该代理实现了 <lang:bsh> 元素的 script-interfaces 属性值中指定的所有接口 （这就是为什么您必须在属性值中至少提供一个接口，并且因此在使用 BeanShell 支持的 bean 时面向接口编程）

##### 脚本化 Web MVC 控制器

一类可以从使用由动态语言支持的 bean 中受益的类是 Web MVC 控制器。在纯 Web MVC 应用程序中，通过 Web 应用程序的导航流在很大程度上由封装在 Web MVC 控制器中的代码决定。 随着 Web 应用程序的导航流和其他表示层逻辑需要更新以响应支持问题或不断变化的业务需求，通过编辑一个或多个动态语言源文件并看到这些更改立即反映在正在运行的应用程序的状态中，可能会更容易实现任何此类所需的更改。 请记住，在 Infra 等项目支持的轻量级架构模型中，您通常旨在拥有一个非常薄的表示层，应用程序的所有实质性业务逻辑都包含在领域和服务层类中。 将 Web MVC 控制器开发为由动态语言支持的 bean 允许您通过编辑和保存文本文件来更改表示层逻辑。 对这些动态语言源文件的任何更改（取决于配置）都会自动反映在由动态语言源文件支持的 bean 中。 NOTE: 要实现对由动态语言支持

##### 脚本化验证器

使用 Infra 进行应用程序开发的另一个可能受益于由动态语言支持的 bean 提供的灵活性的领域是验证。 使用松散类型的动态语言（可能还支持内联正则表达式）表达复杂的验证逻辑可能比使用常规 Java 更容易。 同样，将验证器开发为由动态语言支持的 bean 允许您通过编辑和保存简单的文本文件来更改验证逻辑。 任何此类更改（取决于配置）都会自动反映在正在运行的应用程序的执行中，而无需重新启动应用程序。 NOTE: 要实现对由动态语言支持的 bean 的任何更改的自动“提取”，您必须启用“可刷新 bean”功能。 有关此功能的完整和详细处理，请参阅 可刷新 Bean。 以下示例显示了使用 Groovy 动态语言实现的 Infra infra.validation.Validator（有关 Validator 接口的讨论， 请参阅 使用 Infra 的 Validator 接口进行验证）：

##### 作用域

如果这不明显，脚本化 bean 可以像任何其他 bean 一样确定作用域。各种 <lang:language/> 元素上的 scope 属性允许您控制底层脚本化 bean 的作用域， 就像它对常规 bean 所做的那样。（默认作用域是 单例，就像“常规”bean 一样。） 以下示例使用 scope 属性将 Groovy bean 定义为 原型 作用域：

##### lang XML schema

Infra XML 配置中的 lang 元素用于将以动态语言（如 Groovy 或 BeanShell）编写的对象作为 bean 暴露在 Infra 容器中。 这些元素（以及动态语言支持）在 动态语言支持 中有全面介绍。请参阅该部分以获取有关此支持和 lang 元素的完整详细信息。 要使用 lang schema 中的元素，您需要在 Infra XML 配置文件顶部包含以下序言。以下代码段中的文本引用了正确的 schema，以便 lang 命名空间中的标签可供您使用：

## Apache Groovy

> 原文：[`languages/groovy`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/languages/groovy.adoc)

### 概述

Groovy 是一种强大的、可选类型的动态语言，具有静态类型和静态编译能力。它提供了简洁的语法，并能与任何现有的 Java 应用程序顺利集成。 有关 Groovy 的更多支持，包括用 Groovy 编写的 bean、可刷新的脚本 bean 等，请参阅 动态语言支持。

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
