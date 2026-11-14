# TestContext 测试框架

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

@InfraTest、上下文加载与缓存、属性源、事务测试、测试注解。

覆盖文档：58 页（含示例 40 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- 注解 —— `testing/annotations`
- Infra 测试注解 —— `testing/annotations/integration-infra`
- **@ActiveProfiles** —— `testing/annotations/integration-infra/annotation-activeprofiles`
- **@AfterTransaction** —— `testing/annotations/integration-infra/annotation-aftertransaction`
- **测试中的 Bean 覆盖** —— `testing/annotations/integration-infra/annotation-beanoverriding`
- **@BeforeTransaction** —— `testing/annotations/integration-infra/annotation-beforetransaction`
- @BootstrapWith —— `testing/annotations/integration-infra/annotation-bootstrapwith`
- **@Commit** —— `testing/annotations/integration-infra/annotation-commit`
- **@ContextConfiguration** —— `testing/annotations/integration-infra/annotation-contextconfiguration`
- **@ContextCustomizerFactories** —— `testing/annotations/integration-infra/annotation-contextcustomizerfactories`
- **@ContextHierarchy** —— `testing/annotations/integration-infra/annotation-contexthierarchy`
- **@DirtiesContext** —— `testing/annotations/integration-infra/annotation-dirtiescontext`
- @DisabledInAotMode —— `testing/annotations/integration-infra/annotation-disabledinaotmode`
- **@DynamicPropertySource** —— `testing/annotations/integration-infra/annotation-dynamicpropertysource`
- @RecordApplicationEvents —— `testing/annotations/integration-infra/annotation-recordapplicationevents`
- **@Rollback** —— `testing/annotations/integration-infra/annotation-rollback`
- **@Sql** —— `testing/annotations/integration-infra/annotation-sql`
- **@SqlConfig** —— `testing/annotations/integration-infra/annotation-sqlconfig`
- **@SqlGroup** —— `testing/annotations/integration-infra/annotation-sqlgroup`
- **@SqlMergeMode** —— `testing/annotations/integration-infra/annotation-sqlmergemode`
- **@TestExecutionListeners** —— `testing/annotations/integration-infra/annotation-testexecutionlisteners`
- **@TestPropertySource** —— `testing/annotations/integration-infra/annotation-testpropertysource`
- **@WebAppConfiguration** —— `testing/annotations/integration-infra/annotation-webappconfiguration`
- **Infra JUnit Jupiter 测试注解** —— `testing/annotations/integration-junit-jupiter`
- **Infra JUnit 4 测试注解** —— `testing/annotations/integration-junit4`
- **测试的元注解支持** —— `testing/annotations/integration-meta`
- 标准注解支持 —— `testing/annotations/integration-standard`
- Infra TestContext Framework —— `testing/testcontext-framework`
- 测试的提前编译（AOT）支持 —— `testing/testcontext-framework/aot`
- **应用程序事件** —— `testing/testcontext-framework/application-events`
- 引导 TestContext 框架 —— `testing/testcontext-framework/bootstrapping`
- **上下文管理** —— `testing/testcontext-framework/ctx-management`
- 上下文缓存 —— `testing/testcontext-framework/ctx-management/caching`
- 使用上下文自定义器进行上下文配置 —— `testing/testcontext-framework/ctx-management/context-customizers`
- 默认上下文配置 —— `testing/testcontext-framework/ctx-management/default-config`
- **使用动态属性源进行上下文配置** —— `testing/testcontext-framework/ctx-management/dynamic-property-sources`
- **使用环境配置文件进行上下文配置** —— `testing/testcontext-framework/ctx-management/env-profiles`
- 上下文失败阈值 —— `testing/testcontext-framework/ctx-management/failure-threshold`
- **使用 Groovy 脚本进行上下文配置** —— `testing/testcontext-framework/ctx-management/groovy`
- **上下文层级结构** —— `testing/testcontext-framework/ctx-management/hierarchies`
- **上下文配置继承** —— `testing/testcontext-framework/ctx-management/inheritance`
- **使用上下文初始化器进行上下文配置** —— `testing/testcontext-framework/ctx-management/initializers`
- **使用组件类进行上下文配置** —— `testing/testcontext-framework/ctx-management/javaconfig`
- 混合使用组件类、XML 和 Groovy 脚本 —— `testing/testcontext-framework/ctx-management/mixed-config`
- **使用测试属性源进行上下文配置** —— `testing/testcontext-framework/ctx-management/property-sources`
- **使用 Web Mocks** —— `testing/testcontext-framework/ctx-management/web-mocks`
- **加载 GenericWebApplicationContext** —— `testing/testcontext-framework/ctx-management/web`
- **使用 XML 资源进行上下文配置** —— `testing/testcontext-framework/ctx-management/xml`
- **执行 SQL 脚本** —— `testing/testcontext-framework/executing-sql`
- **测试夹具的依赖注入** —— `testing/testcontext-framework/fixture-di`
- 关键抽象 —— `testing/testcontext-framework/key-abstractions`
- 并行测试执行 —— `testing/testcontext-framework/parallel-test-execution`
- **TestContext 框架支持类** —— `testing/testcontext-framework/support-classes`
- **TestExecutionListener 配置** —— `testing/testcontext-framework/tel-config`
- 测试执行事件 —— `testing/testcontext-framework/test-execution-events`
- **事务管理** —— `testing/testcontext-framework/tx`
- **测试请求和会话作用域的 Bean** —— `testing/testcontext-framework/web-scoped-beans`
- 测试 —— `testing`

## 注解

> 原文：[`testing/annotations`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations.adoc)

### 概述

本节介绍测试 Infra 应用时可以使用的注解。

## Infra 测试注解

> 原文：[`testing/annotations/integration-infra`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra.adoc)

### 概述

TODAY Framework 提供了以下特定于 Infra 的注解集，您可以将它们与 TestContext 框架结合使用于单元测试和集成测试中。 有关更多信息（包括默认属性值、属性别名和其他详细信息），请参阅相应的 javadoc。 Infra 测试注解包括以下内容：

## @ActiveProfiles

> 原文：[`testing/annotations/integration-infra/annotation-activeprofiles`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-activeprofiles.adoc)

### 概述

@ActiveProfiles 是一个类级注解，用于声明在为集成测试加载 ApplicationContext 时哪些 bean 定义配置文件 (profiles) 应该是活动的。 以下示例指示 dev 配置文件应该是活动的：

```java
@ContextConfiguration
@ActiveProfiles("dev") // <1>
class DeveloperTests {
  // 类体...
}
```

## @AfterTransaction

> 原文：[`testing/annotations/integration-infra/annotation-aftertransaction`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-aftertransaction.adoc)

### 概述

@AfterTransaction 表示对于已配置为使用 Infra @Transactional 注解在事务中运行的测试方法，被注解的 void 方法应在事务结束后运行。@AfterTransaction 方法不需要是 public 的，并且可以在基于 Java 8 的接口默认方法上声明。

```java
@AfterTransaction // <1>
void afterTransaction() {
  // 在事务结束后运行的逻辑
}
```

## 测试中的 Bean 覆盖

> 原文：[`testing/annotations/integration-infra/annotation-beanoverriding`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-beanoverriding.adoc)

### 概述

测试中的 Bean 覆盖是指通过注解测试类中的一个或多个字段，来覆盖测试类上下文中的特定 bean 的能力。 注意：这旨在作为一种风险较小的替代方案，以此来替代通过 @Bean 注册 bean 并将 StandardBeanFactory 的 setAllowBeanDefinitionOverriding 设置为 true 的做法。 Infra 测试框架提供了下面介绍的两组注解。一组纯粹依赖于 Infra，而第二组则依赖于 Mockito 第三方库。

#### @TestBean

@TestBean 用于测试类字段，以使用通过按约定命名的静态方法提供的实例来覆盖特定 bean。 默认情况下，bean 名称和关联的静态方法名称派生自被注解的字段名称，但该注解允许提供特定值。 @TestBean 注解使用 REPLACE 测试 bean 覆盖策略。 以下示例展示了如何完全配置 @TestBean 注解，使用等同于默认值的显式值：

```java
class OverrideBeanTests {
  @TestBean(name = "service", methodName = "serviceTestOverride")  // <1>
  private CustomService service;

  // test case body...

  private static CustomService serviceTestOverride() { // <2>
    return new MyFakeCustomService();
  }
}
```

#### @MockitoBean 和 @MockitoSpyBean

@MockitoBean 和 @MockitoSpyBean 用于测试类字段，分别使用 mock 和 spy 实例覆盖 bean。在后一种情况下，原始 bean 定义不会被替换，而是捕获早期实例并由 spy 包装。 默认情况下，要覆盖的 bean 名称派生自被注解的字段名称，但这两种注解都允许提供特定的 name。每个注解还定义了 Mockito 特定的属性以微调 mock 细节。 @MockitoBean 注解使用 REPLACEORCREATE 测试 bean 覆盖策略。 @MockitoSpyBean 注解使用 WRAP 策略，并且原始实例被包装在 Mockito spy 中。如果原始 bean 会被 AOP 代理包装，则该代理仍会围绕 spy 创建，注入到测试类和 ApplicationContext 中其他 bean 的是代理而不是 spy。详见 <<infra-testing-

