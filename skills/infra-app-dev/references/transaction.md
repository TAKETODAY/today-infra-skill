# 事务管理

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

声明式与编程式事务、传播行为、回滚规则、事务事件。

覆盖文档：20 页（含示例 10 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- 事务管理 —— `data-access/transaction`
- 应用服务器特定集成 —— `data-access/transaction/application-server-integration`
- 声明式事务管理 —— `data-access/transaction/declarative`
- **使用 @Transactional** —— `data-access/transaction/declarative/annotations`
- **通知的事务操作** —— `data-access/transaction/declarative/applying-more-than-just-tx-advice`
- **使用 @Transactional 与 AspectJ** —— `data-access/transaction/declarative/aspectj`
- **为不同的 Bean 配置不同的事务语义** —— `data-access/transaction/declarative/diff-tx`
- **声明式事务实现示例** —— `data-access/transaction/declarative/first-example`
- **回滚声明式事务** —— `data-access/transaction/declarative/rolling-back`
- 理解 TODAY Framework 的声明式事务实现 —— `data-access/transaction/declarative/tx-decl-explained`
- 事务传播 —— `data-access/transaction/declarative/tx-propagation`
- <tx:advice/> 设置 —— `data-access/transaction/declarative/txadvice-settings`
- **事务绑定事件** —— `data-access/transaction/event`
- TODAY Framework 事务支持模型的优势 —— `data-access/transaction/motivation`
- **编程式事务管理** —— `data-access/transaction/programmatic`
- 更多资源 —— `data-access/transaction/resources`
- 常见问题解决方案 —— `data-access/transaction/solutions-to-common-problems`
- **理解 TODAY Framework 事务抽象** —— `data-access/transaction/strategies`
- 在编程式和声明式事务管理之间进行选择 —— `data-access/transaction/tx-decl-vs-prog`
- **将资源与事务同步** —— `data-access/transaction/tx-resource-synchronization`

## 事务管理

> 原文：[`data-access/transaction`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction.adoc)

### 概述

全面的事务支持是使用 Infra Framework 的最令人信服的理由之一。TODAY Framework 为事务管理提供了一致的抽象，具有以下优点： 以下部分描述了 TODAY Framework 的事务功能和技术： 本章还包括关于最佳实践、应用服务器集成 和 常见问题解决方案 的讨论。

## 应用服务器特定集成

> 原文：[`data-access/transaction/application-server-integration`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/application-server-integration.adoc)

### 概述

Infra 事务抽象通常与应用服务器无关。此外，Infra JtaTransactionManager 类（可以选择执行 JNDI 查找以获取 JTA UserTransaction 和 TransactionManager 对象）会自动检测后者的位置，该位置因应用服务器而异。访问 JTA TransactionManager 允许增强事务语义——特别是支持事务挂起。有关详细信息，请参阅 JtaTransactionManager javadoc。 Infra JtaTransactionManager 是在 Jakarta EE 应用服务器上运行的标准选择，并且已知可在所有常见服务器上运行。高级功能（例如事务挂起）也可以在许多服务器上运行（包括 GlassFish、JBoss 和 Geronimo），无需任何特殊配置。

## 声明式事务管理

> 原文：[`data-access/transaction/declarative`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative.adoc)

### 概述

NOTE: 大多数 TODAY Framework 用户选择声明式事务管理。此选项对应用程序代码的影响最小，因此最符合非侵入式轻量级容器的理想。 TODAY Framework 的声明式事务管理是通过 Infra 面向切面编程 (AOP) 实现的。但是，由于事务切面代码随 TODAY Framework 分发版一起提供，并且可能以样板方式使用，因此通常不需要了解 AOP 概念即可有效使用此代码。 TODAY Framework 的声明式事务管理类似于 EJB CMT，您可以指定事务行为（或不指定）直到单个方法级别。如果需要，您可以在事务上下文中进行 setRollbackOnly() 调用。两种类型的事务管理之间的区别在于： 回滚规则的概念很重要。它们允许您指定哪些异常（和 throwable）应导致自动回滚。您可以在配置中以声明方式指定此项，而不是在 Java 代码中。因此，尽管您仍然可

