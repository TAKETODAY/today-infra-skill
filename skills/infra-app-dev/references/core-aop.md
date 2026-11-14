# AOP

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

切面、通知、切点、代理机制、@AspectJ 与编程式 API。

覆盖文档：30 页（含示例 20 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- AOP API —— `core/aop-api`
- **Infra 中的 Advice API** —— `core/aop-api/advice`
- **操作被通知对象** —— `core/aop-api/advised`
- Infra 中的 Advisor API —— `core/aop-api/advisor`
- **使用“自动代理”设施** —— `core/aop-api/autoproxy`
- **简洁的代理定义** —— `core/aop-api/concise-proxy`
- 定义新的 Advice 类型 —— `core/aop-api/extensibility`
- **使用 ProxyFactoryBean 创建 AOP 代理** —— `core/aop-api/pfb`
- **Infra 中的 Pointcut API** —— `core/aop-api/pointcuts`
- **使用 ProxyFactory 以编程方式创建 AOP 代理** —— `core/aop-api/prog`
- **使用 TargetSource 实现** —— `core/aop-api/targetsource`
- 面向切面编程 —— `core/aop`
- **编程式创建 @AspectJ 代理** —— `core/aop/aspectj-programmatic`
- @AspectJ 支持 —— `core/aop/ataspectj`
- **声明通知** —— `core/aop/ataspectj/advice`
- **启用 @AspectJ 支持** —— `core/aop/ataspectj/aspectj-support`
- **声明切面** —— `core/aop/ataspectj/at-aspectj`
- **AOP 示例** —— `core/aop/ataspectj/example`
- **切面实例化模型** —— `core/aop/ataspectj/instantiation-models`
- **引入** —— `core/aop/ataspectj/introductions`
- **声明切点** —— `core/aop/ataspectj/pointcuts`
- **选择使用哪种 AOP 声明风格** —— `core/aop/choosing`
- AOP 概念 —— `core/aop/introduction-defn`
- Infra AOP 的能力与目标 —— `core/aop/introduction-infra-defn`
- AOP 代理 —— `core/aop/introduction-proxies`
- 混合切面类型 —— `core/aop/mixing-styles`
- **代理机制** —— `core/aop/proxying`
- 更多资源 —— `core/aop/resources`
- **基于模式的 AOP 支持** —— `core/aop/schema`
- **在 Infra 应用程序中使用 AspectJ** —— `core/aop/using-aspectj`

## AOP API

> 原文：[`core/aop-api`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api.adoc)

### 概述

上一章描述了使用 @AspectJ 和基于 XML 的切面定义的 Infra AOP 支持。 在本章中，我们讨论更低层级的 Infra AOP API。对于常见的应用程序，我们建议使用上一章描述的 Infra AOP 与 AspectJ pointcut。

## Infra 中的 Advice API

> 原文：[`core/aop-api/advice`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/advice.adoc)

### 概述

现在我们可以通过检查 Infra AOP 如何处理 advice。

##### 拦截环绕 Advice

Infra 中最基本的 advice 类型是拦截环绕 advice。 Infra 符合 AOP Alliance 接口，用于使用方法拦截的环绕 advice。 实现 MethodInterceptor 并实现环绕 advice 的类也应该实现以下接口：

```java
public interface MethodInterceptor extends Interceptor {

  Object invoke(MethodInvocation invocation) throws Throwable;
}
```

##### 前置 Advice

一种更简单的 advice 类型是前置 advice。这不需要 MethodInvocation 对象，因为它仅在进入方法之前被调用。 前置 advice 的主要优点是不需要调用 proceed() 方法，因此不可能无意中未能沿着拦截器链继续。 以下清单显示了 MethodBeforeAdvice 接口：

```java
public interface MethodBeforeAdvice extends BeforeAdvice {

  void before(Method m, Object[] args, Object target) throws Throwable;
}
```

##### 抛出 Advice

如果连接点抛出异常，则在连接点返回后调用抛出 advice。Infra 提供类型化的抛出 advice。 请注意，这意味着 infra.aop.ThrowsAdvice 接口不包含任何方法。 它是一个标记接口，标识给定对象实现了一个或多个类型化的抛出 advice 方法。这些应采用以下形式：

##### 返回后 Advice

Infra 中的返回后 advice 必须实现 infra.aop.AfterReturningAdvice 接口，如下清单所示：

##### 引介 Advice

Infra 将引介 advice 视为一种特殊的拦截 advice。 引介需要一个 IntroductionAdvisor 和一个 IntroductionInterceptor，它们实现以下接口：

## 操作被通知对象

> 原文：[`core/aop-api/advised`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/advised.adoc)

### 概述

无论你如何创建 AOP 代理，你都可以通过使用 infra.aop.framework.Advised 接口来操作它们。 任何 AOP 代理都可以转换为此接口，无论它实现了哪些其他接口。此接口包括以下方法：

```java
Advisor[] getAdvisors();

void addAdvice(Advice advice) throws AopConfigException;

void addAdvice(int pos, Advice advice) throws AopConfigException;

void addAdvisor(Advisor advisor) throws AopConfigException;

void addAdvisor(int pos, Advisor advisor) throws AopConfigException;

int indexOf(Advisor advisor);

boolean removeAdvisor(Advisor advisor) throws AopConfigException;

void removeAdvisor(int index) throws AopConfigException;

boolean replaceAdvisor(Advisor a, Advisor b) throws AopConfigException;

boolean isFrozen();
```

## Infra 中的 Advisor API

> 原文：[`core/aop-api/advisor`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/advisor.adoc)

### 概述

在 Infra 中，Advisor 是一个仅包含与 pointcut 表达式关联的单个 advice 对象的切面。 除了引介的特殊情况外，任何 advisor 都可以与任何 advice 一起使用。 infra.aop.support.DefaultPointcutAdvisor 是最常用的 advisor 类。 它可以与 MethodInterceptor、BeforeAdvice 或 ThrowsAdvice 一起使用。 可以在同一个 AOP 代理中混合使用 Infra 中的 advisor 和 advice 类型。 例如，你可以在一个代理配置中使用拦截环绕 advice、抛出 advice 和前置 advice。 Infra 自动创建必要的拦截器链。

## 使用“自动代理”设施

> 原文：[`core/aop-api/autoproxy`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/autoproxy.adoc)

### 概述