```java
class OverrideBeanTests {
  @MockitoBean(name = "service1")  // <1>
  private CustomService mockService;

  @MockitoSpyBean(name = "service2") // <2>
  private CustomService spyService; // <3>

  // test case body...
}
```

##### 通过代理打桩

打桩比验证更需要小心，因为在代理上调用 Mockito.doReturn(...).when(...)、Mockito.doThrow(...).when(...) 及类似方法时，行为会因所涉及的 AOP 通知类型而异。 在调用之间不保留状态的通知（例如事务通知）不会对打桩产生不利影响。以下打桩序列在代理上调用时，与直接在底层 spy 上调用完全一致。

##### 在测试中禁用 AOP 通知

除了按上述方式绕过代理，你也可以在测试期间禁用底层 AOP 通知，同时在生产代码中保留 @Cacheable 或类似注解。常见原因包括完全避免缓存，使每次调用都直接到达 spy——这也会绕过上面描述的打桩陷阱，而无需解开代理。 通用做法是把控制通知实际行为的内容外部化——例如支撑 @Cacheable 的 CacheManager——并仅在测试中覆盖该配置，通常通过 bean 覆盖或测试专用属性实现。代理及其通知仍会创建，只是其行为在测试中被设为无操作或纯透传。 对于 @Cacheable，Infra 提供 NoOpCacheManager——一个接受缓存条目但从不真正存储它们的 CacheManager，因此每次调用都会缓存未命中并调用目标方法。用 NoOpCacheManager 覆盖 CacheManager bean——例如通过 <<infra-testing-annotation

## @BeforeTransaction

> 原文：[`testing/annotations/integration-infra/annotation-beforetransaction`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-beforetransaction.adoc)

### 概述

@BeforeTransaction 表示对于已配置为使用 Infra @Transactional 注解在事务中运行的测试方法，被注解的 void 方法应在事务开始前运行。@BeforeTransaction 方法不需要是 public 的，并且可以在基于 Java 8 的接口默认方法上声明。 以下示例展示了如何使用 @BeforeTransaction 注解：

```java
@BeforeTransaction // <1>
void beforeTransaction() {
  // 在事务开始前运行的逻辑
}
```

## @BootstrapWith

> 原文：[`testing/annotations/integration-infra/annotation-bootstrapwith`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-bootstrapwith.adoc)

### 概述

@BootstrapWith 是一个类级别的注解，你可以使用它来配置如何引导 Infra TestContext 框架。具体来说，你可以使用 @BootstrapWith 来指定自定义的 TestContextBootstrapper。有关更多详细信息，请参见 引导 TestContext 框架 部分。

## @Commit

> 原文：[`testing/annotations/integration-infra/annotation-commit`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-commit.adoc)

### 概述

@Commit 指示事务性测试方法的事务应在测试方法完成后提交。你可以使用 @Commit 作为 @Rollback(false) 的直接替代品，以更明确地传达代码的意图。与 @Rollback 类似，@Commit 也可以声明为类级别或方法级别的注解。 以下示例展示了如何使用 @Commit 注解：

```java
@Commit // <1>
@Test
void testProcessWithoutRollback() {
  // ...
}
```

## @ContextConfiguration

> 原文：[`testing/annotations/integration-infra/annotation-contextconfiguration`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-contextconfiguration.adoc)

### 概述

@ContextConfiguration 定义了类级元数据，用于确定如何为集成测试加载和配置 ApplicationContext。 具体来说，@ContextConfiguration 声明了用于加载上下文的应用程序上下文资源 locations 或组件 classes。 资源位置通常是位于类路径中的 XML 配置文件或 Groovy 脚本，而组件类通常是 @Configuration 类。 但是，资源位置也可以引用文件系统中的文件和脚本，组件类可以是 @Component 类、@Service 类等。 有关更多详细信息，请参阅 组件类。 以下示例显示了一个引用 XML 文件的 @ContextConfiguration 注解：

```java
@ContextConfiguration("/test-config.xml") // <1>
class XmlApplicationContextTests {
  // 类体...
}
```

## @ContextCustomizerFactories

> 原文：[`testing/annotations/integration-infra/annotation-contextcustomizerfactories`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-contextcustomizerfactories.adoc)

### 概述

@ContextCustomizerFactories 用于为特定测试类、其子类及其嵌套类注册 ContextCustomizerFactory 实现。如果你希望全局注册工厂，应通过 ContextCustomizerFactory 配置 中描述的自动发现机制进行注册。 以下示例展示了如何注册两个 ContextCustomizerFactory 实现：

```java
@ContextConfiguration
@ContextCustomizerFactories({CustomContextCustomizerFactory.class, AnotherContextCustomizerFactory.class}) // <1>
class CustomContextCustomizerFactoryTests {
  // class body...
}
```

## @ContextHierarchy

> 原文：[`testing/annotations/integration-infra/annotation-contexthierarchy`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-contexthierarchy.adoc)

### 概述

@ContextHierarchy 是一个类级别的注解，用于为集成测试定义 ApplicationContext 实例的层次结构。@ContextHierarchy 应该声明一个或多个 @ContextConfiguration 实例列表，其中每个实例定义上下文层次结构中的一个层级。以下示例演示了在单个测试类中使用 @ContextHierarchy（@ContextHierarchy 也可以在测试类层次结构中使用）：

```java
@ContextHierarchy({
  @ContextConfiguration("/parent-config.xml"),
  @ContextConfiguration("/child-config.xml")
})
class ContextHierarchyTests {
  // class body...
}
```

## @DirtiesContext

> 原文：[`testing/annotations/integration-infra/annotation-dirtiescontext`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-dirtiescontext.adoc)

### 概述

@DirtiesContext 指示底层的 Infra ApplicationContext 在测试执行期间已被弄脏（即，测试以某种方式修改或破坏了它——例如，通过更改单例 bean 的状态），应该关闭。当应用程序上下文被标记为脏时，它将从测试框架的缓存中移除并关闭。因此，对于任何后续需要具有相同配置元数据的上下文的测试，底层 Infra 容器将被重建。 你可以在同一个类或类层次结构中将 @DirtiesContext 同时用作类级别和方法级别的注解。在这种情况下，ApplicationContext 会在任何此类注解方法之前或之后，以及在当前测试类之前或之后被标记为脏，具体取决于配置的 methodMode 和 classMode。当在类级别和方法级别都声明 @DirtiesContext 时，两个注解的配置模式都将被遵守。例如，如果类模式设置为 BEFOREEACHTESTMETHOD

```java
@DirtiesContext(classMode = BEFORE_CLASS) // <1>
class FreshContextTests {
  // 一些需要新 Infra 容器的测试
}
```

## @DisabledInAotMode

> 原文：[`testing/annotations/integration-infra/annotation-disabledinaotmode`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-disabledinaotmode.adoc)

### 概述

@DisabledInAotMode 标志着被注解的测试类在 Infra AOT（提前编译）模式下被禁用，这意味着该测试类的 ApplicationContext 在构建时不会进行 AOT 优化处理。 如果一个测试类被注解为 @DisabledInAotMode，那么所有指定加载相同 ApplicationContext 配置的其他测试类也必须被注解为 @DisabledInAotMode。未能注解所有此类测试类将导致异常，无论是在构建时还是运行时。 当与基于 JUnit Jupiter 的测试一起使用时，@DisabledInAotMode 还标志着当在 Infra AOT 模式下运行测试套件时，被注解的测试类或测试方法被禁用。当应用于类级别时，该类中的所有测试方法都将被禁用。在这个意义上，@DisabledInAotMode 的语义类似于 JUnit Jupiter 的 @Disabl

## @DynamicPropertySource

> 原文：[`testing/annotations/integration-infra/annotation-dynamicpropertysource`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-dynamicpropertysource.adoc)

### 概述

@DynamicPropertySource 是一个方法级别的注解，你可以使用它来注册 动态 属性，这些属性将被添加到为集成测试加载的 ApplicationContext 的 Environment 中的 PropertySources 集中。当你无法预先知道属性值时，动态属性非常有用——例如，如果属性由外部资源管理，如由 Testcontainers 项目管理的容器。 以下示例演示了如何注册动态属性：

```java
@ContextConfiguration
class MyIntegrationTests {

  static MyExternalServer server = // ...

  @DynamicPropertySource // <1>
  static void dynamicProperties(DynamicPropertyRegistry registry) { // <2>
    registry.add("server.port", server::getPort); // <3>
  }

  // tests ...
}
```

## @RecordApplicationEvents

> 原文：[`testing/annotations/integration-infra/annotation-recordapplicationevents`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-recordapplicationevents.adoc)

### 概述

@RecordApplicationEvents 是一个类级别的注解，用于指示 Infra TestContext 框架 记录在单个测试执行期间在 ApplicationContext 中发布的所有应用程序事件。 记录的事件可以通过测试中的 ApplicationEvents API 访问。 有关示例和更多详细信息，请参见 应用程序事件 和 @RecordApplicationEvents javadoc。

## @Rollback

> 原文：[`testing/annotations/integration-infra/annotation-rollback`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-rollback.adoc)

### 概述