## 使用 @Transactional

> 原文：[`data-access/transaction/declarative/annotations`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/annotations.adoc)

### 概述

除了基于 XML 的声明式事务配置方法外，您还可以使用基于注解的方法。直接在 Java 源代码中声明事务语义，使声明更接近受影响的代码。由于旨在以事务方式使用的代码几乎总是以这种方式部署，因此不存在过度耦合的危险。 NOTE: 标准的 jakarta.transaction.Transactional 注解也支持作为 Infra 自身注解的替代品。有关更多详细信息，请参阅 JTA 文档。 使用 @Transactional 注解所带来的易用性最好通过一个示例来说明，该示例将在后面的文本中解释。 考虑以下类定义：

```java
// 我们想要使其具有事务性的服务类
@Transactional
public class DefaultFooService implements FooService {

  @Override
  public Foo getFoo(String fooName) {
    // ...
  }

  @Override
  public Foo getFoo(String fooName, String barName) {
    // ...
  }

  @Override
  public void insertFoo(Foo foo) {
    // ...
  }

  @Override
  public void updateFoo(Foo foo) {
    // ...
  }
}
```

#### 多个事务管理器与 @Transactional

大多数 Infra 应用程序只需要一个事务管理器，但在某些情况下，您可能希望在单个应用程序中使用多个独立的事务管理器。您可以使用 @Transactional 注解的 value 或 transactionManager 属性来选择性地指定要使用的 TransactionManager 的标识。这可以是事务管理器 bean 的 bean 名称或限定符值。例如，使用限定符表示法，您可以将以下 Java 代码与应用程序上下文中的以下事务管理器 bean 声明结合使用：

```java
public class TransactionalService {

  @Transactional("order")
  public void setSomething(String name) { ... }

  @Transactional("account")
  public void doSomething() { ... }

  @Transactional("reactive-account")
  public Mono<Void> doSomethingReactive() { ... }
}
```

#### 自定义组合注解

如果您发现自己在许多不同方法上重复使用具有相同属性的 @Transactional，Infra 元注解支持 允许您为特定用例定义自定义组合注解。例如，考虑以下注解定义：

## 通知的事务操作

> 原文：[`data-access/transaction/declarative/applying-more-than-just-tx-advice`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/applying-more-than-just-tx-advice.adoc)

### 概述

假设您想运行事务操作和一些基本的性能分析通知。如何在 <tx:annotation-driven/> 的上下文中实现这一点？ 当您调用 updateFoo(Foo) 方法时，您希望看到以下操作： NOTE: 本章不打算非常详细地解释 AOP（除了它适用于事务）。有关 AOP 配置和一般 AOP 的详细介绍，请参阅 AOP。 以下代码显示了前面讨论的简单性能分析切面：

```java
package x.y;

import org.aspectj.lang.ProceedingJoinPoint;
import infra.util.StopWatch;
import infra.core.Ordered;

public class SimpleProfiler implements Ordered {

  private int order;

  // 允许我们要控制通知的顺序
  public int getOrder() {
    return this.order;
  }

  public void setOrder(int order) {
    this.order = order;
  }

  // 此方法是环绕通知
  public Object profile(ProceedingJoinPoint call) throws Throwable {
    Object returnValue;
    StopWatch clock = new StopWatch(getClass().getName());
    try {
      clock.start(call.toShortString());
      returnValue = call.proceed();
    } finally {
      clock.stop();
      System.out.println(clock.prettyPrint());
    }
    return returnValue;
  }
}
```

## 使用 @Transactional 与 AspectJ

> 原文：[`data-access/transaction/declarative/aspectj`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/aspectj.adoc)

### 概述