到目前为止，我们已经考虑了通过使用 ProxyFactoryBean 或类似的工厂 bean 显式创建 AOP 代理。 Infra 还允许我们使用“自动代理” bean 定义，它可以自动代理选定的 bean 定义。 这是建立在 Infra “bean 后处理器”基础设施之上的，它允许在容器加载时修改任何 bean 定义。 在这个模型中，你在 XML bean 定义文件中设置一些特殊的 bean 定义来配置自动代理基础设施。 这让你声明有资格进行自动代理的目标。你不需要使用 ProxyFactoryBean。 有两种方法可以做到这一点：

##### BeanNameAutoProxyCreator

BeanNameAutoProxyCreator 类是一个 BeanPostProcessor，它自动为名称与文字值或通配符匹配的 bean 创建 AOP 代理。 以下示例显示了如何创建 BeanNameAutoProxyCreator bean：

```xml
<bean class="infra.aop.framework.autoproxy.BeanNameAutoProxyCreator">
  <property name="beanNames" value="jdk*,onlyJdk"/>
  <property name="interceptorNames">
    <list>
      <value>myInterceptor</value>
    </list>
  </property>
</bean>
```

##### DefaultAdvisorAutoProxyCreator

一个更通用且极其强大的自动代理创建者是 DefaultAdvisorAutoProxyCreator。 它会自动应用当前上下文中符合条件的 advisor，而无需在自动代理 advisor 的 bean 定义中包含特定的 bean 名称。 它提供了与 BeanNameAutoProxyCreator 相同的一致配置和避免重复的优点。 使用此机制涉及： DefaultAdvisorAutoProxyCreator 自动评估每个 advisor 中包含的 pointcut，以查看它应该对每个业务对象（例如示例中的 businessObject1 和 businessObject2）应用什么 advice（如果有）。 这意味着任意数量的 advisor 可以自动应用于每个业务对象。 如果任何 advisor 中的任何 pointcut 都不匹配业务对象中的任何方法，则该对象不会被代理。 随着为新

```xml
<bean class="infra.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator"/>

<bean class="infra.transaction.interceptor.TransactionAttributeSourceAdvisor">
  <property name="transactionInterceptor" ref="transactionInterceptor"/>
</bean>

<bean id="customAdvisor" class="com.mycompany.MyAdvisor"/>

<bean id="businessObject1" class="com.mycompany.BusinessObject1">
  <!-- Properties omitted -->
</bean>

<bean id="businessObject2" class="com.mycompany.BusinessObject2"/>
```

## 简洁的代理定义

> 原文：[`core/aop-api/concise-proxy`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/concise-proxy.adoc)

### 概述

特别是当定义事务代理时，你可能最终会得到许多相似的代理定义。 使用父和子 bean 定义以及内部 bean 定义，可以产生更清晰、更简洁的代理定义。 首先，我们为代理创建一个父、模板 bean 定义，如下所示：

```xml
<bean id="txProxyTemplate" abstract="true"
    class="infra.transaction.interceptor.TransactionProxyFactoryBean">
  <property name="transactionManager" ref="transactionManager"/>
  <property name="transactionAttributes">
    <props>
      <prop key="*">PROPAGATION_REQUIRED</prop>
    </props>
  </property>
</bean>
```

## 定义新的 Advice 类型

> 原文：[`core/aop-api/extensibility`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/extensibility.adoc)

### 概述

Infra AOP 被设计为可扩展的。虽然拦截实现策略目前在内部使用，但除了拦截环绕 advice、前置、抛出 advice 和返回后 advice 之外， 还可以支持任意 advice 类型。 infra.aop.framework.adapter 包是一个 SPI 包，允许在不更改核心框架的情况下添加对新自定义 advice 类型的支持。 自定义 Advice 类型的唯一约束是它必须实现 org.aopalliance.aop.Advice 标记接口。 有关更多信息，请参阅 infra.aop.framework.adapter javadoc。

## 使用 ProxyFactoryBean 创建 AOP 代理

> 原文：[`core/aop-api/pfb`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/pfb.adoc)

### 概述

如果您将 Infra IoC 容器（ApplicationContext 或 BeanFactory）用于您的业务对象（您应该这样做！）， 您会希望使用 Infra AOP FactoryBean 实现之一。（请记住，工厂 bean 引入了一个间接层，使其能够创建不同类型的对象。） NOTE: Infra AOP 支持在底层也使用了工厂 bean。 在 Infra 中创建 AOP 代理的基本方法是使用 infra.aop.framework.ProxyFactoryBean。 这让您可以完全控制切入点、任何适用的通知及其顺序。但是，如果您不需要这种控制，也可以选择更简单的选项。

#### 代理接口

考虑一个简单的 ProxyFactoryBean 实战示例。此示例涉及： 以下清单显示了该示例：

```xml
<bean id="personTarget" class="com.mycompany.PersonImpl">
  <property name="name" value="Tony"/>
  <property name="age" value="51"/>
</bean>

<bean id="myAdvisor" class="com.mycompany.MyAdvisor">
  <property name="someProperty" value="Custom string property value"/>
</bean>

<bean id="debugInterceptor" class="infra.aop.interceptor.DebugInterceptor">
</bean>

<bean id="person"
  class="infra.aop.framework.ProxyFactoryBean">
  <property name="proxyInterfaces" value="com.mycompany.Person"/>

  <property name="target" ref="personTarget"/>
  <property name="interceptorNames">
    <list>
      <value>myAdvisor</value>
      <value>debugInterceptor</value>
    </list>
  </property>
</bean>
```

#### 使用“全局”顾问

通过在拦截器名称后附加星号，所有 bean 名称与星号之前部分匹配的顾问都将添加到顾问链中。 如果您需要添加一组标准的“全局”顾问，这会很方便：

```xml
<bean id="proxy" class="infra.aop.framework.ProxyFactoryBean">
  <property name="target" ref="service"/>
  <property name="interceptorNames">
    <list>
      <value>global*</value>
    </list>
  </property>
</bean>

<bean id="global_debug" class="infra.aop.interceptor.DebugInterceptor"/>
<bean id="global_performance" class="infra.aop.interceptor.PerformanceMonitorInterceptor"/>
```

## Infra 中的 Pointcut API

> 原文：[`core/aop-api/pointcuts`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/pointcuts.adoc)

### 概述

本节描述 Infra 如何处理关键的 pointcut 概念。

#### 概念

Infra 的 pointcut 模型支持独立于 advice 类型的 pointcut 重用。 你可以使用相同的 pointcut 针对不同的 advice。 infra.aop.Pointcut 接口是中心接口，用于将 advice 定位到特定的类和方法。完整的接口如下：

```java
public interface Pointcut {

  ClassFilter getClassFilter();

  MethodMatcher getMethodMatcher();
}
```