@Rollback 指示事务性测试方法的事务在测试方法完成后是否应回滚。如果是 true，则事务回滚。否则，事务提交（另请参见 @Commit）。即使没有显式声明 @Rollback，Infra TestContext 框架中的集成测试默认回滚也为 true。 当声明为类级别注解时，@Rollback 定义测试类层次结构中所有测试方法的默认回滚语义。当声明为方法级别注解时，@Rollback 定义特定测试方法的回滚语义，可能会覆盖类级别的 @Rollback 或 @Commit 语义。 以下示例导致测试方法的结果不回滚（即结果提交到数据库）：

```java
@Rollback(false) // <1>
@Test
void testProcessWithoutRollback() {
  // ...
}
```

## @Sql

> 原文：[`testing/annotations/integration-infra/annotation-sql`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-sql.adoc)

### 概述

@Sql 用于注解测试类或测试方法，以配置在集成测试期间针对给定数据库运行的 SQL 脚本。以下示例展示了如何使用它：

```java
@Test
@Sql({"/test-schema.sql", "/test-user-data.sql"}) // <1>
void userTest() {
  // 运行依赖于测试架构和测试数据的代码
}
```

## @SqlConfig

> 原文：[`testing/annotations/integration-infra/annotation-sqlconfig`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-sqlconfig.adoc)

### 概述

@SqlConfig 定义了用于确定如何解析和运行使用 @Sql 注解配置的 SQL 脚本的元数据。以下示例展示了如何使用它：

```java
@Test
@Sql(
  scripts = "/test-user-data.sql",
  config = @SqlConfig(commentPrefix = "`", separator = "@@") // <1>
)
void userTest() {
  // 运行依赖于测试数据的代码
}
```

## @SqlGroup

> 原文：[`testing/annotations/integration-infra/annotation-sqlgroup`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-sqlgroup.adoc)

### 概述

@SqlGroup 是一个容器注解，用于聚合多个 @Sql 注解。你可以原生使用 @SqlGroup 来声明多个嵌套的 @Sql 注解，或者结合 Java 8 对可重复注解的支持来使用它，其中 @Sql 可以在同一个类或方法上声明多次，隐式生成此容器注解。以下示例显示了如何声明一个 SQL 组：

```java
@Test
@SqlGroup({ // <1>
  @Sql(scripts = "/test-schema.sql", config = @SqlConfig(commentPrefix = "`")),
  @Sql("/test-user-data.sql")
})
void userTest() {
  // 运行使用测试架构和测试数据的代码
}
```

## @SqlMergeMode

> 原文：[`testing/annotations/integration-infra/annotation-sqlmergemode`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-sqlmergemode.adoc)

### 概述

@SqlMergeMode 用于注解测试类或测试方法，以配置是否将方法级别的 @Sql 声明与类级别的 @Sql 声明合并。如果未在测试类或测试方法上声明 @SqlMergeMode，则默认使用 OVERRIDE 合并模式。在 OVERRIDE 模式下，方法级别的 @Sql 声明将有效覆盖类级别的 @Sql 声明。 请注意，方法级别的 @SqlMergeMode 声明会覆盖类级别的声明。 以下示例展示了如何在类级别使用 @SqlMergeMode。

```java
@JUnitConfig(TestConfig.class)
@Sql("/test-schema.sql")
@SqlMergeMode(MERGE) // <1>
class UserTests {

  @Test
  @Sql("/user-test-data-001.sql")
  void standardUserProfile() {
    // 运行依赖于测试数据集 001 的代码
  }
}
```

## @TestExecutionListeners

> 原文：[`testing/annotations/integration-infra/annotation-testexecutionlisteners`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-testexecutionlisteners.adoc)

### 概述

@TestExecutionListeners 用于为特定测试类、其子类及其嵌套类注册监听器。如果你希望全局注册监听器，应通过 TestExecutionListener 配置 中描述的自动发现机制进行注册。 以下示例展示了如何注册两个 TestExecutionListener 实现：

```java
@ContextConfiguration
@TestExecutionListeners({CustomTestExecutionListener.class, AnotherTestExecutionListener.class}) // <1>
class CustomTestExecutionListenerTests {
  // class body...
}
```

## @TestPropertySource

> 原文：[`testing/annotations/integration-infra/annotation-testpropertysource`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-testpropertysource.adoc)

### 概述

@TestPropertySource 是一个类级注解，您可以使用它来配置属性文件的位置和内联属性，以添加到为集成测试加载的 ApplicationContext 的 Environment 中的 PropertySources 集中。 以下示例演示了如何从类路径声明属性文件：

```java
@ContextConfiguration
@TestPropertySource("/test.properties") // <1>
class MyIntegrationTests {
  // 类体...
}
```

## @WebAppConfiguration

> 原文：[`testing/annotations/integration-infra/annotation-webappconfiguration`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-infra/annotation-webappconfiguration.adoc)

### 概述

@WebAppConfiguration 是一个类级注解，您可以使用它来声明为集成测试加载的 ApplicationContext 应该是 GenericMockWebApplicationContext。 测试类上仅存在 @WebAppConfiguration 即可确保为测试加载 GenericMockWebApplicationContext。 以下示例显示了如何使用 @WebAppConfiguration 注解： --

```java
@ContextConfiguration
@WebAppConfiguration // <1>
class WebAppTests {
  // 类体...
}
```

## Infra JUnit Jupiter 测试注解

> 原文：[`testing/annotations/integration-junit-jupiter`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-junit-jupiter.adoc)

### 概述

当与 InfraExtension 和 JUnit Jupiter（即 JUnit 5 中的编程模型）结合使用时，支持以下注解：

#### @JUnitConfig

@JUnitConfig 是一个组合注解，它结合了 JUnit Jupiter 中的 @ExtendWith(InfraExtension.class) 和 Infra TestContext 框架中的 @ContextConfiguration。 它可以在类级别用作 @ContextConfiguration 的直接替代品。 关于配置选项，@ContextConfiguration 和 @JUnitConfig 之间的唯一区别是，组件类可以在 @JUnitConfig 中使用 value 属性声明。 以下示例显示了如何使用 @JUnitConfig 注解指定配置类：

```java
@JUnitConfig(TestConfig.class) // <1>
class ConfigurationClassJUnitJupiterInfraTests {
  // 类体...
}
```

#### @JUnitWebConfig

@JUnitWebConfig 是一个组合注解，它结合了 JUnit Jupiter 中的 @ExtendWith(InfraExtension.class) 和 Infra TestContext 框架中的 @ContextConfiguration。 您可以在类级别将其用作 @ContextConfiguration 的直接替代品。 关于配置选项，@ContextConfiguration 和 @JUnitWebConfig 之间的唯一区别是，您可以使用 @JUnitWebConfig 中的 value 属性声明组件类。 以下示例显示了如何使用 @JUnitWebConfig 注解指定配置类：

```java
@JUnitWebConfig(TestConfig.class) // <1>
class ConfigurationClassJUnitJupiterInfraWebTests {
  // 类体...
}
```

## Infra JUnit 4 测试注解

> 原文：[`testing/annotations/integration-junit4`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-junit4.adoc)

### 概述

以下注解仅在与 InfraRunner、Infra JUnit 4 规则 或 Infra JUnit 4 支持类 结合使用时才受支持：

#### @IfProfileValue

@IfProfileValue 指示带注解的测试针对特定的测试环境启用。 如果配置的 ProfileValueSource 返回提供的 name 的匹配 value，则启用测试。 否则，测试将被禁用，实际上被忽略。 您可以在类级别、方法级别或两者都应用 @IfProfileValue。 @IfProfileValue 的类级使用优先于该类或其子类中任何方法的方法级使用。 具体来说，如果测试在类级别和方法级别都启用，则启用该测试。 不存在 @IfProfileValue 意味着测试默认启用。 这类似于 JUnit 4 的 @Ignore 注解的语义，不同之处在于 @Ignore 的存在总是禁用测试。 以下示例显示了一个带有 @IfProfileValue 注解的测试：

```java
@IfProfileValue(name="java.vendor", value="Oracle Corporation") // <1>
@Test
public void testProcessWhichRunsOnlyOnOracleJvm() {
  // 一些仅应在 Oracle Corporation 的 Java VM 上运行的逻辑
}
```

#### @ProfileValueSourceConfiguration

@ProfileValueSourceConfiguration 是一个类级注解，用于指定在检索通过 @IfProfileValue 注解配置的配置文件值时要使用的 ProfileValueSource 类型。 如果未为测试声明 @ProfileValueSourceConfiguration，则默认使用 SystemProfileValueSource。 以下示例显示了如何使用 @ProfileValueSourceConfiguration：

```java
@ProfileValueSourceConfiguration(CustomProfileValueSource.class) // <1>
public class CustomProfileValueSourceTests {
  // 类体...
}
```

#### @Timed

@Timed 指示带注解的测试方法必须在指定的时间段内（以毫秒为单位）完成执行。 如果文本执行时间超过指定的时间段，则测试失败。 该时间段包括运行测试方法本身、测试的任何重复（请参阅 @Repeat）以及测试夹具的任何设置或拆卸。 以下示例显示了如何使用它：

#### @Repeat

@Repeat 指示带注解的测试方法必须重复运行。 注解中指定了测试方法要运行的次数。 要重复的执行范围包括测试方法本身的执行以及测试夹具的任何设置或拆卸。 当与 InfraMethodRule 一起使用时，该范围还包括 TestExecutionListener 实现对测试实例的准备。 以下示例显示了如何使用 @Repeat 注解：

## 测试的元注解支持

> 原文：[`testing/annotations/integration-meta`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-meta.adoc)

### 概述

您可以使用大多数测试相关注解作为 元注解 来创建自定义组合注解，并减少整个测试套件中的配置重复。 您可以将以下每一个用作与 TestContext 框架 结合使用的元注解。 考虑以下示例：

```java
  @RunWith(InfraRunner.class)
  @ContextConfiguration({"/app-config.xml", "/test-data-access-config.xml"})
  @ActiveProfiles("dev")
  @Transactional
  public class OrderRepositoryTests { }

  @RunWith(InfraRunner.class)
  @ContextConfiguration({"/app-config.xml", "/test-data-access-config.xml"})
  @ActiveProfiles("dev")
  @Transactional
  public class UserRepositoryTests { }