您还可以通过 AspectJ 切面在 Infra 容器之外使用 TODAY Framework 的 @Transactional 支持。为此，首先使用 @Transactional 注解来注解您的类（以及可选的类的方法），然后将您的应用程序与 infra-aspects.jar 文件中定义的 infra.transaction.aspectj.AnnotationTransactionAspect 链接（编织）。您还必须使用事务管理器配置切面。您可以使用 TODAY Framework 的 IoC 容器来处理切面的依赖注入。配置事务管理切面的最简单方法是使用 <tx:annotation-driven/> 元素并将 mode 属性指定为 aspectj，如 使用 @Transactional 中所述。因为我们这里关注的是在 Infra 容器之外运行的应用程序，所以我们将向您展示如何以编程方

```java
	// 构造一个合适的事务管理器
	DataSourceTransactionManager txManager = new DataSourceTransactionManager(getDataSource());

	// 配置 AnnotationTransactionAspect 以使用它；这必须在执行任何事务方法之前完成
	AnnotationTransactionAspect.aspectOf().setTransactionManager(txManager);
```

## 为不同的 Bean 配置不同的事务语义

> 原文：[`data-access/transaction/declarative/diff-tx`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/diff-tx.adoc)

### 概述

考虑这样一种情况：您有许多服务层对象，并且希望对每个对象应用完全不同的事务配置。您可以通过定义具有不同 pointcut 和 advice-ref 属性值的不同 <aop:advisor/> 元素来实现。 作为比较点，首先假设您所有的服务层类都在根 x.y.service 包中定义。为了使在该包（或子包）中定义且名称以 Service 结尾的所有 bean 都具有默认事务配置，您可以编写以下内容：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:aop="http://www.springframework.org/schema/aop"
  xmlns:tx="http://www.springframework.org/schema/tx"
  xsi:schemaLocation="
    http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/tx
    https://www.springframework.org/schema/tx/spring-tx.xsd
    http://www.springframework.org/schema/aop
    https://www.springframework.org/schema/aop/spring-aop.xsd">

  <aop:config>

    <aop:pointcut id="serviceOperation"
        expression="execution(* x.y.service..*Service.*(..))"/>

    <aop:advisor pointcut-ref="serviceOperation" advice-ref="txAdvice"/>

  </aop:config>

  <!-- 这两个 bean 将是事务性的... -->
  <bean id="fooService" class="x.y.service.DefaultFooService"/>
  <bean id="barService" class="x.y.service.extras.SimpleBarService"/>

  <!-- ... 而这两个 bean 不会 -->
  <bean id="anotherService" class="org.xyz.SomeService"/> <!-- (不在正确的包中) -->
  <bean id="barManager" class="x.y.service.SimpleBarManager"/> <!-- (不以 'Service' 结尾) -->

  <tx:advice id="txAdvice">
    <tx:attributes>
      <tx:method name="get*" read-only="true"/>
      <tx:method name="*"/>
    </tx:attributes>
  </tx:advice>

  <!-- 省略了其他事务基础设施 bean，例如 TransactionManager... -->

</beans>
```

## 声明式事务实现示例

> 原文：[`data-access/transaction/declarative/first-example`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/first-example.adoc)

### 概述

考虑以下接口及其附带的实现。此示例使用 Foo 和 Bar 类作为占位符，以便您可以专注于事务使用， 而无需关注特定的领域模型。就本示例而言，DefaultFooService 类在每个实现方法的主体中抛出 UnsupportedOperationException 实例是件好事。该行为让您可以看到事务被创建，然后响应 UnsupportedOperationException 实例而回滚。以下清单显示了 FooService 接口：

```java
// 我们想要使其具有事务性的服务接口

package x.y.service;

public interface FooService {

  Foo getFoo(String fooName);

  Foo getFoo(String fooName, String barName);

  void insertFoo(Foo foo);