##### 正则表达式 Pointcut

指定静态 pointcut 的一种明显方法是正则表达式。除 Infra 外，其他几个 AOP 框架也使这成为可能。 infra.aop.support.JdkRegexpMethodPointcut 是一个通用的正则表达式 pointcut，它使用 JDK 中的正则表达式支持。 使用 JdkRegexpMethodPointcut 类，你可以提供模式字符串列表。 如果其中任何一个匹配，则 pointcut 评估为 true。（因此，结果 pointcut 实际上是指定模式的并集。） 以下示例显示了如何使用 JdkRegexpMethodPointcut：

```java
@Configuration
public class JdkRegexpConfiguration {

  @Bean
  public JdkRegexpMethodPointcut settersAndAbsquatulatePointcut() {
    JdkRegexpMethodPointcut pointcut = new JdkRegexpMethodPointcut();
    pointcut.setPatterns(".*set.*", ".*absquatulate");
    return pointcut;
  }
}
```

#### Pointcut 超类

Infra 提供了有用的 pointcut 超类来帮助你实现自己的 pointcut。 因为静态 pointcut 最有用，你可能应该子类化 StaticMethodMatcherPointcut。 这只需要实现一个抽象方法（尽管你可以覆盖其他方法来自定义行为）。 以下示例显示了如何子类化 StaticMethodMatcherPointcut：

## 使用 ProxyFactory 以编程方式创建 AOP 代理

> 原文：[`core/aop-api/prog`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/prog.adoc)

### 概述

使用 Infra 以编程方式创建 AOP 代理很容易。这使你可以在不依赖 Infra IoC 的情况下使用 Infra AOP。 目标对象实现的接口会自动被代理。以下清单显示了为一个目标对象创建一个代理，其中包含一个拦截器和一个 advisor：

```java
ProxyFactory factory = new ProxyFactory(myBusinessInterfaceImpl);
factory.addAdvice(myMethodInterceptor);
factory.addAdvisor(myAdvisor);
MyBusinessInterface tb = (MyBusinessInterface) factory.getProxy();
```

## 使用 TargetSource 实现

> 原文：[`core/aop-api/targetsource`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop-api/targetsource.adoc)

### 概述

Infra 提供了 TargetSource 的概念，由 infra.aop.TargetSource 接口表示。 此接口负责返回实现连接点的“目标对象”。每次 AOP 代理处理方法调用时，都会向 TargetSource 实现请求目标实例。 使用 Infra AOP 的开发人员通常不需要直接使用 TargetSource 实现，但这提供了支持池化、热插拔和其他复杂目标的强大手段。 例如，池化 TargetSource 可以通过使用池来管理实例，为每次调用返回不同的目标实例。 如果不指定 TargetSource，则使用默认实现来包装本地对象。每次调用都会返回相同的目标（如你所料）。 本节其余部分描述了 Infra 提供的标准目标源以及如何使用它们。 TIP: 使用自定义目标源时，你的目标通常需要是原型而不是单例 bean 定义。这允许 Infra 在需要时创建新的目标实例。

#### 热插拔目标源

infra.aop.target.HotSwappableTargetSource 的存在是为了让 AOP 代理的目标可以切换，同时让调用者保持对它的引用。 更改目标源的目标会立即生效。HotSwappableTargetSource 是线程安全的。 你可以通过使用 HotSwappableTargetSource 上的 swap() 方法来更改目标，如下例所示：

```java
HotSwappableTargetSource swapper = (HotSwappableTargetSource) beanFactory.getBean("swapper");
Object oldTarget = swapper.swap(newTarget);
```

#### 池化目标源

使用池化目标源提供了类似于无状态会话 EJB 的编程模型，其中维护一个相同实例的池，方法调用将转到池中的空闲对象。 Infra 池化和 SLSB 池化之间的一个关键区别是 Infra 池化可以应用于任何 POJO。与通常的 Infra 一样，此服务可以以非侵入式方式应用。 Infra 提供对 Commons Pool 2.2 的支持，它提供了一个相当高效的池化实现。你需要在应用程序的类路径上包含 commons-pool Jar 才能使用此功能。 你也可以子类化 infra.aop.target.AbstractPoolingTargetSource 以支持任何其他池化 API。 NOTE: Commons Pool 1.5+ 也受支持，但从 TODAY Framework 4.0 开始已弃用。 以下清单显示了一个示例配置：

```xml
<bean id="businessObjectTarget" class="com.mycompany.MyBusinessObject"
    scope="prototype">
  ... properties omitted
</bean>

<bean id="poolTargetSource" class="infra.aop.target.CommonsPool2TargetSource">
  <property name="targetBeanName" value="businessObjectTarget"/>
  <property name="maxSize" value="25"/>
</bean>

<bean id="businessObject" class="infra.aop.framework.ProxyFactoryBean">
  <property name="targetSource" ref="poolTargetSource"/>
  <property name="interceptorNames" value="myInterceptor"/>
</bean>
```

#### 原型目标源

设置“原型”目标源类似于设置池化 TargetSource。在这种情况下，每次方法调用都会创建一个新的目标实例。 虽然在现代 JVM 中创建新对象的成本并不高，但连接新对象（满足其 IoC 依赖项）的成本可能更高。 因此，如果没有充分的理由，你不应该使用这种方法。 为此，你可以按如下方式修改前面显示的 poolTargetSource 定义（为了清楚起见，我们还更改了名称）：

#### ThreadLocal 目标源

如果你需要为每个传入请求（即每个线程）创建一个对象，ThreadLocal 目标源非常有用。 ThreadLocal 的概念提供了一个 JDK 范围的设施，可以透明地将资源与线程一起存储。 设置 ThreadLocalTargetSource 与其他类型的目标源的解释几乎相同，如下例所示：

## 面向切面编程

> 原文：[`core/aop`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop.adoc)

### 概述

面向切面编程（AOP）通过提供另一种思考程序结构的方式，补充了面向对象编程（OOP）。在 OOP 中， 模块化的关键单元是类，而在 AOP 中，模块化的单元是切面。切面使得能够将横切关注点（如事务管理）模块化， 这些关注点跨越多个类型和对象。在AOP文献中，这些关注点通常被称为 “横切关注点”。 框架关键组件之一是 AOP 框架。虽然 IoC 容器不依赖于 AOP（意味着如果你不想使用 AOP，你不需要使用它）， 但 AOP 与 IoC 相辅相成，提供了一个非常强大的中间件解决方案。 框架提供了简单而强大的方法，通过使用 基于 XML 配置 或 @AspectJ 注解样式 来编写自定义切面。 这两种样式都提供了完全类型化的建议和使用 AspectJ pointcut 语言的能力，同时仍然使用 AOP 进行织入。 本章讨论了 XML 和 @AspectJ 的 AOP 支持。下一章要讨论了 更