```

## 标准注解支持

> 原文：[`testing/annotations/integration-standard`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/annotations/integration-standard.adoc)

### 概述

以下注解在 Infra TestContext 框架的所有配置中都支持标准语义。 请注意，这些注解并非特定于测试，可以在 TODAY Framework 中的任何位置使用。 在 Infra TestContext 框架中，您可以在 ApplicationContext 中配置的任何应用程序组件上使用具有标准语义的 @PostConstruct 和 @PreDestroy。 但是，这些生命周期注解在实际测试类中的使用有限。 如果测试类中的方法使用 @PostConstruct 进行了注解，则该方法在底层测试框架的任何 before 方法（例如使用 JUnit Jupiter 的 @BeforeEach 注解的方法）之前运行，并且这适用于测试类中的每个测试方法。 另一方面，如果测试类中的方法使用 @PreDestroy 进行了注解，则该方法永远不会运行。 因此，在测试类中，我们建议您使用底层测

## Infra TestContext Framework

> 原文：[`testing/testcontext-framework`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework.adoc)

### 概述

Infra TestContext Framework（位于 infra.test.context 包中）提供了通用的、注解驱动的单元和集成测试支持，该支持与所使用的测试框架无关。TestContext 框架也非常重视约定优于配置，提供了合理的默认值，你可以通过基于注解的配置来覆盖这些默认值。 除了通用的测试基础设施外，TestContext 框架还为 JUnit 4、JUnit Jupiter（又名 JUnit 5）和 TestNG 提供了显式支持。对于 JUnit 4 和 TestNG，Infra 提供了 abstract 支持类。此外，Infra 为 JUnit 4 提供了自定义 JUnit Runner 和自定义 JUnit Rules，为 JUnit Jupiter 提供了自定义 Extension，这让你能够编写所谓的 POJO 测试类。POJO 测试类不需要扩展特定的类层次结

## 测试的提前编译（AOT）支持

> 原文：[`testing/testcontext-framework/aot`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/aot.adoc)

### 概述

本章介绍使用 Infra TestContext Framework 进行集成测试时的 Infra 提前编译（AOT）支持。 测试支持在 Infra 核心 AOT 支持 的基础上扩展了以下特性。 默认情况下，所有测试在 AOT 模式下启用。不过，你可以通过 @DisabledInAotMode 注解，选择性地在 AOT 模式下禁用整个测试类或某个测试方法。 使用 JUnit Jupiter 时，可以通过 @EnabledInNativeImage 与 @DisabledInNativeImage 注解在 GraalVM 原生镜像中选择性启用或禁用测试。注意 @DisabledInAotMode 也会在 GraalVM 原生镜像中禁用被标注的测试类或测试方法，这一点与 JUnit Jupiter 的 @DisabledInNativeImage 注解一致。 默认情况下，构建时 AOT 处理遇

## 应用程序事件

> 原文：[`testing/testcontext-framework/application-events`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/application-events.adoc)

### 概述

TestContext 框架提供了对记录在 ApplicationContext 中发布的 应用程序事件 的支持， 以便在测试中对这些事件进行断言。在单个测试执行期间发布的所有事件都可以通过 ApplicationEvents API 获得，该 API 允许你将事件作为 java.util.Stream 进行处理。 要在测试中使用 ApplicationEvents，请执行以下操作。 以下测试类使用 JUnit Jupiter 的 InfraExtension 和 AssertJ 来断言在调用 Infra 管理的组件中的方法时发布的应用程序事件的类型：

```java
@JUnitConfig(/* ... */)
@RecordApplicationEvents // <1>
class OrderServiceTests {

  @Autowired
  OrderService orderService;

  @Autowired
  ApplicationEvents events; // <2>

  @Test
  void submitOrder() {
    // 调用 OrderService 中发布事件的方法
    orderService.submitOrder(new Order(/* ... */));
    // 验证是否发布了一个 OrderSubmitted 事件
    long numEvents = events.stream(OrderSubmitted.class).count(); // <3>
    assertThat(numEvents).isEqualTo(1);
  }
}
```

## 引导 TestContext 框架

> 原文：[`testing/testcontext-framework/bootstrapping`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/bootstrapping.adoc)

### 概述

Infra TestContext 框架内部的默认配置足以满足所有常见用例。 然而，有时开发团队或第三方框架希望更改默认的 ContextLoader，实现自定义的 TestContext 或 ContextCache，增强 ContextCustomizerFactory 和 TestExecutionListener 实现的默认集合等等。 为了对 TestContext 框架的操作进行这种低级控制，Infra 提供了一种引导策略。 TestContextBootstrapper 定义了用于引导 TestContext 框架的 SPI。 TestContextManager 使用 TestContextBootstrapper 来加载当前测试的 TestExecutionListener 实现，并构建它管理的 TestContext。 您可以使用 @BootstrapWith（直接使用或

## 上下文管理

> 原文：[`testing/testcontext-framework/ctx-management`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management.adoc)

### 概述

每个 TestContext 为其负责的测试实例提供上下文管理和缓存支持。 测试实例不会自动获得对已配置的 ApplicationContext 的访问权限。 但是，如果测试类实现了 ApplicationContextAware 接口，则会将对 ApplicationContext 的引用提供给测试实例。 作为实现 ApplicationContextAware 接口的替代方法，您可以通过字段或 setter 方法上的 @Autowired 注解为测试类注入应用程序上下文，如以下示例所示：

```java
@JUnitConfig
class MyTest {

  @Autowired // <1>
  ApplicationContext applicationContext;

}
```

## 上下文缓存

> 原文：[`testing/testcontext-framework/ctx-management/caching`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/caching.adoc)

### 概述

一旦 TestContext 框架为测试加载了 ApplicationContext，该上下文将被缓存并重新用于所有在同一测试套件中声明相同唯一上下文配置的后续测试。要了解缓存的工作原理，重要的是要理解 "唯一" 和 "测试套件" 的含义。 ApplicationContext 可以通过用于加载它的配置参数组合来唯一标识。因此，配置参数的唯一组合用于生成缓存上下文的键。TestContext 框架使用以下配置参数来构建上下文缓存键： 例如，如果 TestClassA 为 @ContextConfiguration 的 locations（或 value）属性指定了 {"app-config.xml", "test-config.xml"}，TestContext 框架将加载相应的 ApplicationContext 并将其存储在 static 上下文缓存中，键仅基于这些位置。因此，如果 

## 使用上下文自定义器进行上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/context-customizers`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/context-customizers.adoc)

### 概述

ContextCustomizer 负责在 bean 定义加载到上下文中之后但在上下文刷新之前自定义提供的 ConfigurableApplicationContext。 ContextCustomizerFactory 负责基于某些自定义逻辑（确定给定测试类是否需要 ContextCustomizer——例如，基于某个注解的存在）创建 ContextCustomizer。工厂在 ContextLoaders 处理完测试类的上下文配置属性之后但在创建 MergedContextConfiguration 之前调用。

## 默认上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/default-config`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/default-config.adoc)

### 概述

如 组件类、 XML 资源和 Groovy 脚本各节所述， 如果没有显式指定用于加载测试 ApplicationContext 的 @Configuration 类、XML 配置文件或 Groovy 脚本，TestContext 框架会尝试查找默认上下文配置。 在 Infra 5.0 中，即使测试类的类型层级或封闭类层级中没有声明 @ContextConfiguration， TestContext 框架也会检测这些层级中位于当前测试类之上的所有默认上下文配置。 封闭类层级的检测适用于 @Nested 测试类，并遵循其封闭配置继承设置。 旧的检测算法在这些层级中没有声明 @ContextConfiguration 时，会忽略超类或封闭类的默认上下文配置。 因此，升级后可能需要调整已有测试。例如，以前被忽略的超类或封闭类中的静态嵌套 @Configuration 类现在会被处理，这可能使最终

## 使用动态属性源进行上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/dynamic-property-sources`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/dynamic-property-sources.adoc)

### 概述