  void updateFoo(Foo foo);

}
```

## 回滚声明式事务

> 原文：[`data-access/transaction/declarative/rolling-back`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/rolling-back.adoc)

### 概述

上一节概述了如何在应用程序中以声明方式为类（通常是服务层类）指定事务设置的基础知识。本节描述如何以 XML 配置中简单、声明式的方式控制事务的回滚。有关使用 @Transactional 注解以声明方式控制回滚语义的详细信息，请参阅 @Transactional 设置。 向 TODAY Framework 的事务基础设施指示事务工作要回滚的推荐方法是从当前在事务上下文中执行的代码中抛出 Exception。TODAY Framework 的事务基础设施代码会捕获任何未处理的 Exception，因为它会冒泡调用堆栈，并确定是否将事务标记为回滚。 在其默认配置中，TODAY Framework 的事务基础设施代码仅在运行时、未检查异常的情况下将事务标记为回滚。也就是说，当抛出的异常是 RuntimeException 的实例或子类时。（默认情况下，Error 实例也会导致回滚）。 从事务方法

```xml
<tx:advice id="txAdvice" transaction-manager="txManager">
  <tx:attributes>
    <tx:method name="get*" read-only="true" rollback-for="NoProductInStockException"/>
    <tx:method name="*"/>
  </tx:attributes>
</tx:advice>
```

## 理解 TODAY Framework 的声明式事务实现

> 原文：[`data-access/transaction/declarative/tx-decl-explained`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/tx-decl-explained.adoc)

### 概述

仅仅告诉您用 @Transactional 注解来注解您的类，将 @EnableTransactionManagement 添加到您的配置中，并期望您了解这一切是如何工作的，这还不够。为了提供更深入的理解，本节在事务相关问题的背景下解释了 TODAY Framework 声明式事务基础设施的内部工作原理。 关于 TODAY Framework 的声明式事务支持，要掌握的最重要概念是，此支持是 通过 AOP 代理 启用的，并且事务通知是由元数据（目前基于 XML 或注解）驱动的。AOP 与事务元数据的组合产生了一个 AOP 代理，该代理使用 TransactionInterceptor 与适当的 TransactionManager 实现相结合，以围绕方法调用驱动事务。 NOTE: Infra AOP 在 AOP 部分 中介绍。 TODAY Framework 的 TransactionIn

## 事务传播

> 原文：[`data-access/transaction/declarative/tx-propagation`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/tx-propagation.adoc)

### 概述

本节描述 Infra 中事务传播的一些语义。请注意，本节不是对事务传播的适当介绍。相反，它详细介绍了 Infra 中有关事务传播的一些语义。 在 Infra 管理的事务中，请注意物理事务和逻辑事务之间的区别，以及传播设置如何应用于此差异。

## <tx:advice/> 设置

> 原文：[`data-access/transaction/declarative/txadvice-settings`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/declarative/txadvice-settings.adoc)

### 概述

本节总结了可以使用 <tx:advice/> 标签指定的各种事务设置。默认的 <tx:advice/> 设置为： 您可以更改这些默认设置。下表总结了嵌套在 <tx:advice/> 和 <tx:attributes/> 标签中的 <tx:method/> 标签的各种属性：

## 事务绑定事件

> 原文：[`data-access/transaction/event`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/event.adoc)

### 概述

从 Infra 4.0 开始，事件的监听器可以绑定到事务的某个阶段。典型的例子是在事务成功完成后处理事件。这使得当当前事务的结果对监听器实际上很重要时，可以更灵活地使用事件。 您可以使用 @EventListener 注解注册常规事件监听器。如果您需要将其绑定到事务，请使用 @TransactionalEventListener。当您这样做时，默认情况下，监听器绑定到事务的提交阶段。 下一个示例展示了这个概念。假设一个组件发布了一个订单创建事件，我们要定义一个监听器，该监听器应仅在发布该事件的事务成功提交后才处理该事件。以下示例设置了这样一个事件监听器：

```java
  @Component
  public class MyComponent {

    @TransactionalEventListener
    public void handleOrderCreatedEvent(CreationEvent<Order> creationEvent) {
      // ...
    }
  }