## 编程式创建 @AspectJ 代理

> 原文：[`core/aop/aspectj-programmatic`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/aspectj-programmatic.adoc)

### 概述

除了通过 <aop:config> 或 <aop:aspectj-autoproxy> 在配置中声明切面外， 也可以通过编程方式创建通知目标对象的代理。有关 Infra AOP API 的完整详情， 请参见 下一章。这里我们将重点介绍使用 @AspectJ 切面 自动创建代理的能力。 你可以使用 infra.aop.aspectj.annotation.AspectJProxyFactory 类 为目标对象创建一个由一个或多个 @AspectJ 切面通知的代理。 该类的基本用法非常简单，如下例所示：

```java
// 创建一个工厂，用于为给定的目标对象生成代理
AspectJProxyFactory factory = new AspectJProxyFactory(targetObject);

// 添加切面，该类必须是 @AspectJ 切面
// 你可以根据需要多次调用此方法以添加不同的切面
factory.addAspect(SecurityManager.class);

// 你也可以添加现有的切面实例，提供的对象类型必须是 @AspectJ 切面
factory.addAspect(usageTracker);

// 现在获取代理对象...
MyInterfaceType proxy = factory.getProxy();
```

## @AspectJ 支持

> 原文：[`core/aop/ataspectj`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/ataspectj.adoc)

### 概述

@AspectJ 指的是一种将切面声明为带有注解的常规 Java 类的风格。@AspectJ 风格由 AspectJ 项目 作为 AspectJ 5 发布的一部分引入。Infra 使用 AspectJ 提供的库进行切点解析和匹配，解释与 AspectJ 5 相同的注解。 不过，AOP 运行时仍然是纯粹的 Infra AOP，并不依赖于 AspectJ 编译器或织入器。 NOTE: 使用 AspectJ 编译器和织入器可以使用完整的 AspectJ 语言， 这将在 在 Infra 应用程序中使用 AspectJ 中讨论。

## 声明通知

> 原文：[`core/aop/ataspectj/advice`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/ataspectj/advice.adoc)

### 概述

通知（Advice）与切点表达式相关联，并在切点匹配的方法执行之前、之后或周围运行。 切点表达式既可以是内联切点，也可以是对 命名切点 的引用。

#### 前置通知

你可以使用 @Before 注解在切面中声明前置通知。 下例使用内联切点表达式。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

@Aspect
public class BeforeExample {

  @Before("execution(* com.xyz.dao.*.*(..))")
  public void doAccessCheck() {
    // ...
  }
}
```

#### 返回后通知

返回后通知（After returning advice）在匹配的方法执行正常返回时运行。 你可以使用 @AfterReturning 注解来声明它。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.AfterReturning;

@Aspect
public class AfterReturningExample {

  @AfterReturning("execution(* com.xyz.dao.*.*(..))")
  public void doAccessCheck() {
    // ...
  }
}
```

#### 抛出异常后通知

抛出异常后通知（After throwing advice）在匹配的方法执行通过抛出异常退出时运行。 你可以使用 @AfterThrowing 注解来声明它，如下例所示：

#### 后置（最终）通知

后置（最终）通知（After (finally) advice）在匹配的方法执行退出时运行。 它通过使用 @After 注解来声明。后置通知必须准备好处理正常返回和异常返回的情况。 它通常用于释放资源和类似目的。下例展示了如何使用后置（最终）通知：

#### 环绕通知

最后一种通知是环绕通知（Around advice）。环绕通知在匹配的方法执行“周围”运行。 它有机会在方法运行之前和之后进行工作，并确定方法何时、如何甚至是否真正运行。 如果你需要以线程安全的方式在方法执行之前和之后共享状态（例如，启动和停止计时器）， 通常会使用环绕通知。 始终使用满足你要求的功能最弱的通知形式。 例如，如果前置通知足以满足你的需求，请不要使用环绕通知。 环绕通知通过使用 @Around 注解标注方法来声明。 该方法应声明 Object 作为其返回类型，并且方法的第一个参数必须是 ProceedingJoinPoint 类型。 在通知方法体内，你必须在 ProceedingJoinPoint 上调用 proceed() 以便让底层方法运行。 不带参数调用 proceed() 将导致调用者的原始参数在调用时被提供给底层方法。 对于高级用例，proceed() 方法有一个重

##### 将参数传递给通知

我们已经看到了如何绑定返回值或异常值（使用返回后和抛出异常后通知）。 要使参数值对通知体可用，可以使用 args 的绑定形式。 如果在 args 表达式中使用参数名称代替类型名称，则在调用通知时，相应参数的值将作为参数值传递。 一个例子应该会让这一点更清楚。 假设你想通知将 Account 对象作为第一个参数的 DAO 操作的执行，并且你需要在这个通知体中访问该账户。 你可以这样写：

##### 通知参数与泛型

Infra AOP 可以处理类声明和方法参数中使用的泛型。 假设你有如下泛型类型：

##### 显式参数名称

@AspectJ 通知和切点注解具有一个可选的 argNames 属性，你可以使用它来指定带注解方法的参数名称。 如果 @AspectJ 切面已由 AspectJ 编译器 (ajc) 编译（即使没有调试信息），则无需添加 argNames 属性， 因为编译器保留了所需的信息。 同样，如果 @AspectJ 切面已使用 javac 的 -parameters 标志编译，则无需添加 argNames 属性， 因为编译器保留了所需的信息。 下例展示了如何使用 argNames 属性：

##### 带参数执行

我们之前提到过，我们将描述如何编写在 Infra AOP 和 AspectJ 之间一致工作的带参数的 proceed 调用。 解决方案是确保通知签名按顺序绑定每个方法参数。 下例展示了如何做到这一点：

## 启用 @AspectJ 支持

> 原文：[`core/aop/ataspectj/aspectj-support`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/ataspectj/aspectj-support.adoc)

### 概述

要在 Infra 配置中使用 @AspectJ 切面，你需要启用 Infra 支持， 以便基于 @AspectJ 切面配置 Infra AOP，并根据 bean 是否被这些切面通知来自动代理 bean。 通过自动代理，我们的意思是，如果 Infra 确定一个 bean 被一个或多个切面通知， 它会自动为该 bean 生成一个代理来拦截方法调用，并确保按需运行通知。 可以通过编程方式或 XML 配置来启用 @AspectJ 支持。在任何一种情况下， 你都需要确保 AspectJ 的 org.aspectj:aspectjweaver 库在你的应用程序的类路径上（版本 1.9 或更高）。