自 TODAY Framework 5.2.5 起，TestContext 框架通过 @DynamicPropertySource 注解提供了对动态属性的支持。此注解可用于需要向为集成测试加载的 ApplicationContext 的 Environment 中的 PropertySources 集合添加具有动态值的属性的集成测试。 @DynamicPropertySource 注解及其支持基础设施最初旨在允许基于 Testcontainers 的测试中的属性轻松暴露给 Infra 集成测试。然而，此功能也可用于任何生命周期在测试 ApplicationContext 之外维护的外部资源。 与应用于类级别的 @TestPropertySource 注解相比，@DynamicPropertySource 必须应用于接受单个 DynamicPropertyRegistry 参数的 stati

```java
@JUnitConfig(/* ... */)
@Testcontainers
class ExampleIntegrationTests {

  @Container
  static GenericContainer redis =
    new GenericContainer("redis:5.0.3-alpine").withExposedPorts(6379);

  @DynamicPropertySource
  static void redisProperties(DynamicPropertyRegistry registry) {
    registry.add("redis.host", redis::getHost);
    registry.add("redis.port", redis::getFirstMappedPort);
  }

  // 测试 ...

}
```

## 使用环境配置文件进行上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/env-profiles`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/env-profiles.adoc)

### 概述

TODAY Framework 对环境和配置文件（又名 "bean 定义配置文件"）的概念提供了一流的支持，集成测试可以配置为在加载测试的 ApplicationContext 时激活特定的 bean 定义配置文件。这是通过使用 @ActiveProfiles 注解标注测试类并提供应在加载 ApplicationContext 时激活的配置文件列表来实现的。 NOTE: 你可以将 @ActiveProfiles 与 SmartContextLoader SPI 的任何实现一起使用，但 @ActiveProfiles 不支持旧的 ContextLoader SPI 的实现。 考虑两个使用 XML 配置和 @Configuration 类的示例：

```xml
<!-- app-config.xml -->
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jdbc="http://www.springframework.org/schema/jdbc"
  xmlns:jee="http://www.springframework.org/schema/jee"
  xsi:schemaLocation="...">

  <bean id="transferService"
      class="com.bank.service.internal.DefaultTransferService">
    <constructor-arg ref="accountRepository"/>
    <constructor-arg ref="feePolicy"/>
  </bean>

  <bean id="accountRepository"
      class="com.bank.repository.internal.JdbcAccountRepository">
    <constructor-arg ref="dataSource"/>
  </bean>

  <bean id="feePolicy"
    class="com.bank.service.internal.ZeroFeePolicy"/>

  <beans profile="dev">
    <jdbc:embedded-database id="dataSource">
      <jdbc:script
        location="classpath:com/bank/config/sql/schema.sql"/>
      <jdbc:script
        location="classpath:com/bank/config/sql/test-data.sql"/>
    </jdbc:embedded-database>
  </beans>

  <beans profile="production">
    <jee:jndi-lookup id="dataSource" jndi-name="java:comp/env/jdbc/datasource"/>
  </beans>

  <beans profile="default">
    <jdbc:embedded-database id="dataSource">
      <jdbc:script
        location="classpath:com/bank/config/sql/schema.sql"/>
    </jdbc:embedded-database>
  </beans>

</beans>
```

## 上下文失败阈值

> 原文：[`testing/testcontext-framework/ctx-management/failure-threshold`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/failure-threshold.adoc)

### 概述

自 TODAY Framework 6.1 起，引入了上下文失败阈值策略，该策略有助于避免重复尝试加载失败的 ApplicationContext。默认情况下，失败阈值设置为 1，这意味着对于给定的上下文缓存键（请参阅 上下文缓存），只会尝试加载一次 ApplicationContext。任何后续尝试加载具有相同上下文缓存键的 ApplicationContext 都将导致立即抛出 IllegalStateException，并附带一条错误消息，解释尝试已被先发制人地跳过。此行为允许各个测试类和测试套件通过避免重复尝试加载永远无法成功加载的 ApplicationContext（例如，由于配置错误或缺少阻止上下文在当前环境中加载的外部资源）来更快地失败。 你可以通过设置名为 infra.test.context.failure.threshold 的 JVM 系统属性（值为正整数），从命令

## 使用 Groovy 脚本进行上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/groovy`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/groovy.adoc)

### 概述

要使用使用 Groovy Bean 定义 DSL 的 Groovy 脚本为测试加载 ApplicationContext，你可以使用 @ContextConfiguration 标注你的测试类，并使用包含 Groovy 脚本资源位置的数组配置 locations 或 value 属性。Groovy 脚本的资源查找语义与 XML 配置文件 中描述的相同。 TIP: 如果类路径中有 Groovy，Infra TestContext 框架会自动启用使用 Groovy 脚本加载 ApplicationContext 的支持。 以下示例显示了如何指定 Groovy 配置文件：

```java
@ExtendWith(InfraExtension.class)
// ApplicationContext 将从类路径根目录下的 "/AppConfig.groovy" 和
// "/TestConfig.groovy" 加载
@ContextConfiguration({"/AppConfig.groovy", "/TestConfig.Groovy"}) <1>
class MyTest {
  // 类主体...
}
```

## 上下文层级结构

> 原文：[`testing/testcontext-framework/ctx-management/hierarchies`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/hierarchies.adoc)

### 概述

在编写依赖于已加载的 Infra ApplicationContext 的集成测试时，针对单个上下文进行测试通常就足够了。 你可以通过在单个测试类上或测试类层次结构中声明带有 @ContextHierarchy 注解的上下文配置来编写使用上下文层级结构的集成测试。 如果在测试类层次结构中的多个类上声明了上下文层级结构，你还可以合并或覆盖上下文层级结构中特定命名级别的上下文配置。 当合并层级结构中给定级别的配置时，配置资源类型（即 XML 配置文件或组件类）必须一致。否则，完全可以接受在上下文层级结构中使用不同的资源类型配置不同的级别。 本节中其余基于 JUnit Jupiter 的示例展示了需要使用上下文层级结构的集成测试的常见配置场景。 -- ControllerIntegrationTests 代表了 Web MVC web 应用程序的典型集成测试场景，它通过声明一个包含两个级别的上下

```java
@ExtendWith(InfraExtension.class)
@WebAppConfiguration
@ContextHierarchy({
  @ContextConfiguration(classes = TestAppConfig.class),
  @ContextConfiguration(classes = WebConfig.class)
})
class ControllerIntegrationTests {

  @Autowired
  GenericWebApplicationContext wac;

  // ...
}
```

## 上下文配置继承

> 原文：[`testing/testcontext-framework/ctx-management/inheritance`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/inheritance.adoc)

### 概述

@ContextConfiguration 支持布尔类型的 inheritLocations 和 inheritInitializers 属性，用于表示是否应继承超类声明的资源位置或组件类以及上下文初始化器。这两个标志的默认值均为 true。这意味着测试类继承任何超类声明的资源位置或组件类以及上下文初始化器。具体来说，测试类的资源位置或组件类被附加到超类声明的资源位置或注解类列表中。同样，给定测试类的初始化器被添加到测试超类定义的初始化器集中。因此，子类可以选择扩展资源位置、组件类或上下文初始化器。 如果 @ContextConfiguration 中的 inheritLocations 或 inheritInitializers 属性设置为 false，则测试类的资源位置或组件类以及上下文初始化器将分别遮蔽并有效地替换超类定义的配置。 NOTE: 测试配置也可以从封闭类继承。有关详细信息

```java
@ExtendWith(InfraExtension.class)
// ApplicationContext 将从类路径根目录下的 "/base-config.xml" 加载
@ContextConfiguration("/base-config.xml") <1>
class BaseTest {
  // 类主体...
}

// ApplicationContext 将从类路径根目录下的 "/base-config.xml" 和
// "/extended-config.xml" 加载
@ContextConfiguration("/extended-config.xml") <2>
class ExtendedTest extends BaseTest {
  // 类主体...
}
```

## 使用上下文初始化器进行上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/initializers`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/initializers.adoc)

### 概述

要使用上下文初始化器为测试配置 ApplicationContext，请使用 @ContextConfiguration 标注测试类，并使用包含对实现 ApplicationContextInitializer 的类的引用的数组配置 initializers 属性。然后，声明的上下文初始化器用于初始化为测试加载的 ConfigurableApplicationContext。请注意，每个声明的初始化器支持的具体 ConfigurableApplicationContext 类型必须与使用的 SmartContextLoader 创建的 ApplicationContext 类型兼容（通常是 GenericApplicationContext）。此外，调用初始化器的顺序取决于它们是否实现了 Infra Ordered 接口，或者是否标注了 Infra @Order 注解或标准 @Priori

```java
@ExtendWith(InfraExtension.class)
// ApplicationContext 将从 TestConfig 加载
// 并由 TestAppCtxInitializer 初始化
@ContextConfiguration(
  classes = TestConfig.class,
  initializers = TestAppCtxInitializer.class) // <1>
class MyTest {
  // 类主体...
}
```

## 使用组件类进行上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/javaconfig`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/javaconfig.adoc)

### 概述

要使用组件类（请参阅 基于 Java 的容器配置）为测试加载 ApplicationContext，可以使用 @ContextConfiguration 标注测试类，并使用包含对组件类的引用的数组配置 classes 属性。以下示例显示了如何执行此操作：