```

## TODAY Framework 事务支持模型的优势

> 原文：[`data-access/transaction/motivation`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/motivation.adoc)

### 概述

传统上，EE 应用程序开发人员在事务管理方面有两种选择：全局事务或本地事务，但这两种选择都有深刻的局限性。接下来的两节将回顾全局和本地事务管理，然后讨论 TODAY Framework 的事务管理支持如何解决全局和本地事务模型的局限性。

## 编程式事务管理

> 原文：[`data-access/transaction/programmatic`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/programmatic.adoc)

### 概述

TODAY Framework 提供了两种编程式事务管理的方法，通过使用： Infra 团队通常建议使用 TransactionTemplate 进行命令式流中的编程式事务管理， 并建议使用 TransactionalOperator 进行响应式代码。 第二种方法类似于使用 JTA UserTransaction API，尽管异常处理不那么繁琐。

#### 使用 TransactionTemplate

TransactionTemplate 采用与其他 Infra 模板（如 JdbcTemplate）相同的方法。 它使用回调方法（使应用程序代码免于执行样板化的获取和释放事务资源），并产生意图驱动的代码， 即您的代码仅专注于您想要做的事情。 NOTE: 如下面的示例所示，使用 TransactionTemplate 绝对会将您耦合到 Infra 事务基础设施和 API。 编程式事务管理是否适合您的开发需求是您必须自己做出的决定。 必须在事务上下文中运行并显式使用 TransactionTemplate 的应用程序代码类似于下一个示例。 作为应用程序开发人员，您可以编写一个 TransactionCallback 实现（通常表示为匿名内部类）， 其中包含您需要在事务上下文中运行的代码。然后，您可以将自定义 TransactionCallback 的实例传递给 TransactionTempl

```java
public class SimpleService implements Service {

  // 在此实例的所有方法之间共享的单个 TransactionTemplate
  private final TransactionTemplate transactionTemplate;

  // 使用构造函数注入来提供 PlatformTransactionManager
  public SimpleService(PlatformTransactionManager transactionManager) {
    this.transactionTemplate = new TransactionTemplate(transactionManager);
  }

  public Object someServiceMethod() {
    return transactionTemplate.execute(new TransactionCallback() {
      // 此方法中的代码在事务上下文中运行
      public Object doInTransaction(TransactionStatus status) {
        updateOperation1();
        return resultOfUpdateOperation2();
      }
    });
  }
}
```

##### 指定事务设置

您可以通过编程方式或在配置中指定 TransactionTemplate 上的事务设置（例如传播模式、隔离级别、超时等）。 默认情况下，TransactionTemplate 实例具有 默认事务设置。 以下示例显示了特定 TransactionTemplate 的事务设置的编程式自定义：

```java
public class SimpleService implements Service {

  private final TransactionTemplate transactionTemplate;