```java
@Configuration
@EnableAspectJAutoProxy
public class ApplicationConfiguration {
}
```

## 声明切面

> 原文：[`core/aop/ataspectj/at-aspectj`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/ataspectj/at-aspectj.adoc)

### 概述

启用 @AspectJ 支持后，应用程序上下文中定义的任何 bean，如果其类是 @AspectJ 切面（具有 @Aspect 注解）， 都会被 Infra 自动检测到，并用于配置 Infra AOP。接下来的两个例子展示了定义一个不太有用的切面所需的最小步骤。 这两个例子中的第一个展示了应用程序上下文中的常规 bean 定义，指向一个带有 @Aspect 注解的 bean 类：

```java
public class ApplicationConfiguration {

  @Bean
  public NotVeryUsefulAspect myAspect() {
    NotVeryUsefulAspect myAspect = new NotVeryUsefulAspect();
    // 在此处配置切面的属性
    return myAspect;
  }
}
```

## AOP 示例

> 原文：[`core/aop/ataspectj/example`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/ataspectj/example.adoc)

### 概述

现在你已经了解了所有组成部分是如何工作的，我们可以将它们放在一起做一些有用的事情。 业务服务的执行有时会由于并发问题（例如，死锁失败者）而失败。 如果重试该操作，很可能会在下一次尝试中成功。 对于适合在这种情况下重试的业务服务（不需要返回给用户进行冲突解决的幂等操作）， 我们希望透明地重试该操作，以避免客户端看到 PessimisticLockingFailureException。 这是一个明显横切服务层中多个服务的需求，因此非常适合通过切面来实现。 因为我们想要重试操作，所以我们需要使用环绕通知，以便我们可以多次调用 proceed。 以下清单显示了基本的切面实现：

```java
@Aspect
public class ConcurrentOperationExecutor implements Ordered {

  private static final int DEFAULT_MAX_RETRIES = 2;

  private int maxRetries = DEFAULT_MAX_RETRIES;
  private int order = 1;

  public void setMaxRetries(int maxRetries) {
    this.maxRetries = maxRetries;
  }

  public int getOrder() {
    return this.order;
  }

  public void setOrder(int order) {
    this.order = order;
  }

  @Around("com.xyz.CommonPointcuts.businessService()")
  public Object doConcurrentOperation(ProceedingJoinPoint pjp) throws Throwable {
    int numAttempts = 0;
    PessimisticLockingFailureException lockFailureException;
    do {
      numAttempts++;
      try {
        return pjp.proceed();
      }
      catch (PessimisticLockingFailureException ex) {
        lockFailureException = ex;
      }
    }
    while (numAttempts <= this.maxRetries);
    throw lockFailureException;
  }
}
```

## 切面实例化模型

> 原文：[`core/aop/ataspectj/instantiation-models`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/ataspectj/instantiation-models.adoc)

### 概述

NOTE: 这是一个高级主题。如果你刚开始接触 AOP，可以放心地跳过它，以后再看。 默认情况下，应用程序上下文中每个切面都有一个单例实例。 AspectJ 将此称为单例实例化模型。可以用替代的生命周期定义切面。 Infra 支持 AspectJ 的 perthis、pertarget 和 pertypewithin 实例化模型； 目前不支持 percflow 和 percflowbelow。 你可以通过在 @Aspect 注解中指定 perthis 子句来声明 perthis 切面。 考虑以下示例：

```java
@Aspect("perthis(execution(* com.xyz..service.*.*(..)))")
public class MyAspect {

  private int someState;

  @Before("execution(* com.xyz..service.*.*(..))")
  public void recordServiceUsage() {
    // ...
  }
}
```

## 引入

> 原文：[`core/aop/ataspectj/introductions`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/ataspectj/introductions.adoc)

### 概述

引入（Introductions，在 AspectJ 中称为类型间声明）允许切面声明被通知的对象实现给定的接口， 并代表这些对象提供该接口的实现。 你可以使用 @DeclareParents 注解来进行引入。 此注解用于声明匹配的类型有一个新的父类（因此得名）。 例如，给定一个名为 UsageTracked 的接口和该接口名为 DefaultUsageTracked 的实现， 以下切面声明所有服务接口的实现者也实现 UsageTracked 接口（例如，用于通过 JMX 进行统计）：

```java
@Aspect
public class UsageTracking {

  @DeclareParents(value="com.xyz.service.*+", defaultImpl=DefaultUsageTracked.class)
  public static UsageTracked mixin;

  @Before("execution(* com.xyz..service.*.*(..)) && this(usageTracked)")
  public void recordUsage(UsageTracked usageTracked) {
    usageTracked.incrementUseCount();
  }

}
```

## 声明切点

> 原文：[`core/aop/ataspectj/pointcuts`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/ataspectj/pointcuts.adoc)

### 概述

切点确定感兴趣的连接点，从而使我们能够控制通知何时运行。 Infra AOP 仅支持 Infra bean 的方法执行连接点，因此你可以将切点视为匹配 Infra bean 上方法的执行。 切点声明由两部分组成：包含名称和任何参数的签名，以及确定我们要关注哪些方法执行的切点表达式。 在 AOP 的 @AspectJ 注解风格中，切点签名由常规方法定义提供， 切点表达式由 @Pointcut 注解指示（作为切点签名的方法必须具有 void 返回类型）。 一个例子可能有助于阐明切点签名和切点表达式之间的区别。 下例定义了一个名为 anyOldTransfer 的切点，它匹配任何名为 transfer 的方法的执行：

```java
@Pointcut("execution(* transfer(..))") // 切点表达式
private void anyOldTransfer() {} // 切点签名
```

#### 组合切点表达式

你可以使用 &&、|| 和 ! 组合切点表达式。你也可以按名称引用切点表达式。 下例显示了三个切点表达式：

```java
package com.xyz;

public class Pointcuts {

  @Pointcut("execution(public * *(..))")
  public void publicMethod() {} // <1>

  @Pointcut("within(com.xyz.trading..*)")
  public void inTrading() {} // <2>

  @Pointcut("publicMethod() && inTrading()")
  public void tradingOperation() {} // <3>
}
```

#### 共享命名切点定义

在处理企业应用程序时，开发人员通常需要从多个切面引用应用程序的模块和特定的操作集。 为此，我们建议定义一个专用类来捕获常用的命名切点表达式。 此类通常类似于以下 CommonPointcuts 示例（尽管类的命名取决于你）：