```java
@ExtendWith(InfraExtension.class)
// ApplicationContext 将从 AppConfig 和 TestConfig 加载
@ContextConfiguration(classes = {AppConfig.class, TestConfig.class}) // <1>
class MyTest {
  // 类主体...
}
```

## 混合使用组件类、XML 和 Groovy 脚本

> 原文：[`testing/testcontext-framework/ctx-management/mixed-config`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/mixed-config.adoc)

### 概述

有时可能希望混合使用组件类（通常是 @Configuration 类）、XML 配置文件或 Groovy 脚本来为测试配置 ApplicationContext。例如，如果因历史原因在生产中使用 XML 配置，你可能希望使用 @Configuration 类来为测试配置特定的 Infra 管理组件，反之亦然。 某些扩展框架可以支持同时从不同类型的资源（例如，@Configuration 类、XML 配置文件和 Groovy 脚本）加载 ApplicationContext。TODAY Framework 在 infra-test 模块中提供的大多数 SmartContextLoader 实现，每个测试上下文仅支持一种资源类型，但这并不意味着不能混合使用不同的配置形式。目标框架未提供 Spring 的 Groovy 专用测试上下文加载器，使用 Groovy 脚本时需要选择支持该资源类型的加载

## 使用测试属性源进行上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/property-sources`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/property-sources.adoc)

### 概述

TODAY Framework 对具有属性源层次结构的环境概念提供了一流的支持，你可以使用特定于测试的属性源配置集成测试。与在 @Configuration 类上使用的 @PropertySource 注解相比，你可以在测试类上声明 @TestPropertySource 注解，以声明测试属性文件的资源位置或内联属性。这些测试属性源被添加到为带注解的集成测试加载的 ApplicationContext 的 Environment 中的 PropertySources 集合中。 你将 @TestPropertySource 与 SmartContextLoader SPI 的任何实现一起使用，但 @TestPropertySource 不支持旧的 ContextLoader SPI 的实现。 SmartContextLoader 的实现通过 MergedContextConfiguratio

#### 声明测试属性源

你可以使用 @TestPropertySource 的 locations 或 value 属性来配置测试属性文件。 默认情况下，支持传统的和基于 XML 的 java.util.Properties 文件格式——例如，"classpath:/com/example/test.properties" 或 "file:///path/to/file.xml"。自 TODAY Framework 6.1 起，你可以通过 @TestPropertySource 中的 factory 属性配置自定义 PropertySourceFactory，以支持不同的文件格式，如 JSON、YAML 等。 每个路径都被解释为 Infra Resource。普通路径（例如，"test.properties"）被视为相对于定义测试类的包的类路径资源。以斜杠开头的路径被视为绝对类路径资源（例如："/org/exam

```java
@ContextConfiguration
@TestPropertySource("/test.properties") // <1>
class MyIntegrationTests {
  // 类主体...
}
```

#### 优先级

测试属性的优先级高于在操作系统的环境、Java 系统属性中定义的属性，或应用程序通过使用 @PropertySource 或以编程方式添加的属性源。因此，测试属性可用于选择性地覆盖从系统和应用程序属性源加载的属性。此外，内联属性的优先级高于从资源位置加载的属性。但请注意，通过 @DynamicPropertySource 注册的属性优先级高于通过 @TestPropertySource 加载的属性。 在下一个示例中，timezone 和 port 属性以及在 "/test.properties" 中定义的任何属性将覆盖在系统和应用程序属性源中定义的任何同名属性。此外，如果 "/test.properties" 文件定义了 timezone 和 port 属性的条目，这些条目将被使用 properties 属性声明的内联属性覆盖。以下示例显示了如何同时在文件和内联中指定属性：

```java
@ContextConfiguration
@TestPropertySource(
  locations = "/test.properties",
  properties = {"timezone = GMT", "port = 4242"}
)
class MyIntegrationTests {
  // 类主体...
}
```

#### 继承和覆盖测试属性源

@TestPropertySource 支持布尔类型的 inheritLocations 和 inheritProperties 属性，用于表示是否应继承超类声明的属性文件资源位置和内联属性。这两个标志的默认值均为 true。这意味着测试类继承任何超类声明的位置和内联属性。具体来说，测试类的位置和内联属性被附加到超类声明的位置和内联属性。因此，子类可以选择扩展位置和内联属性。请注意，后面出现的属性会遮蔽（即覆盖）前面出现的同名属性。此外，上述优先级规则也适用于继承的测试属性源。 如果 @TestPropertySource 中的 inheritLocations 或 inheritProperties 属性设置为 false，则测试类的位置或内联属性将分别遮蔽并有效地替换超类定义的配置。 NOTE: 测试配置也可以从封闭类继承。有关详细信息，请参阅 @Nested 测试类配置。 在下一个示

## 使用 Web Mocks

> 原文：[`testing/testcontext-framework/ctx-management/web-mocks`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/web-mocks.adoc)

### 概述

为了提供全面的 Web 测试支持，TestContext 框架具有默认启用的 WebMockTestExecutionListener。 当针对 GenericMockWebApplicationContext 进行测试时，此 TestExecutionListener 在每个测试方法之前使用 Infra Web 的 HttpContextHolder 设置默认的线程本地状态 创建 MockRequest、MockResponse 和 MockHttpContext。 WebMockTestExecutionListener 还确保可以将 MockResponse 和 MockHttpContext 注入到测试实例中，并且一旦测试完成，它就会清理线程本地状态。 一旦为测试加载了 GenericMockWebApplicationContext，你可能会发现你需要与 Web mock 进行交

```java
@JUnitWebConfig
class WacTests {

  @Autowired
  ApplicationContext wac; // 缓存的

  @Autowired
  Session session;

  @Autowired
  HttpContext request;

  //...
}
```

## 加载 GenericWebApplicationContext

> 原文：[`testing/testcontext-framework/ctx-management/web`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/web.adoc)

### 概述

要让 TestContext 框架加载 GenericMockWebApplicationContext 而不是标准的 ApplicationContext， 可以在相应测试类上标注 @WebAppConfiguration。 在测试类上使用 @WebAppConfiguration 会指示 TestContext 框架（TCF）为你的集成测试加载 GenericMockWebApplicationContext（WAC）。 请注意，Infra 对 GenericMockWebApplicationContext 实现的测试支持与对标准 ApplicationContext 实现的支持一致。使用 GenericMockWebApplicationContext 测试时，你可以通过 @ContextConfiguration 声明 XML 配置文件、Groovy 脚本或 @Configura

```java
@ExtendWith(InfraExtension.class)

@WebAppConfiguration

// 检测同一包中的 "WacTests-context.xml"
// 或静态嵌套 @Configuration 类
@ContextConfiguration
class WacTests {
  //...
}
```

## 使用 XML 资源进行上下文配置

> 原文：[`testing/testcontext-framework/ctx-management/xml`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/ctx-management/xml.adoc)

### 概述

要使用 XML 配置文件为测试加载 ApplicationContext，可以使用 @ContextConfiguration 标注测试类，并使用包含 XML 配置元数据资源位置的数组配置 locations 属性。普通路径或相对路径（例如，context.xml）被视为相对于定义测试类的包的类路径资源。以斜杠开头的路径被视为绝对类路径位置（例如，/org/example/config.xml）。表示资源 URL 的路径（即以 classpath:、file:、http: 等为前缀的路径）将原样使用。

```java
@ExtendWith(InfraExtension.class)
// ApplicationContext 将从类路径根目录下的 "/app-config.xml" 和
// "/test-config.xml" 加载
@ContextConfiguration(locations = {"/app-config.xml", "/test-config.xml"}) // <1>
class MyTest {
  // 类主体...
}
```

## 执行 SQL 脚本

> 原文：[`testing/testcontext-framework/executing-sql`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/executing-sql.adoc)

### 概述

在针对关系数据库编写集成测试时，运行 SQL 脚本来修改数据库架构或将测试数据插入表中通常是有益的。 infra-jdbc 模块提供了通过在加载 Infra ApplicationContext 时执行 SQL 脚本来 初始化 嵌入式或现有数据库的支持。 有关详细信息，请参阅 嵌入式数据库支持 和 使用嵌入式数据库测试数据访问逻辑。 虽然在加载 ApplicationContext 时初始化数据库 一次 非常有用，但有时必须能够在集成测试 期间 修改数据库。 以下部分说明了如何在集成测试期间以编程方式和声明方式运行 SQL 脚本。

#### 以编程方式执行 SQL 脚本

Infra 提供了以下选项，用于在集成测试方法中以编程方式执行 SQL 脚本。 ScriptUtils 提供了一组用于处理 SQL 脚本的静态实用程序方法，主要供框架内部使用。 但是，如果您需要完全控制 SQL 脚本的解析和运行方式，ScriptUtils 可能比后面描述的其他一些替代方案更适合您的需求。 有关更多详细信息，请参阅 ScriptUtils 中各个方法的 javadoc。 ResourceDatabasePopulator 提供了一个基于对象的 API，用于使用外部资源中定义的 SQL 脚本以编程方式填充、初始化或清理数据库。 ResourceDatabasePopulator 提供了用于配置解析和运行脚本时使用的字符编码、语句分隔符、注释定界符和错误处理标志的选项。 每个配置选项都有一个合理的默认值。 有关默认值的详细信息，请参阅 javadoc。 要运行在 Resourc