  public SimpleService(PlatformTransactionManager transactionManager) {
    this.transactionTemplate = new TransactionTemplate(transactionManager);

    // 如果需要，可以在此处显式设置事务设置
    this.transactionTemplate.setIsolationLevel(TransactionDefinition.ISOLATION_READ_UNCOMMITTED);
    this.transactionTemplate.setTimeout(30); // 30 seconds
    // 等等...
  }
}
```

#### 使用 TransactionalOperator

TransactionalOperator 遵循类似于其他响应式操作符的操作符设计。它使用回调方法 （使应用程序代码免于执行样板化的获取和释放事务资源），并产生意图驱动的代码， 即您的代码仅专注于您想要做的事情。 NOTE: 如下面的示例所示，使用 TransactionalOperator 绝对会将您耦合到 Infra 事务基础设施和 API。 编程式事务管理是否适合您的开发需求是您必须自己做出的决定。 必须在事务上下文中运行并显式使用 TransactionalOperator 的应用程序代码类似于下一个示例：

##### 指定事务设置

您可以为 TransactionalOperator 指定事务设置（例如传播模式、隔离级别、超时等）。 默认情况下，TransactionalOperator 实例具有 默认事务设置。 以下示例显示了特定 TransactionalOperator 的事务设置的自定义：

##### 使用 PlatformTransactionManager

对于命令式事务，您可以直接使用 infra.transaction.PlatformTransactionManager 来管理您的事务。 为此，请通过 bean 引用将您使用的 PlatformTransactionManager 的实现传递给您的 bean。 然后，通过使用 TransactionDefinition 和 TransactionStatus 对象，您可以启动事务、回滚和提交。 以下示例展示了如何执行此操作：

##### 使用 ReactiveTransactionManager

在使用响应式事务时，您可以直接使用 infra.transaction.ReactiveTransactionManager 来管理您的事务。 为此，请通过 bean 引用将您使用的 ReactiveTransactionManager 的实现传递给您的 bean。 然后，通过使用 TransactionDefinition 和 ReactiveTransaction 对象，您可以启动事务、回滚和提交。 以下示例展示了如何执行此操作：

## 更多资源

> 原文：[`data-access/transaction/resources`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/resources.adoc)

### 概述

如需了解 TODAY Framework 事务支持的更多信息，请参阅：

## 常见问题解决方案

> 原文：[`data-access/transaction/solutions-to-common-problems`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/solutions-to-common-problems.adoc)

### 概述

本节介绍一些常见问题的解决方案。

## 理解 TODAY Framework 事务抽象

> 原文：[`data-access/transaction/strategies`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/strategies.adoc)

### 概述

Infra 事务抽象的关键是事务策略的概念。事务策略由 TransactionManager 定义，具体来说，用于命令式事务管理的 infra.transaction.PlatformTransactionManager 接口和用于响应式事务管理的 infra.transaction.ReactiveTransactionManager 接口。以下清单显示了 PlatformTransactionManager API 的定义：

```java
public interface PlatformTransactionManager extends TransactionManager {

  TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException;

  void commit(TransactionStatus status) throws TransactionException;

  void rollback(TransactionStatus status) throws TransactionException;
}
```

## 在编程式和声明式事务管理之间进行选择

> 原文：[`data-access/transaction/tx-decl-vs-prog`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/tx-decl-vs-prog.adoc)

### 概述

仅当您有少量事务操作时，编程式事务管理通常才是一个好主意。例如，如果您有一个仅对某些更新操作需要事务的 Web 应用程序，则可能不想使用 Infra 或任何其他技术设置事务代理。在这种情况下，使用 TransactionTemplate 可能是一个好方法。能够显式设置事务名称也是只有使用编程式事务管理方法才能做到的事情。 另一方面，如果您的应用程序有大量事务操作，则声明式事务管理通常是值得的。它将事务管理排除在业务逻辑之外，并且不难配置。当使用 TODAY Framework 而不是 EJB CMT 时，声明式事务管理的配置成本大大降低。

## 将资源与事务同步

> 原文：[`data-access/transaction/tx-resource-synchronization`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/transaction/tx-resource-synchronization.adoc)

### 概述

现在应该清楚如何创建不同的事务管理器，以及如何将它们链接到需要与事务同步的相关资源（例如 DataSourceTransactionManager 到 JDBC DataSource，HibernateTransactionManager 到 Hibernate SessionFactory 等）。本节描述应用程序代码（直接或间接，通过使用诸如 JDBC、Hibernate 或 JPA 之类的持久性 API）如何确保正确创建、重用和清理这些资源。本节还讨论了如何通过相关的 TransactionManager（可选）触发事务同步。

#### 低级同步方法

诸如 DataSourceUtils（用于 JDBC）、EntityManagerFactoryUtils（用于 JPA）、SessionFactoryUtils（用于 Hibernate）等类存在于较低级别。当您希望应用程序代码直接处理原生持久性 API 的资源类型时，您使用这些类来确保获得正确的 TODAY Framework 管理的实例，事务被（可选）同步，并且过程中发生的异常被正确映射到一致的 API。 例如，在 JDBC 的情况下，您可以不使用在 DataSource 上调用 getConnection() 方法的传统 JDBC 方法，而是使用 Infra infra.jdbc.datasource.DataSourceUtils 类，如下所示：

```java
	Connection conn = DataSourceUtils.getConnection(dataSource);
```

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