## 选择使用哪种 AOP 声明风格

> 原文：[`core/aop/choosing`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/choosing.adoc)

### 概述

当你确定切面是实现某项需求的最佳方式后，如何在 Infra AOP 与 AspectJ 之间， 以及在 Aspect 语言（代码）风格、@AspectJ 注解风格或 Infra XML 风格之间做选择？ 这些决策会受到应用需求、开发工具和团队对 AOP 熟悉程度等因素影响。

#### Infra AOP 使用 @AspectJ 还是 XML？

如果选择使用 Infra AOP，你可以在 @AspectJ 与 XML 风格之间选择。 二者存在若干权衡。 XML 风格可能最符合既有 Infra 用户的习惯，并由真正的 POJO 作为后端实现。 当将 AOP 用作配置企业级服务的工具时，XML 是不错的选择 （一个好判断标准是：你是否希望将切点表达式视为独立于代码、可单独变更的配置）。 采用 XML 风格时，你可以更清晰地从配置中看到系统中存在哪些切面。 XML 风格有两个缺点。第一，它无法把需求的实现完全封装在单一位置。DRY 原则要求系统中 任何知识只有唯一、明确且权威的表达。使用 XML 风格时，需求实现的知识被分散在后端 bean 类的声明以及配置文件中的 XML 里。使用 @AspectJ 风格时，这些信息被封装在一个模块中， 即切面本身。第二，XML 风格的表达能力略逊于 @AspectJ：只支持“单例”切面实例化模型， 

```java
	@Pointcut("execution(* get*())")
	public void propertyAccess() {}

	@Pointcut("execution(com.xyz.Account+ *(..))")
	public void operationReturningAnAccount() {}

	@Pointcut("propertyAccess() && operationReturningAnAccount()")
	public void accountPropertyAccess() {}
```

## AOP 概念

> 原文：[`core/aop/introduction-defn`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/introduction-defn.adoc)

### 概述

让我们首先定义一些核心 AOP 概念和术语。这些术语不是 Infra 特有的。 不幸的是，AOP 术语并不是特别直观。 但是，如果 Infra 使用自己的术语，那将更加令人困惑。 Infra AOP 包括以下类型的 advice： 环绕 advice 是最通用的 advice 类型。 由于 Infra AOP 与 AspectJ 一样，提供了全方位的 advice 类型，因此我们建议你使用能够实现所需行为的最不强大的 advice 类型。 例如，如果你只需要使用方法的返回值更新缓存，那么实现返回后 advice 比环绕 advice 更好，尽管环绕 advice 可以完成相同的事情。 使用最具体的 advice 类型提供了更简单的编程模型，并且出错的可能性更小。 例如，你不需要在用于环绕 advice 的 JoinPoint 上调用 proceed() 方法，因此，你不会因为忘记调用它而失

## Infra AOP 的能力与目标

> 原文：[`core/aop/introduction-infra-defn`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/introduction-infra-defn.adoc)

### 概述

Infra AOP 以纯 Java 实现，无需特殊编译过程。 Infra AOP 目前只支持方法执行连接点（对 Infra bean 上的方法执行进行通知）。 字段拦截尚未实现，不过在不破坏核心 Infra AOP API 的前提下可以添加字段拦截支持。 如果需要对字段访问和更新连接点进行通知，可考虑使用 AspectJ。 Infra AOP 的 AOP 方法与大多数其他 AOP 框架不同。其目标不是提供最完整的 AOP 实现 （尽管 Infra AOP 已相当强大），而是提供 AOP 实现与 Infra IoC 的紧密集成， 以帮助解决企业应用中的常见问题。 因此，例如 TODAY Framework 的 AOP 功能通常与 Infra IoC 容器配合使用。 切面通过常规的 bean 定义语法进行配置（并可借助强大的“自动代理”能力）。 这与其他 AOP 实现有着关键差异。使用 Inf

## AOP 代理

> 原文：[`core/aop/introduction-proxies`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/introduction-proxies.adoc)

### 概述

Infra AOP 默认使用标准 JDK 动态代理作为 AOP 代理。 这使得任何接口（或接口集）都可以被代理。 Infra AOP 也可以使用 CGLIB 代理。这对于代理类而不是接口是必要的。 默认情况下，如果业务对象未实现接口，则使用 CGLIB。 由于面向接口而不是类编程是一种好习惯，因此业务类通常实现一个或多个业务接口。 在那些（希望很少见）你需要通知未在接口上声明的方法或需要将代理对象作为具体类型传递给方法的情况下， 可以 强制使用 CGLIB。 掌握 Infra AOP 是基于代理的这一事实非常重要。 有关此实现细节实际含义的深入检查，请参阅 理解 AOP 代理。

## 混合切面类型

> 原文：[`core/aop/mixing-styles`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/mixing-styles.adoc)

### 概述

完全可以在同一配置中混合使用 @AspectJ 风格的切面（通过自动代理支持）、 schema 定义的 <aop:aspect> 切面、<aop:advisor> 声明的顾问， 甚至其他风格的代理和拦截器。所有这些都是使用相同的底层支持机制实现的， 并且可以毫无困难地共存。

## 代理机制

> 原文：[`core/aop/proxying`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/proxying.adoc)

### 概述

Infra AOP 使用 JDK 动态代理或 CGLIB 来为给定的目标对象创建代理。 JDK 动态代理内置于 JDK 中，而 CGLIB 是一个通用的开源类定义库 （已重新打包到 infra-core 中）。 如果被代理的目标对象实现了至少一个接口，则使用 JDK 动态代理。 目标类型实现的所有接口都会被代理。如果目标对象没有实现任何接口， 则会创建 CGLIB 代理。 如果你想强制使用 CGLIB 代理（例如，为了代理目标对象定义的所有方法， 而不仅仅是接口实现的方法），也是可以的。但是，你需要考虑以下问题： 要强制使用 CGLIB 代理，请将 <aop:config> 元素的 proxy-target-class 属性值 设置为 true，如下所示：

```xml
<aop:config proxy-target-class="true">
  <!-- 此处定义其他 bean... -->
</aop:config>
```

#### 理解 AOP 代理

Infra AOP 是基于代理的。在编写你自己的切面或使用 TODAY Framework 提供的任何 基于 Infra AOP 的切面之前，掌握这句话的实际语义至关重要。 首先考虑这样一种场景：你有一个普通的、未被代理的、毫无特殊之处的直接对象引用， 如下面的代码片段所示：