```java
@Test
void databaseTest() {
  ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
  populator.addScripts(
      new ClassPathResource("test-schema.sql"),
      new ClassPathResource("test-data.sql"));
  populator.setSeparator("@@");
  populator.execute(this.dataSource);
  // 运行使用测试架构和数据的代码
}
```

##### 路径资源语义

每个路径都解释为 Infra Resource。 普通路径（例如，"schema.sql"）被视为相对于定义测试类的包的类路径资源。 以斜杠开头的路径被视为绝对类路径资源（例如，"/org/example/schema.sql"）。 引用 URL 的路径（例如，以 classpath:、file:、http: 为前缀的路径）使用指定的资源协议加载。 以下示例显示了如何在基于 JUnit Jupiter 的集成测试类中在类级别和方法级别使用 @Sql：

```java
@JUnitConfig
@Sql("/test-schema.sql")
class DatabaseTests {

  @Test
  void emptySchemaTest() {
    // 运行使用测试架构但不包含任何测试数据的代码
  }

  @Test
  @Sql({"/test-schema.sql", "/test-user-data.sql"})
  void userTest() {
    // 运行使用测试架构和测试数据的代码
  }
}
```

##### 声明多个 @Sql 集

如果您需要为给定的测试类或测试方法配置多组 SQL 脚本，但具有不同的语法配置、不同的错误处理规则或每组不同的执行阶段，则可以声明多个 @Sql 实例。 您可以将 @Sql 用作可重复注解，也可以使用 @SqlGroup 注解作为声明多个 @Sql 实例的显式容器。 以下示例显示了如何将 @Sql 用作可重复注解：

##### 脚本执行阶段

默认情况下，SQL 脚本在相应的测试方法之前运行。 但是，如果您需要在测试方法之后运行一组特定的脚本（例如，为了清理数据库状态），您可以将 @Sql 中的 executionPhase 属性设置为 AFTERTESTMETHOD，如下例所示：

##### @Sql 的事务管理

默认情况下，SqlScriptsTestExecutionListener 推断使用 @Sql 配置的脚本所需的事务语义。 具体来说，SQL 脚本将在没有事务的情况下运行、在现有的 Infra 管理的事务中运行（例如，由 TransactionalTestExecutionListener 管理的用于使用 @Transactional 注解的测试的事务），或在隔离的事务中运行，这取决于 @SqlConfig 中 transactionMode 属性的配置值以及测试的 ApplicationContext 中是否存在 PlatformTransactionManager。 然而，作为最低要求，测试的 ApplicationContext 中必须存在 javax.sql.DataSource。 如果 SqlScriptsTestExecutionListener 用于检测 DataSource

## 测试夹具的依赖注入

> 原文：[`testing/testcontext-framework/fixture-di`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/fixture-di.adoc)

### 概述

当您使用 DependencyInjectionTestExecutionListener（默认配置）时，测试实例的依赖项将从您使用 @ContextConfiguration 或相关注解配置的应用程序上下文中的 Bean 注入。 您可以使用 setter 注入、字段注入或两者兼用，具体取决于您选择的注解以及将它们放置在 setter 方法还是字段上。 如果您使用的是 JUnit Jupiter，您还可以选择使用构造函数注入 （请参阅 使用 InfraExtension 的依赖注入）。 为了与 Infra 基于注解的注入支持保持一致，您还可以使用 Infra 的 @Autowired 注解或 JSR-330 中的 @Inject 注解进行字段和 setter 注入。 TIP: 对于 JUnit Jupiter 以外的测试框架，TestContext 框架不参与测试类的实例化。 因此，对构造

```java
@ExtendWith(InfraExtension.class)
// 指定为此测试夹具加载的 Infra 配置
@ContextConfiguration("repository-config.xml")
class HibernateTitleRepositoryTests {

  // 这个实例将通过类型进行依赖注入
  @Autowired
  HibernateTitleRepository titleRepository;

  @Test
  void findById() {
    Title title = titleRepository.findById(new Long(10));
    assertNotNull(title);
  }
}
```

## 关键抽象

> 原文：[`testing/testcontext-framework/key-abstractions`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/key-abstractions.adoc)

### 概述

框架的核心由 TestContextManager 类以及 TestContext、TestExecutionListener 和 SmartContextLoader 接口组成。 TestContextManager 为每个测试类创建（例如，在 JUnit Jupiter 中执行单个测试类内的所有测试方法）。 TestContextManager 反过来管理一个持有当前测试上下文的 TestContext。 TestContextManager 还会随着测试的进行更新 TestContext 的状态，并委托给 TestExecutionListener 实现，这些实现通过提供依赖注入、管理事务等来增强实际的测试执行。 SmartContextLoader 负责为给定的测试类加载 ApplicationContext。 有关更多信息和各种实现的示例，请参阅 javadoc 和 Infra 

## 并行测试执行

> 原文：[`testing/testcontext-framework/parallel-test-execution`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/parallel-test-execution.adoc)

### 概述

TODAY Framework 5.0 引入了在使用 Infra TestContext 框架时在单个 JVM 中并行执行测试的基本支持。 通常，这意味着大多数测试类或测试方法可以并行运行，而无需更改测试代码或配置。 TIP: 有关如何设置并行测试执行的详细信息，请参阅测试框架、构建工具或 IDE 的文档。 请记住，在测试套件中引入并发可能会导致意外的副作用、奇怪的运行时行为以及测试间歇性或看似随机地失败。 因此，Infra 团队针对何时不并行运行测试提供了以下一般准则。 如果测试符合以下情况，请勿并行运行测试： 但是，请注意，如果整个测试类并行运行，则这不适用。 这适用于嵌入式和外部系统。 如果并行测试执行失败并出现说明当前测试的 ApplicationContext 不再处于活动状态的异常，这通常意味着 ApplicationContext 已在另一个线程中从 ContextCache

## TestContext 框架支持类

> 原文：[`testing/testcontext-framework/support-classes`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/support-classes.adoc)

### 概述

本节描述了支持 Infra TestContext 框架的各种类。

#### JUnit Jupiter 的 InfraExtension

Infra TestContext 框架提供了与 JUnit 5 中引入的 JUnit Jupiter 测试框架的完全集成。 通过使用 @ExtendWith(InfraExtension.class) 注解测试类，您可以实现基于标准 JUnit Jupiter 的单元测试和集成测试，同时获得 TestContext 框架的好处，例如支持加载应用程序上下文、测试实例的依赖注入、事务性测试方法执行等。 此外，由于 JUnit Jupiter 中丰富的扩展 API，Infra 提供了以下功能，超越了 Infra 为 JUnit 4 和 TestNG 支持的功能集： 有关更多详细信息，请参阅 使用 InfraExtension 的依赖注入。 有关更多详细信息和示例，请参阅 Infra JUnit Jupiter 测试注解 中的 @EnabledIf 和 @DisabledIf 文档。 有关更多详

```java
// 指示 JUnit Jupiter 使用 Infra 支持扩展测试。
@ExtendWith(InfraExtension.class)
// 指示 Infra 从 TestConfig.class 加载 ApplicationContext
@ContextConfiguration(classes = TestConfig.class)
class SimpleTests {

  @Test
  void testMethod() {
    // 测试逻辑...
  }
}
```

##### 构造函数注入

如果 JUnit Jupiter 测试类的构造函数中的特定参数类型为 ApplicationContext（或其子类型），或者使用 @Autowired、@Qualifier 或 @Value 进行了注解或元注解，Infra 将使用测试的 ApplicationContext 中的相应 Bean 或值注入该特定参数。 如果测试类构造函数被认为是 可自动装配的 (autowirable)，Infra 也可以配置为自动装配该构造函数的所有参数。 如果满足以下条件之一（按优先顺序），则构造函数被认为是可自动装配的。 有关使用 @TestConstructor 以及如何更改全局 测试构造函数自动装配模式 的详细信息，请参阅 @TestConstructor。 WARNING: 如果测试类的构造函数被认为是 可自动装配的，Infra 将承担解析构造函数中所有参数的责任。 因此，向 JUnit Jup

```java
@JUnitConfig(TestConfig.class)
class OrderServiceIntegrationTests {

  private final OrderService orderService;

  @Autowired
  OrderServiceIntegrationTests(OrderService orderService) {
    this.orderService = orderService;
  }

  // 使用注入的 OrderService 的测试
}
```

##### 方法注入

如果 JUnit Jupiter 测试方法或测试生命周期回调方法中的参数类型为 ApplicationContext（或其子类型），或者使用 @Autowired、@Qualifier 或 @Value 进行了注解或元注解，Infra 将使用测试的 ApplicationContext 中的相应 Bean 注入该特定参数的值。 在以下示例中，Infra 将从 TestConfig.class 加载的 ApplicationContext 中的 OrderService 注入到 deleteOrder() 测试方法中：

##### @Nested 测试类配置