```java
public class SimplePojo implements Pojo {

  public void foo() {
    // 下一个方法调用是直接在 'this' 引用上调用的
    this.bar();
  }

  public void bar() {
    // 一些逻辑...
  }
}
```

## 更多资源

> 原文：[`core/aop/resources`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/resources.adoc)

### 概述

有关 AspectJ 的更多信息，请访问 AspectJ 网站。 由 Adrian Colyer 等人撰写的 Eclipse AspectJ (Addison-Wesley, 2005) 提供了 AspectJ 语言的全面介绍和参考。 Ramnivas Laddad 撰写的 AspectJ in Action, Second Edition (Manning, 2009) 强烈推荐。 该书重点关注 AspectJ，但也深入探讨了许多通用的 AOP 主题。

## 基于模式的 AOP 支持

> 原文：[`core/aop/schema`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/schema.adoc)

### 概述

如果你更喜欢基于 XML 的格式，Infra 还支持使用 aop 命名空间标签定义切面。 使用 @AspectJ 风格时支持的切入点表达式和 advice 类型与此完全相同。 因此，在本节中，我们重点介绍该语法，并让读者参考上一节（@AspectJ 支持）中的讨论，以了解编写切入点表达式和 advice 参数的绑定。 要使用本节中描述的 aop 命名空间标签，你需要导入 infra-aop 模式，如 基于 XML 模式的配置 中所述。 有关如何在 aop 命名空间中导入标签，请参阅 AOP 模式。 在 Infra 配置中，所有 aspect 和 advisor 元素都必须放置在 <aop:config> 元素内（你可以在应用程序上下文配置中有多个 <aop:config> 元素）。 <aop:config> 元素可以包含 pointcut、advisor 和 aspect 元素（注意这些必

#### 声明 Aspect

当你使用模式支持时，切面是在 Infra 应用程序上下文中定义为 bean 的常规 Java 对象。 状态和行为在对象的字段和方法中捕获，而切入点和 advice 信息在 XML 中捕获。 你可以使用 <aop:aspect> 元素声明切面，并使用 ref 属性引用支持 bean，如下例所示：

```xml
<aop:config>
  <aop:aspect id="myAspect" ref="aBean">
    ...
  </aop:aspect>
</aop:config>

<bean id="aBean" class="...">
  ...
</bean>
```

#### 声明 Pointcut

你可以在 <aop:config> 元素内声明一个 命名 pointcut，让 pointcut 定义在多个 aspect 和 advisor 之间共享。 代表服务层中任何业务服务执行的 pointcut 可以定义如下：

```xml
<aop:config>

  <aop:pointcut id="businessService"
    expression="execution(* com.xyz.service.*.*(..))" />

</aop:config>
```

##### 前置 Advice

前置 advice 在匹配的方法执行之前运行。它在 <aop:aspect> 内部使用 <aop:before> 元素声明，如下例所示：

##### 返回后 Advice

返回后 advice 在匹配的方法执行正常完成时运行。它在 <aop:aspect> 内部以与前置 advice 相同的方式声明。 以下示例显示了如何声明它：

##### 抛出后 Advice

抛出后 advice 在匹配的方法执行通过抛出异常退出时运行。它在 <aop:aspect> 内部使用 after-throwing 元素声明，如下例所示：

##### After (Finally) Advice

无论匹配的方法执行如何退出，After (finally) advice 都会运行。 你可以使用 after 元素声明它，如下例所示：

##### 环绕 Advice

最后一种 advice 是 环绕 advice。环绕 advice 在匹配的方法执行“周围”运行。 它有机会在方法运行之前和之后做工作，并确定何时、如何以及即使方法实际上完全运行。 如果你需要以线程安全的方式在方法执行之前和之后共享状态（例如，启动和停止计时器），通常使用环绕 advice。 始终使用满足你要求的最不强大的 advice 形式。 例如，如果 前置 advice 足以满足你的需求，请不要使用 环绕 advice。 你可以使用 aop:around 元素声明环绕 advice。advice 方法应声明 Object 作为其返回类型，并且方法的第一个参数必须是 ProceedingJoinPoint 类型。 在 advice 方法的主体内，你必须在 ProceedingJoinPoint 上调用 proceed() 才能运行底层方法。 不带参数调用 proceed() 将导致调用

##### Advice 参数

基于模式的声明风格支持完全类型化的 advice，方式与 @AspectJ 支持所描述的相同——通过按名称将 pointcut 参数与 advice 方法参数进行匹配。 有关详细信息，请参阅 Advice 参数。 如果你希望显式指定 advice 方法的参数名称（不依赖于前面描述的检测策略），你可以通过使用 advice 元素的 arg-names 属性来实现， 该属性的处理方式与 advice 注解中的 argNames 属性相同（如 确定参数名称 中所述）。 以下示例显示了如何在 XML 中指定参数名称：

#### 引介

引介（在 AspectJ 中称为类型间声明）让切面声明被通知对象实现给定接口，并代表这些对象提供该接口的实现。 你可以通过在 aop:aspect 内部使用 aop:declare-parents 元素来进行引介。 你可以使用 aop:declare-parents 元素声明匹配类型具有新父级（因此得名）。 例如，给定名为 UsageTracked 的接口和该接口名为 DefaultUsageTracked 的实现， 以下切面声明所有服务接口的实现者也实现 UsageTracked 接口。（例如，为了通过 JMX 公开统计信息。）

#### Advisors

“advisors”的概念来自 Infra 中定义的 AOP 支持，在 AspectJ 中没有直接等效项。 Advisor 就像一个包含单个 advice 的小型独立切面。advice 本身由 bean 表示，并且必须实现 Infra 中的 Advice 类型 中描述的 advice 接口之一。 Advisors 可以利用 AspectJ 切入点表达式。 Infra 通过 <aop:advisor> 元素支持 advisor 概念。你最常看到它与事务 advice 结合使用，事务 advice 在 Infra 中也有自己的命名空间支持。 以下示例显示了一个 advisor：

#### AOP 模式示例

本节展示了当使用模式支持重写时，一个 AOP 示例 中的并发锁定失败重试示例是什么样子的。 业务服务的执行有时可能会由于并发问题（例如，死锁失败者）而失败。如果重试该操作，它很可能会在下一次尝试中成功。 对于适合在此类条件下重试的业务服务（不需要返回给用户进行冲突解决的幂等操作），我们希望透明地重试操作，以避免客户端看到 PessimisticLockingFailureException。 这是一个清楚地跨越服务层中多个服务的需求，因此非常适合通过切面来实现。 因为我们想重试操作，所以我们需要使用环绕 advice，以便我们可以多次调用 proceed。 以下清单显示了基本的切面实现（这是一个使用模式支持的常规 Java 类）：

## 在 Infra 应用程序中使用 AspectJ

> 原文：[`core/aop/using-aspectj`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aop/using-aspectj.adoc)

### 概述

到目前为止，我们在本章中介绍的所有内容都是纯粹的 Infra AOP。在本节中， 我们将探讨如果你的需求超出了 Infra AOP 单独提供的功能，如何使用 AspectJ 编译器或织入器 来替代 Infra AOP 或作为其补充。 Infra 附带了一个小的 AspectJ 切面库，在你的发行版中作为独立的 infra-aspects.jar 提供。 你需要将其添加到类路径中才能使用其中的切面。使用 AspectJ 依赖注入 Infra 领域对象 和 AspectJ 的其他 Infra 切面 讨论了 该库的内容以及如何使用它。使用 Infra IoC 配置 AspectJ 切面 讨论了如何 依赖注入使用 AspectJ 编译器织入的 AspectJ 切面。最后， TODAY Framework 中的 AspectJ 加载时织入 介绍了使用 AspectJ 的 Infra 应用程序的加载时

#### 使用 AspectJ 依赖注入 Infra 领域对象

Infra 容器实例化并配置应用程序上下文中定义的 bean。如果在给定包含要应用的配置的 bean 定义名称的情况下，要求 bean 工厂配置预先存在的对象也是可能的。 infra-aspects.jar 包含一个注解驱动的切面，利用此功能允许对任何对象进行依赖注入。 该支持旨在用于在任何容器控制之外创建的对象。领域对象通常属于此类，因为它们通常通过 new 操作符以编程方式创建，或者作为数据库查询的结果由 ORM 工具创建。 @Configurable 注解将类标记为有资格进行 Infra 驱动的配置。在最简单的情况下， 你可以纯粹将其用作标记注解，如下例所示：

```java
package com.xyz.domain;

import infra.beans.factory.annotation.Configurable;

@Configurable
public class Account {
  // ...
}
```

#### AspectJ 的其他 Infra 切面

除了 @Configurable 切面之外，infra-aspects.jar 还包含一个 AspectJ 切面， 你可以使用它来驱动带有 @Transactional 注解的类型和方法的 Infra 事务管理。 这主要适用于希望在 Infra 容器之外使用 TODAY Framework 的事务支持的用户。 解释 @Transactional 注解的切面是 AnnotationTransactionAspect。使用此切面时， 必须注解实现类（或该类中的方法，或两者），而不是该类实现的接口（如果有）。 AspectJ 遵循 Java 的规则，即接口上的注解不会被继承。 类上的 @Transactional 注解指定了该类中任何公共操作执行的默认事务语义。 类中方法上的 @Transactional 注解会覆盖类注解（如果存在）给出的默认事务语义。 任何可见性的方法都可以被注解，包括私有方

```java
public aspect DomainObjectConfiguration extends AbstractBeanConfigurerAspect {

  public DomainObjectConfiguration() {
    setBeanWiringInfoResolver(new ClassNameBeanWiringInfoResolver());
  }

  // 创建新 bean（领域模型中的任何对象）
  protected pointcut beanCreation(Object beanInstance) :
    initialization(new(..)) &&
    CommonPointcuts.inDomainModel() &&
    this(beanInstance);
}
```

#### 使用 Infra IoC 配置 AspectJ 切面

当你在 Infra 应用程序中使用 AspectJ 切面时，很自然地希望并期望能够使用 Infra 配置此类切面。 AspectJ 运行时本身负责切面的创建，而通过 Infra 配置 AspectJ 创建的切面的方式 取决于切面使用的 AspectJ 实例化模型（per-xxx 子句）。 大多数 AspectJ 切面是单例切面。这些切面的配置很容易。你可以像往常一样创建引用切面类型的 bean 定义， 并包含 factory-method="aspectOf" bean 属性。这确保了 Infra 通过向 AspectJ 请求切面实例 而不是尝试自己创建实例来获取切面实例。下例显示了如何使用 factory-method="aspectOf" 属性：

##### 第一个示例

假设你是一名应用程序开发人员，被指派诊断系统中某些性能问题的原因。 我们将开启一个简单的性能分析切面，以便快速获取一些性能指标，而不是使用分析工具。 然后，我们可以紧接着对该特定区域应用更细粒度的分析工具。 NOTE: 这里展示的示例使用 XML 配置。你也可以使用 Java 配置 来配置和使用 @AspectJ。 具体来说，你可以使用 @EnableLoadTimeWeaving 注解作为 <context:load-time-weaver/> 的替代方案 （详情请参见 下文）。 下例显示了性能分析切面，它并不花哨。它是一个基于时间的分析器，使用了 @AspectJ 风格的切面声明：

##### META-INF/aop.xml

AspectJ LTW 基础设施是通过使用 Java 类路径上的一个或多个 META-INF/aop.xml 文件配置的 （直接在类路径上，或者更典型的是在 jar 文件中）。例如：

##### Infra 配置

Infra LTW 支持的关键组件是 LoadTimeWeaver 接口（在 infra.instrument.classloading 包中）， 以及 Infra 发行版中附带的众多实现。LoadTimeWeaver 负责在运行时向 ClassLoader 添加一个或多个 java.lang.instrument.ClassFileTransformers，这为各种有趣的应用程序打开了大门， 其中之一恰好是切面的 LTW。 TIP: 如果你不熟悉运行时类文件转换的概念，请在继续之前查看 java.lang.instrument 包的 javadoc API 文档。 虽然该文档并不详尽，但至少你可以看到关键接口和类（以便在阅读本节时作为参考）。 为特定的 ApplicationContext 配置 LoadTimeWeaver 可能就像添加一行代码一样简单。 （请注意，你几乎肯定需要使用 

##### Tomcat, JBoss, WildFly

Tomcat 和 JBoss/WildFly 提供了一个通用的应用程序 ClassLoader，能够进行本地检测。 Infra 原生 LTW 可以利用这些 ClassLoader 实现来提供 AspectJ 织入。 你可以简单地启用加载时织入，如 前面所述。 具体来说，你不需要修改 JVM 启动脚本来添加 -javaagent:path/to/infra-instrument.jar。 注意，在 JBoss 上，你可能需要禁用应用服务器扫描，以防止它在应用程序实际启动之前加载类。 一个快速的解决方法是在你的工件中添加一个名为 WEB-INF/jboss-scanning.xml 的文件，内容如下：

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