Infra TestContext 框架 支持在 JUnit Jupiter 中的 @Nested 测试类上使用测试相关注解； 引入了对从封闭类继承测试类配置的一流支持，默认情况下将继承此类配置。 要将默认的 INHERIT 模式更改为 OVERRIDE 模式，您可以使用 @NestedTestConfiguration(EnclosingConfiguration.OVERRIDE) 注解单个 @Nested 测试类。 显式 @NestedTestConfiguration 声明将应用于带注解的测试类及其任何子类和嵌套类。 因此，您可以使用 @NestedTestConfiguration 注解顶级测试类，这将递归应用于其所有嵌套测试类。 为了允许开发团队将默认值更改为 OVERRIDE——例如，为了与 TODAY Framework 5.0 到 5.2 兼容——可以通过 JVM 系统属

## TestExecutionListener 配置

> 原文：[`testing/testcontext-framework/tel-config`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/tel-config.adoc)

### 概述

Infra 提供了以下默认注册的 TestExecutionListener 实现，顺序如下：

#### 注册 TestExecutionListener 实现

您可以使用 @TestExecutionListeners 注解为测试类、其子类及其嵌套类显式注册 TestExecutionListener 实现。 有关详细信息和示例，请参阅 注解支持 和 @TestExecutionListeners 的 javadoc。 如果您扩展了一个使用 @TestExecutionListeners 注解的类，并且需要切换到使用默认的监听器集，则可以使用以下内容注解您的类。

```java
// 切换到默认监听器
@TestExecutionListeners(
  listeners = {},
  inheritListeners = false,
  mergeMode = MERGE_WITH_DEFAULTS)
class MyTest extends BaseTest {
  // 类体...
}
```

#### 合并 TestExecutionListener 实现

如果通过 @TestExecutionListeners 注册了自定义 TestExecutionListener，则不会注册默认监听器。 在大多数常见的测试场景中，这实际上迫使开发人员除了任何自定义监听器之外，还要手动声明所有默认监听器。 以下清单演示了这种配置风格：

```java
@ContextConfiguration
@TestExecutionListeners({
  MyCustomTestExecutionListener.class,
  ServletTestExecutionListener.class,
  DirtiesContextBeforeModesTestExecutionListener.class,
  DependencyInjectionTestExecutionListener.class,
  DirtiesContextTestExecutionListener.class,
  TransactionalTestExecutionListener.class,
  SqlScriptsTestExecutionListener.class
})
class MyTest {
  // 类体...
}
```

## 测试执行事件

> 原文：[`testing/testcontext-framework/test-execution-events`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/test-execution-events.adoc)

### 概述

TODAY Framework 5.2 中引入的 EventPublishingTestExecutionListener 提供了一种实现自定义 TestExecutionListener 的替代方法。 测试的 ApplicationContext 中的组件可以监听由 EventPublishingTestExecutionListener 发布的以下事件，每个事件对应于 TestExecutionListener API 中的一个方法。 消费这些事件可能有各种原因，例如重置模拟 Bean 或跟踪测试执行。 消费测试执行事件而不是实现自定义 TestExecutionListener 的一个优点是，测试执行事件可以由在测试 ApplicationContext 中注册的任何 Infra Bean 消费，并且这些 Bean 可以直接受益于依赖注入和 ApplicationContext 的其

## 事务管理

> 原文：[`testing/testcontext-framework/tx`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/tx.adoc)

### 概述

在 TestContext 框架中，事务由 TransactionalTestExecutionListener 管理，即使您未在测试类上显式声明 @TestExecutionListeners，默认情况下也会配置该监听器。 但是，要启用对事务的支持，您必须在通过 @ContextConfiguration 语义加载的 ApplicationContext 中配置 PlatformTransactionManager Bean（稍后将提供更多详细信息）。 此外，您必须在测试的类或方法级别声明 Infra @Transactional 注解。

#### 启用和禁用事务

使用 @Transactional 注解测试方法会导致测试在事务中运行，默认情况下，该事务在测试完成后自动回滚。 如果使用 @Transactional 注解测试类，则该类层次结构中的每个测试方法都在事务中运行。 未（在类或方法级别）使用 @Transactional 注解的测试方法不在事务中运行。 请注意，测试生命周期方法不支持 @Transactional——例如，使用 JUnit Jupiter 的 @BeforeAll、@BeforeEach 等注解的方法。 此外，使用 @Transactional 注解但将 propagation 属性设置为 NOT_SUPPORTED 或 NEVER 的测试不在事务中运行。 方法级生命周期方法——例如，使用 JUnit Jupiter 的 @BeforeEach 或 @AfterEach 注解的方法——在测试管理的事务中运行。 另一方面，套件级

```java
@JUnitConfig(TestConfig.class)
@Transactional
class HibernateUserRepositoryTests {

  @Autowired
  HibernateUserRepository repository;

  @Autowired
  SessionFactory sessionFactory;

  JdbcTemplate jdbcTemplate;

  @Autowired
  void setDataSource(DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  @Test
  void createUser() {
    // 跟踪测试数据库中的初始状态：
    final int count = countRowsInTable("user");

    User user = new User(...);
    repository.save(user);

    // 需要手动刷新以避免测试中的误报
    sessionFactory.getCurrentSession().flush();
    assertNumUsers(count + 1);
  }

  private int countRowsInTable(String tableName) {
    return JdbcTestUtils.countRowsInTable(this.jdbcTemplate, tableName);
  }

  private void assertNumUsers(int expected) {
    assertEquals("Number of rows in the [user] table.", expected, countRowsInTable("user"));
  }
}
```

#### 编程式事务管理

您可以使用 TestTransaction 中的静态方法以编程方式与测试管理的事务进行交互。 例如，您可以在测试方法、before 方法和 after 方法中使用 TestTransaction 来开始或结束当前测试管理的事务，或者配置当前测试管理的事务以进行回滚或提交。 只要启用 TransactionalTestExecutionListener，就会自动提供对 TestTransaction 的支持。 以下示例演示了 TestTransaction 的一些功能。 有关更多详细信息，请参阅 TestTransaction 的 javadoc。

```java
@ContextConfiguration(classes = TestConfig.class)
public class ProgrammaticTransactionManagementTests extends
    AbstractTransactionalJUnit4InfraContextTests {

  @Test
  public void transactionalTest() {
    // 断言测试数据库中的初始状态：
    assertNumUsers(2);

    deleteFromTables("user");

    // 对数据库的更改将被提交！
    TestTransaction.flagForCommit();
    TestTransaction.end();
    assertFalse(TestTransaction.isActive());
    assertNumUsers(0);

    TestTransaction.start();
    // 针对数据库执行其他操作，这些操作将在测试完成后自动回滚...
  }

  protected void assertNumUsers(int expected) {
    assertEquals("Number of rows in the [user] table.", expected, countRowsInTable("user"));
  }
}
```

#### 在事务之外运行代码

有时，您可能需要在事务性测试方法之前或之后但在事务上下文之外运行某些代码——例如，在运行测试之前验证初始数据库状态，或在测试运行之后验证预期的事务提交行为（如果测试配置为提交事务）。 TransactionalTestExecutionListener 支持 @BeforeTransaction 和 @AfterTransaction 注解，正是为了这种场景。 您可以使用这些注解之一注解测试类中的任何 void 方法或测试接口中的任何 void 默认方法，并且 TransactionalTestExecutionListener 确保您的事务前方法或事务后方法在适当的时间运行。 一般来说，@BeforeTransaction 和 @AfterTransaction 方法不得接受任何参数。 但是，从 TODAY Framework 6.1 开始，对于在 JUnit Jupiter 中使用 I

#### 所有事务相关注解的演示

以下基于 JUnit Jupiter 的示例展示了一个虚构的集成测试场景，突出显示了所有与事务相关的注解。 该示例并非旨在演示最佳实践，而是为了演示如何使用这些注解。 有关更多信息和配置示例，请参阅 注解支持 部分。 @Sql 的事务管理 包含一个额外的示例，该示例使用 @Sql 进行具有默认事务回滚语义的声明性 SQL 脚本执行。 以下示例显示了相关的注解：

## 测试请求和会话作用域的 Bean

> 原文：[`testing/testcontext-framework/web-scoped-beans`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing/testcontext-framework/web-scoped-beans.adoc)

### 概述

Infra 自早期以来一直支持 请求和会话作用域的 Bean，您可以按照以下步骤测试请求作用域和会话作用域的 Bean： 下一个代码片段显示了登录用例的 XML 配置。 请注意，userService Bean 依赖于请求作用域的 loginAction Bean。 此外，LoginAction 是使用 SpEL 表达式 实例化的，该表达式从当前 HTTP 请求中检索用户名和密码。 在我们的测试中，我们希望通过 TestContext 框架管理的模拟对象配置这些请求参数。 以下清单显示了此用例的配置：

```xml
<beans>

  <bean id="userService" class="com.example.SimpleUserService"
      c:loginAction-ref="loginAction"/>

  <bean id="loginAction" class="com.example.LoginAction"
      c:username="#{request.getParameter('user')}"
      c:password="#{request.getParameter('pswd')}"
      scope="request">
    <aop:scoped-proxy/>
  </bean>

</beans>
```

## 测试

> 原文：[`testing`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/testing.adoc)

### 概述

本章涵盖了集成测试的基础设施支持以及单元测试最佳实践。

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
