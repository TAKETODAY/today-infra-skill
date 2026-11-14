# IoC 容器

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

Bean 定义与依赖注入、作用域、生命周期、配置类、@Value、条件装配。

覆盖文档：36 页（含示例 31 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- 控制反转 IoC 容器 —— `core/beans`
- **基于注解的容器配置** —— `core/beans/annotation-config`
- **使用 @Primary 或 @Fallback 微调基于注解的自动装配** —— `core/beans/annotation-config/autowired-primary`
- **使用限定符微调基于注解的自动装配** —— `core/beans/annotation-config/autowired-qualifiers`
- **使用 @Autowired** —— `core/beans/annotation-config/autowired`
- **使用 CustomAutowireConfigurer** —— `core/beans/annotation-config/custom-autowire-configurer`
- **使用泛型作为自动装配限定符** —— `core/beans/annotation-config/generics-as-qualifiers`
- **使用 @PostConstruct 和 @PreDestroy** —— `core/beans/annotation-config/postconstruct-and-predestroy-annotations`
- **使用 @Resource 注入** —— `core/beans/annotation-config/resource`
- **使用 @Value** —— `core/beans/annotation-config/value-annotations`
- **容器概述** —— `core/beans/basics`
- **BeanFactory API** —— `core/beans/beanfactory`
- **Bean 定义继承** —— `core/beans/child-bean-definitions`
- **类路径扫描和管理的组件** —— `core/beans/classpath-scanning`
- **ApplicationContext 的附加功能** —— `core/beans/context-introduction`
- **注册 LoadTimeWeaver** —— `core/beans/context-load-time-weaver`
- **Bean 概览** —— `core/beans/definition`
- 依赖 —— `core/beans/dependencies`
- 自动装配协作者 —— `core/beans/dependencies/factory-autowire`
- **依赖注入** —— `core/beans/dependencies/factory-collaborators`
- **使用 depends-on** —— `core/beans/dependencies/factory-dependson`
- **延迟初始化的 Bean** —— `core/beans/dependencies/factory-lazy-init`
- **方法注入** —— `core/beans/dependencies/factory-method-injection`
- **依赖项和配置详解** —— `core/beans/dependencies/factory-properties-detailed`
- **Environment 接口** —— `core/beans/environment`
- **容器扩展点** —— `core/beans/factory-extension`
- **自定义 Bean 的性质** —— `core/beans/factory-nature`
- **Bean 作用域** —— `core/beans/factory-scopes`
- IoC 容器和 Bean 简介 —— `core/beans/introduction`
- 基于 Java 的容器配置 —— `core/beans/java`
- **基本概念：@Bean 和 @Configuration** —— `core/beans/java/basic-concepts`
- **使用 @Bean 注解** —— `core/beans/java/bean-annotation`
- **组合基于 Java 的配置** —— `core/beans/java/composing-configuration-classes`
- **使用 @Configuration 注解** —— `core/beans/java/configuration-annotation`
- **使用 AnnotationConfigApplicationContext 实例化 Infra 容器** —— `core/beans/java/instantiating-container`
- **使用 JSR 330 标准注解** —— `core/beans/standard-annotations`

## 控制反转 IoC 容器

> 原文：[`core/beans`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans.adoc)

### 概述

本章介绍控制反转 (IoC) 容器。

## 基于注解的容器配置

> 原文：[`core/beans/annotation-config`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config.adoc)

### 概述

注解式配置的引入引发了一个问题，即这种方法是否“更好”于 XML。简短的回答是“视情况而定”。 较长的回答是，每种方法都有其优点和缺点，通常由开发人员决定哪种策略更适合他们。 由于注解的定义方式，它们在声明中提供了很多上下文，导致更简短、更简洁的配置。 然而，XML 擅长在不接触源代码或重新编译的情况下连接组件。一些开发人员喜欢让连接与源代码保持紧密联系， 而另一些人则认为被注解的类不再是 POJOs，并且配置变得分散化，更难以控制。 无论选择哪种方式，Infra 都可以适应两种风格，甚至将它们混合在一起。值得指出的是， 通过其 JavaConfig 选项，Infra 允许以非侵入性的方式使用注解， 而不必触及目标组件的源代码，并且在工具方面，所有的配置风格都受到了 Infra 工具 的支持，包括 Eclipse、Visual Studio Code 和 Theia。 一种替代XML配置的

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:context="http://www.springframework.org/schema/context"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    https://www.springframework.org/schema/context/spring-context.xsd">

  <context:annotation-config/>

</beans>
```

## 使用 @Primary 或 @Fallback 微调基于注解的自动装配

> 原文：[`core/beans/annotation-config/autowired-primary`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config/autowired-primary.adoc)

### 概述

由于按类型自动装配可能会导致多个候选者，因此通常需要对选择过程进行更多控制。 实现此目的的一种方法是使用 Infra @Primary 注解。 @Primary 表示当多个 bean 是自动装配到单值依赖项的候选者时，应优先考虑特定的 bean。 如果候选者中恰好存在一个主 bean，它将成为自动装配的值。 考虑以下配置，该配置将 firstMovieCatalog 定义为主 MovieCatalog：

```java
@Configuration
public class MovieConfiguration {

  @Bean
  @Primary
  public MovieCatalog firstMovieCatalog() { ... }

  @Bean
  public MovieCatalog secondMovieCatalog() { ... }

  // ...
}
```

## 使用限定符微调基于注解的自动装配

> 原文：[`core/beans/annotation-config/autowired-qualifiers`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config/autowired-qualifiers.adoc)

### 概述

当可以确定一个主（或非回退）候选者时，@Primary 和 @Fallback 是对多个实例按类型使用自动装配的有效方法。 当您需要对选择过程进行更多控制时，可以使用 Infra @Qualifier 注解。 您可以将限定符值与特定参数相关联，缩小类型匹配的集合，以便为每个参数选择特定的 bean。 在最简单的情况下，这可以是一个普通的描述性值，如下例所示： --

```java
public class MovieRecommender {

  @Autowired
  @Qualifier("main")
  private MovieCatalog movieCatalog;

  // ...
}
```

## 使用 @Autowired

> 原文：[`core/beans/annotation-config/autowired`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config/autowired.adoc)

### 概述

在包含在本节的示例中，JSR 330 的 @Inject 注解可以用来代替 Infra @Autowired 注解。 有关更多详细信息，请参阅 此处。 您可以将 @Autowired 注解应用于构造函数，如下例所示：

```java
public class MovieRecommender {

  private final CustomerPreferenceDao customerPreferenceDao;

  @Autowired
  public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
    this.customerPreferenceDao = customerPreferenceDao;
  }

  // ...
}
```

## 使用 CustomAutowireConfigurer

> 原文：[`core/beans/annotation-config/custom-autowire-configurer`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config/custom-autowire-configurer.adoc)

### 概述

CustomAutowireConfigurer 是一个 BeanFactoryPostProcessor，它允许您注册自己的自定义限定符注解类型，即使它们没有使用 Infra @Qualifier 注解。 以下示例显示了如何使用 CustomAutowireConfigurer：

```xml
<bean id="customAutowireConfigurer"
    class="infra.beans.factory.annotation.CustomAutowireConfigurer">
  <property name="customQualifierTypes">
    <set>
      <value>example.CustomQualifier</value>
    </set>
  </property>
</bean>
```

## 使用泛型作为自动装配限定符

> 原文：[`core/beans/annotation-config/generics-as-qualifiers`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config/generics-as-qualifiers.adoc)

### 概述

除了 @Qualifier 注解之外，您还可以使用 Java 泛型类型作为限定的一种隐式形式。 例如，假设您有以下配置：

```java
@Configuration
public class MyConfiguration {

  @Bean
  public StringStore stringStore() {
    return new StringStore();
  }

  @Bean
  public IntegerStore integerStore() {
    return new IntegerStore();
  }
}
```

## 使用 @PostConstruct 和 @PreDestroy

> 原文：[`core/beans/annotation-config/postconstruct-and-predestroy-annotations`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config/postconstruct-and-predestroy-annotations.adoc)

### 概述

CommonAnnotationBeanPostProcessor 不仅识别 @Resource 注解， 还识别 JSR-250 生命周期注解：jakarta.annotation.PostConstruct 和 jakarta.annotation.PreDestroy。 引入的这些注解支持提供了 初始化回调 和 销毁回调 中描述的生命周期回调机制的替代方案。 只要 CommonAnnotationBeanPostProcessor 在 Infra ApplicationContext 中注册， 带有这些注解之一的方法就会在生命周期的同一点被调用，就像相应的 Infra 生命周期接口方法或显式声明的回调方法一样。 在以下示例中，缓存将在初始化时预填充，并在销毁时清除：

```java
public class CachingMovieLister {

  @PostConstruct
  public void populateMovieCache() {
    // 初始化时填充电影缓存...
  }

  @PreDestroy
  public void clearMovieCache() {
    // 销毁时清除电影缓存...
  }
}
```

## 使用 @Resource 注入

> 原文：[`core/beans/annotation-config/resource`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config/resource.adoc)

### 概述

Infra 还支持在字段或 bean 属性 setter 方法上使用 JSR-250 @Resource 注解 (jakarta.annotation.Resource) 进行注入。 这是 Jakarta EE 中的常见模式：例如，在 JSF 管理的 bean 和 JAX-WS 端点中。 Infra 也支持 Infra 管理对象的这种模式。 @Resource 接受一个 name 属性。默认情况下，Infra 将该值解释为要注入的 bean 名称。 换句话说，它遵循按名称语义，如下例所示： --

```java
public class SimpleMovieLister {

  private MovieFinder movieFinder;

  @Resource(name="myMovieFinder") // <1>
  public void setMovieFinder(MovieFinder movieFinder) {
    this.movieFinder = movieFinder;
  }
}
```

## 使用 @Value

> 原文：[`core/beans/annotation-config/value-annotations`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/annotation-config/value-annotations.adoc)

### 概述

@Value 通常用于注入外部化属性：

```java
  @Component
  public class MovieRecommender {

      private final String catalog;

      public MovieRecommender(@Value("${catalog.name}") String catalog) {
          this.catalog = catalog;
      }
  }
```

## 容器概述

> 原文：[`core/beans/basics`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/basics.adoc)

### 概述

infra.context.ApplicationContext 接口代表了 IoC 容器， 负责实例化、配置和组装 bean。容器通过读取配置元数据来获取实例化、配置和组装对象的指令。 配置元数据可以用 XML、Java 注解或 Java 代码表示。它允许您表达组成应用程序的对象以及这些对象之间的丰富相互依赖关系。 框架提供了几个 ApplicationContext 接口的实现，在单体应用中，当你要使用 XML 配置来描述和配置 Bean 时 你可以使用 ClassPathXmlApplicationContext 或者 FileSystemXmlApplicationContext。 当然你也可以使用少量 XML 配置开启 Java 注解或代码作为元数据格式。

#### Configuration Metadata

IoC 容器消耗一种形式的配置元数据。这些配置元数据代表您作为应用程序开发者告诉 Infra 容器如何实例化、配置和组装应用程序中的对象。 传统上，配置元数据通常以简单直观的 XML 格式提供，这也是本章大部分内容用来传达 IoC 容器的关键概念和特性的方式。 NOTE: XML 格式的元数据配置并不是唯一允许的配置元数据形式。IoC 容器本身与配置元数据的实际编写格式完全解耦。 如今，许多开发者选择使用 Java-based configuration 来配置他们的 Infra 应用程序。 有关在 Infra 容器中使用其他形式的元数据的信息，请参阅： @Configuration, @Bean, @Import, 和 @DependsOn 注解. 基础设施配置至少包括一个，通常是多个 bean 定义，容器必须管理这些定义。基于 XML 的配置元数据将这些 bean 配置为顶级 <bea

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean id="..." class="..."> <1> <2>
    <!-- collaborators and configuration for this bean go here -->
  </bean>

  <bean id="..." class="...">
    <!-- collaborators and configuration for this bean go here -->
  </bean>

  <!-- more bean definitions go here -->

</beans>
```

#### 实例化一个容器

ApplicationContext 构造函数中提供的位置路径或路径是资源字符串，允许容器从各种外部资源加载配置元数据，例如本地文件系统、Java CLASSPATH 等等。

```java
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");
```

##### 组合基于 XML 的配置元数据

可以将Bean定义跨越多个XML文件是非常有用的。通常，每个独立的XML配置文件代表着架构中的一个逻辑层或模块。 您可以使用应用程序上下文构造函数从所有这些XML片段加载Bean定义。该构造函数接受多个 Resource 位置， 就像在 上一节 中所示的那样。 或者，使用一个或多个 <import/> 元素的出现来从另一个文件或多个文件中加载Bean定义。以下示例显示了如何实现：

#### 使用容器

ApplicationContext 是一个高级工厂的接口，它能够维护不同 bean 及其依赖项的注册表。 通过使用方法 T getBean(String name, Class<T> requiredType)，您可以检索您的 bean 的实例。 ApplicationContext 允许您读取 bean 定义并访问它们，如下面的示例所示

## BeanFactory API

> 原文：[`core/beans/beanfactory`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/beanfactory.adoc)

### 概述

BeanFactory API 提供了 Infra IoC 功能的基础。它的具体契约大多用于与 Infra 的其他部分以及相关的第三方框架集成，其 StandardBeanFactory 实现是高级 GenericApplicationContext 容器内的一个关键委托。 BeanFactory 及其相关接口（如 BeanFactoryAware、InitializingBean、DisposableBean） 是其他框架组件的重要集成点。通过不需要任何注解甚至反射，它们允许容器与其组件之间进行非常高效的交互。 应用级别的 Bean 可以使用相同的回调接口，但通常更喜欢声明式依赖注入，可以通过注解或编程配置来实现。 请注意，核心 BeanFactory API 层及其 StandardBeanFactory 实现不对要使用的配置格式或任何组件注解做出假设。所有这些变体都通过扩展（如 Xm

#### BeanFactory vs ApplicationContext?

这一部分解释了 BeanFactory 和 ApplicationContext 容器级别之间的区别，以及对引导的影响。 除非有充分理由不这样做，否则应该使用 ApplicationContext，其常见的自定义引导实现为 GenericApplicationContext 及其子类 AnnotationConfigApplicationContext。 这些是 Infra 核心容器的主要入口点，用于所有通用目的：加载配置文件，触发类路径扫描， 以编程方式注册 bean 定义和注解类，以及注册功能 bean 定义。 因为 ApplicationContext 包含了 BeanFactory 的所有功能，所以通常建议使用 ApplicationContext 而不是普通的 BeanFactory，除非需要对 bean 处理具有完全控制权。在 ApplicationContext 内（例如 G

```java
StandardBeanFactory factory = new StandardBeanFactory();
// populate the factory with bean definitions

// now register any needed BeanPostProcessor instances
factory.addBeanPostProcessor(new AutowiredAnnotationBeanPostProcessor());
factory.addBeanPostProcessor(new MyBeanPostProcessor());

// now start using the factory
```

## Bean 定义继承

> 原文：[`core/beans/child-bean-definitions`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/child-bean-definitions.adoc)

### 概述

一个bean定义可以包含大量的配置信息，包括构造函数参数、属性值以及容器特定的信息， 例如初始化方法、静态工厂方法名称等。子bean定义从父定义中继承配置数据。子定义可以根据需要覆盖一些值或添加其他值。 使用父子bean定义可以节省大量的输入。实际上，这是一种模板化形式。 如果你以编程方式使用 ApplicationContext 接口，子bean定义由 ChildBeanDefinition 类表示。 大多数用户不会在这个级别上使用它们。相反，他们在类似于 ClassPathXmlApplicationContext 的类中以声明方式配置 bean 定义。 当您使用基于XML的配置元数据时，可以通过使用 parent 属性来指示一个子bean定义，将父 bean 作为该属性的值。以下示例显示了如何这样做：

```xml
<bean id="inheritedTestBean" abstract="true" class="infra.beans.TestBean">
  <property name="name" value="parent"/>
  <property name="age" value="1"/>
</bean>

<bean id="inheritsWithDifferentClass" class="infra.beans.DerivedTestBean"
    parent="inheritedTestBean" init-method="initialize">  <1>
  <property name="name" value="override"/>
  <!-- the age property value of 1 will be inherited from parent -->
</bean>
```

## 类路径扫描和管理的组件

> 原文：[`core/beans/classpath-scanning`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/classpath-scanning.adoc)

### 概述

本章中的大多数示例都使用 XML 来指定配置元数据，这些配置元数据在 Infra 容器内生成每个 BeanDefinition。 上一节 (基于注解的容器配置) 演示了如何通过源代码级别的注解提供大量的配置元数据。然而，即使在那些示例中， “基础” bean 定义也是在 XML 文件中明确定义的，而注解只驱动依赖注入。本节介绍了一种通过扫描类路径来隐式检测候选组件的选项。 候选组件是符合过滤器标准并且已在容器中注册了相应 bean 定义的类。这消除了使用 XML 执行 bean 注册的需求。 相反，您可以使用注解（例如 @Component）、AspectJ 类型表达式或您自己的自定义过滤器标准来选择哪些类已在容器中注册了 bean 定义。 您可以使用 Java 来定义 beans，而不是使用 XML 文件。请查看 @Configuration、@Bean、@Import 和 @Depen

#### Using Meta-annotations and Composed Annotations

许多 Infra 提供的注解可以在您自己的代码中用作元注解。元注解是可以应用于另一个注解的注解。 例如，早些时候提到的 @Service 注解在元注解中与 @Component 注解一起使用，如下例所示：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component // <1>
public @interface Service {

  // ...
}
```

#### 自动检测类并注册 Bean

Infra 可以自动检测有注释的类，并在 ApplicationContext 中注册相应的 BeanDefinition 实例。例如，以下两个类符合此类自动检测的条件：

```java
@Service
public class SimpleMovieLister {

  private MovieFinder movieFinder;

  public SimpleMovieLister(MovieFinder movieFinder) {
    this.movieFinder = movieFinder;
  }
}
```

#### 使用过滤器自定义扫描

默认情况下，使用 @Component、@Repository、@Service、@Controller、@Configuration 或本身带有 @Component 注解的自定义注解标注的类，是唯一会被检测到的候选组件。但是，您可以通过应用自定义过滤器来修改和扩展此行为。 将它们作为 @ComponentScan 注解的 includeFilters 或 excludeFilters 属性添加 （或在XML配置中作为 <context:component-scan> 元素的子元素 <context:include-filter /> 或 <context:exclude-filter /> 添加）。 每个过滤器元素都需要 type 和 expression 属性。下表描述了过滤选项： 下面的示例显示了忽略所有 @Repository 注解而使用 "stub" 版本库的配置 注释，而使用

#### 在组件内定义 Bean 元数据

基础设施组件也可以向容器贡献 bean 定义元数据。您可以使用与在 @Configuration 注解类中定义 bean 元数据相同的 @Bean 注解来实现这一点。以下示例显示了如何这样做：

#### 给自动探测的组件命名

当组件在扫描过程中自动检测到时，其 bean 名称是由该扫描器已知的 BeanNameGenerator 策略生成的。 默认情况下，使用 AnnotationBeanNameGenerator。对于基础设施的 stereotype 注解， 如果通过注解的 value 属性提供了名称，那么该名称将用作相应 bean 定义中的名称。 当使用以下 JSR-250 和 JSR-330 注解代替基础设施原型注解时，也适用该约定： @jakarta.annotation.ManagedBean、@javax.annotation.ManagedBean、 @jakarta.inject.Named 和 @javax.inject.Named。 用于指定 bean 名称的注解属性的名称不再必须为 value。自定义原型注解可以声明一个具有不同名称 （例如 name）的属性，并使用 @AliasFor(a

#### 为自动检测的组件提供 Scope

与一般的基础设施管理组件一样，自动检测到的组件的默认和最常见范围是 singleton。 然而，有时您可能需要不同的范围，可以通过 @Scope 注解指定。 可以在注解中提供范围的名称，如以下示例所示：

#### 提供带有注释的 Qualifier 元数据

@Qualifier 注解在 使用 Qualifiers 微调基于注解的自动装配 中有讨论。该部分的示例演示了使用 @Qualifier 注解和自定义限定符注解来在解析自动装配候选项时提供细粒度控制。 因为这些示例是基于 XML bean 定义的，所以在 XML 的 bean 元素的 qualifier 或 meta 子元素中提供了候选 bean 定义的限定符元数据。当依赖于类路径扫描进行组件的自动检测时， 可以在候选类上使用类型级别的注解提供限定符元数据。以下三个示例演示了这种技术：

## ApplicationContext 的附加功能

> 原文：[`core/beans/context-introduction`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/context-introduction.adoc)

### 概述

如前文所述，在 章节介绍中， infra.beans.factory 包提供了管理和操作 bean 的基本功能，包括以编程方式进行操作。 infra.context 包添加了 ApplicationContext 接口，该接口扩展了 BeanFactory 接口，并扩展了其他接口，以提供更多面向应用框架的功能。 为了以更面向框架的方式增强 BeanFactory 的功能，上下文包还提供了以下功能：

#### MessageSource 国际化

ApplicationContext 接口扩展了一个称为 MessageSource 的接口，因此提供了国际化（"i18n"）功能。 Infra 还提供了 HierarchicalMessageSource 接口，可以按层次解析消息。这些接口共同构成了 Infra 实现消息解析的基础。这些接口定义的方法包括： 从 MessageSource 中检索消息的基本方法。当找不到指定区域设置的消息时，将使用默认消息。 传递的任何参数都将作为替换值使用，使用标准库提供的 MessageFormat 功能。 但有一个区别：无法指定默认消息。如果找不到消息，则抛出 NoSuchMessageException。 所有在前面方法中使用的属性也包装在一个名为 MessageSourceResolvable 的类中，您可以将其与此方法一起使用。 当加载 ApplicationContext 时，它会自动搜索上

```xml
<beans>
  <bean id="messageSource"
      class="infra.context.support.ResourceBundleMessageSource">
    <property name="basenames">
      <list>
        <value>format</value>
        <value>exceptions</value>
        <value>windows</value>
      </list>
    </property>
  </bean>
</beans>
```

#### 内置的和自定义事件

在 ApplicationContext 中提供事件处理是通过 ApplicationEvent 类和 ApplicationListener 接口实现的。 如果部署了实现 ApplicationListener 接口的 bean 到上下文中，每当 ApplicationEvent 发布到 ApplicationContext， 该 bean 就会收到通知。基本上，这就是标准的观察者设计模式。 TIP: 提供了 基于注解的模型 ， 以及发布任意事件的能力（即，不一定要扩展自 ApplicationEvent 的对象）。当发布这样的对象时，我们会为您封装成一个事件。 下表描述了 Infra 提供的标准事件： 接口上使用 refresh() 方法）。在这里，“initialized”意味着所有的 bean 都已加载，后处理器 bean 已被检测并激活，单例已预实例化，并且 Applicatio

```java
public class BlockedListEvent extends ApplicationEvent {

  private final String address;
  private final String content;

  public BlockedListEvent(Object source, String address, String content) {
    super(source);
    this.address = address;
    this.content = content;
  }

  // accessor and other methods...
}
```

##### 使用注解标注事件监听器

您可以通过使用 @EventListener 注解，在托管 bean 的任何方法上注册事件监听器。BlockedListNotifier 可以如下重写：

##### 异步监听器

如果您希望特定的监听器异步处理事件，您可以重用 常规的 @Async 支持。 以下示例展示了如何实现：

##### 监听器的顺序

如果需要一个监听器在另一个监听器之前被调用，您可以在方法声明中添加 @Order 注解，如以下示例所示：

##### 通用事件

您还可以使用泛型来进一步定义事件的结构。考虑使用 EntityCreatedEvent<T>， 其中 T 是实际创建的实体的类型。例如，您可以创建以下监听器定义，以仅接收 Person 类型的 EntityCreatedEvent：

#### 应用启动跟踪

ApplicationContext 管理 Infra 应用程序的生命周期，并围绕组件提供丰富的编程模型。因此，复杂的应用程序可能具有同样复杂的组件图和启动阶段。 通过特定指标跟踪应用程序启动步骤，不仅有助于了解在启动阶段时间花费在哪里，还可以作为更好地理解整个上下文生命周期的一种方式。 AbstractApplicationContext（及其子类）配备了 ApplicationStartup，用于收集关于各种启动阶段的 StartupStep 数据： 以下是在 AnnotationConfigApplicationContext 中进行插桩的示例：

## 注册 LoadTimeWeaver

> 原文：[`core/beans/context-load-time-weaver`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/context-load-time-weaver.adoc)

### 概述

LoadTimeWeaver 被基础架构用于在类加载到 Java 虚拟机（JVM）时动态转换类。 要启用加载时编织，您可以将 @EnableLoadTimeWeaving 添加到您的 @Configuration 类之一，如下例所示：

```java
@Configuration
@EnableLoadTimeWeaving
public class AppConfig {
}
```

## Bean 概览

> 原文：[`core/beans/definition`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/definition.adoc)

### 概述

Infra IoC 容器管理一个或多个 bean。这些 bean 是根据您提供给容器的配置元数据（例如，以 XML <bean/> 定义的形式）创建的。 在容器内部，这些 bean 定义表示为 BeanDefinition 对象，其中包含（除其他信息外）以下元数据： 此元数据转换为构成每个 bean 定义的一组属性。下表描述了这些属性： 除了包含有关如何创建特定 bean 的信息的 bean 定义外，ApplicationContext 实现还允许注册在容器外部（由用户）创建的现有对象。 这是通过 getBeanFactory() 方法访问 ApplicationContext 的 BeanFactory 来完成的，该方法返回 StandardBeanFactory 实现。 StandardBeanFactory 通过 registerSingleton(..) 和 registerBea

##### 在 Bean 定义之外为 Bean 设置别名

在 bean 定义本身中，您可以通过使用 id 属性指定的一个名称与 name 属性中的任意数量的其他名称的组合，为 bean 提供多个名称。 这些名称可以是同一 bean 的等效别名，并且在某些情况下很有用，例如让应用程序中的每个组件通过使用特定于该组件本身的 bean 名称来引用公共依赖项。 然而，在实际定义 bean 的地方指定所有别名并不总是足够的。有时需要为在别处定义的 bean 引入别名。 这通常发生在大型系统中，其中配置在每个子系统之间拆分，每个子系统都有自己的一组对象定义。 在基于 XML 的配置元数据中，您可以使用 <alias/> 元素来实现此目的。以下示例显示了如何执行此操作：

```xml
<alias name="fromName" alias="toName"/>
```

##### 使用构造函数实例化

当您通过构造函数方法创建 bean 时，所有普通类都可以被 Infra 使用并与之兼容。 也就是说，正在开发的类不需要实现任何特定接口或以特定方式编码。只需指定 bean 类就足够了。 但是，根据您为该特定 bean 使用的 IoC 类型，您可能需要一个默认（空）构造函数。 Infra IoC 容器几乎可以管理您希望它管理的任何类。它不仅限于管理真正的 JavaBeans。 大多数 Infra 用户更喜欢只有默认（无参数）构造函数和根据容器中的属性建模的适当 setter 和 getter 的实际 JavaBeans。 您也可以在容器中拥有更多异国情调的非 bean 风格的类。 例如，如果您需要使用绝对不符合 JavaBean 规范的遗留连接池，Infra 也可以管理它。 使用基于 XML 的配置元数据，您可以按如下方式指定 bean 类：

```xml
<bean id="exampleBean" class="examples.ExampleBean"/>

<bean name="anotherExample" class="examples.ExampleBeanTwo"/>
```

##### 使用静态工厂方法实例化

定义使用静态工厂方法创建的 bean 时，使用 class 属性指定包含 static 工厂方法的类，并使用名为 factory-method 的属性指定工厂方法本身的名称。 您应该能够调用此方法（带有可选参数，如下所述）并返回一个活动对象，该对象随后被视为已通过构造函数创建。 这种 bean 定义的一个用途是在遗留代码中调用 static 工厂。 以下 bean 定义指定将通过调用工厂方法来创建 bean。该定义不指定返回对象的类型（类），而是指定包含工厂方法的类。 在此示例中，createInstance() 方法必须是 static 方法。以下示例显示了如何指定工厂方法：

##### 使用实例工厂方法实例化

类似于通过 静态工厂方法 实例化， 使用实例工厂方法实例化会调用容器中现有 bean 的非静态方法来创建新 bean。 要使用此机制，请将 class 属性留空，并在 factory-bean 属性中指定当前（或父或祖先）容器中包含要调用以创建对象的实例方法的 bean 的名称。 使用 factory-method 属性设置工厂方法本身的名称。以下示例显示了如何配置此类 bean：

## 依赖

> 原文：[`core/beans/dependencies`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/dependencies.adoc)

### 概述

一个典型的企业应用程序不是由单个对象（或者在基础架构术语中称为 bean）组成的。 即使是最简单的应用程序也有一些对象一起工作，以呈现最终用户所看到的一致的应用程序。 下一节将解释如何从定义一系列独立的 bean 定义转变为一个完全实现的应用程序，其中对象协作以实现一个目标。

## 自动装配协作者

> 原文：[`core/beans/dependencies/factory-autowire`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/dependencies/factory-autowire.adoc)

### 概述

Infra 容器可以自动装配协作 bean 之间的关系。 您可以通过检查 ApplicationContext 的内容，让 Infra 自动为您的 bean 解析协作者（其他 bean）。 自动装配具有以下优点： 当使用基于 XML 的配置元数据（请参阅 依赖注入）时， 您可以使用 <bean/> 元素的 autowire 属性为 bean 定义指定自动装配模式。 自动装配功能有四种模式。您指定每个 bean 的自动装配，从而可以选择要自动装配的 bean。 下表描述了四种自动装配模式： 使用 byType 或 constructor 自动装配模式，您可以装配数组和类型化集合。 在这种情况下，容器内所有匹配预期类型的自动装配候选者都将被提供以满足依赖项。 如果预期的键类型为 String，您可以自动装配强类型 Map 实例。 自动装配的 Map 实例的值由所有匹配预期类型的 bean 实例

## 依赖注入

> 原文：[`core/beans/dependencies/factory-collaborators`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/dependencies/factory-collaborators.adoc)

### 概述

依赖注入 (DI) 是一个过程，通过该过程，对象仅通过构造函数参数、工厂方法的参数或在对象实例被构造或从工厂方法返回后设置的属性来定义其依赖项（即它们与之工作的其他对象）。 然后，容器在创建 bean 时注入这些依赖项。 这个过程从根本上说是 bean 本身通过使用类的直接构造或 Service Locator 模式来控制其依赖项的实例化或位置的逆过程（因此称为控制反转）。 使用 DI 原则，代码更清晰，当对象提供其依赖项时，解耦更有效。 对象不查找其依赖项，也不知道依赖项的位置或类。 结果，您的类变得更易于测试，特别是当依赖项是接口或抽象基类时，这允许在单元测试中使用存根或模拟实现。 DI 存在两个主要变体：基于构造函数的依赖注入 和 基于 Setter 的依赖注入。

#### 基于构造函数的依赖注入

基于构造函数的 DI 是通过容器调用带有多个参数的构造函数来完成的，每个参数代表一个依赖项。 调用带有特定参数的 static 工厂方法来构造 bean 几乎是等效的，本讨论将类似地对待构造函数的参数和 static 工厂方法的参数。 以下示例显示了一个只能使用构造函数注入进行依赖注入的类：

```java
public class SimpleMovieLister {

  // SimpleMovieLister 依赖于 MovieFinder
  private final MovieFinder movieFinder;

  // 一个构造函数，以便 Infra 容器可以注入 MovieFinder
  public SimpleMovieLister(MovieFinder movieFinder) {
    this.movieFinder = movieFinder;
  }

  // 实际使用注入的 MovieFinder 的业务逻辑被省略...
}
```

##### 构造函数参数解析

构造函数参数解析匹配是通过使用参数的类型进行的。 如果 bean 定义的构造函数参数中不存在潜在的歧义，则在 bean 定义中定义构造函数参数的顺序就是这些参数在实例化 bean 时提供给适当构造函数的顺序。 考虑以下类：

```java
package x.y;

public class ThingOne {

  public ThingOne(ThingTwo thingTwo, ThingThree thingThree) {
    // ...
  }
}
```

#### 基于 Setter 的依赖注入

基于 Setter 的 DI 是通过容器在调用无参数构造函数或无参数 static 工厂方法以实例化 bean 后，调用 bean 上的 setter 方法来完成的。 以下示例显示了一个只能使用纯 setter 注入进行依赖注入的类。 这个类是传统的 Java。它是一个 POJO，不依赖于容器特定的接口、基类或注解。

#### 依赖注入示例

以下示例使用基于 XML 的配置元数据进行基于 setter 的 DI。 Infra XML 配置文件的一小部分指定了一些 bean 定义，如下所示：

## 使用 depends-on

> 原文：[`core/beans/dependencies/factory-dependson`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/dependencies/factory-dependson.adoc)

### 概述

如果一个 bean 是另一个 bean 的依赖项，这通常意味着一个 bean 被设置为另一个 bean 的属性。 通常，您可以使用基于 XML 的配置元数据中的 <<beans-ref-element, <ref/> 元素>> 来完成此操作。 但是，有时 bean 之间的依赖关系不那么直接。 一个例子是当类中的静态初始化程序需要被触发时，例如数据库驱动程序注册。 depends-on 属性可以显式强制一个或多个 bean 在使用此元素的 bean 初始化之前进行初始化。 以下示例使用 depends-on 属性来表示对单个 bean 的依赖关系：

```xml
<bean id="beanOne" class="ExampleBean" depends-on="manager"/>
<bean id="manager" class="ManagerBean" />
```

## 延迟初始化的 Bean

> 原文：[`core/beans/dependencies/factory-lazy-init`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/dependencies/factory-lazy-init.adoc)

### 概述

默认情况下，ApplicationContext 实现会作为初始化过程的一部分急切地创建和配置所有 单例 bean。 通常，这种预实例化是可取的，因为配置或周围环境中的错误会立即被发现，而不是在数小时甚至数天后。 当这种行为不可取时，您可以通过将 bean 定义标记为延迟初始化来阻止单例 bean 的预实例化。 延迟初始化的 bean 告诉 IoC 容器在第一次请求时创建 bean 实例，而不是在启动时。 在 XML 中，此行为由 <bean/> 元素上的 lazy-init 属性控制，如下例所示：

```xml
<bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
<bean name="not.lazy" class="com.something.AnotherBean"/>
```

## 方法注入

> 原文：[`core/beans/dependencies/factory-method-injection`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/dependencies/factory-method-injection.adoc)

### 概述

在大多数应用场景中，容器中的大多数 bean 都是 单例。 当一个单例 bean 需要与另一个单例 bean 协作，或者一个非单例 bean 需要与另一个非单例 bean 协作时，通常通过将一个 bean 定义为另一个 bean 的属性来处理依赖关系。 当 bean 生命周期不同时，就会出现问题。 假设单例 bean A 需要使用非单例（原型）bean B，可能是在 A 的每次方法调用上。 容器只创建一次单例 bean A，因此只有一次机会设置属性。 容器无法在每次需要时为 bean A 提供 bean B 的新实例。 一种解决方案是放弃一些控制反转。 您可以通过实现 ApplicationContextAware 接口 让 bean A 知道容器， 并通过 对容器进行 getBean("B") 调用 在每次 bean A 需要时请求（通常是新的）bean B 实例。 以下示例显示了这种方

```java
package fiona.apple;

// Infra-API imports
import infra.beans.BeansException;
import infra.context.ApplicationContext;
import infra.context.ApplicationContextAware;

/**
 * 一个使用有状态 Command 风格类来执行某些处理的类。
 */
public class CommandManager implements ApplicationContextAware {

  private ApplicationContext applicationContext;

  public Object process(Map commandState) {
    // 获取适当 Command 的新实例
    Command command = createCommand();
    // 设置（希望是全新的）Command 实例的状态
    command.setState(commandState);
    return command.execute();
  }

  protected Command createCommand() {
    // 注意 Infra API 依赖！
    return this.applicationContext.getBean("command", Command.class);
  }

  public void setApplicationContext(
      ApplicationContext applicationContext) throws BeansException {
    this.applicationContext = applicationContext;
  }
}
```

#### 查找方法注入

查找方法注入是容器覆盖容器管理 bean 上的方法并返回容器中另一个命名 bean 的查找结果的能力。 查找通常涉及原型 bean，如 上一节 中描述的场景。 TODAY Framework 通过使用 CGLIB 库中的字节码生成来动态生成覆盖该方法的子类来实现此方法注入。 在前面代码片段中的 CommandManager 类的情况下，Infra 容器动态覆盖 createCommand() 方法的实现。 CommandManager 类没有任何 Infra 依赖项，如重写的示例所示：

```java
package fiona.apple;

// 不再有 Infra 导入！

public abstract class CommandManager {

  public Object process(Object commandState) {
    // 获取适当 Command 接口的新实例
    Command command = createCommand();
    // 设置（希望是全新的）Command 实例的状态
    command.setState(commandState);
    return command.execute();
  }

  // 好的... 但是这个方法的实现哪里去了？
  protected abstract Command createCommand();
}
```

#### 任意方法替换

比查找方法注入不太有用的一种方法注入形式是用另一种方法实现替换托管 bean 中的任意方法的能力。 您可以放心地跳过本节的其余部分，直到您真正需要此功能。 对于基于 XML 的配置元数据，您可以使用 replaced-method 元素将已部署 bean 的现有方法实现替换为另一种方法实现。 考虑以下类，它有一个名为 computeValue 的方法，我们想要覆盖它：

## 依赖项和配置详解

> 原文：[`core/beans/dependencies/factory-properties-detailed`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/dependencies/factory-properties-detailed.adoc)

### 概述

如 上一节 所述，您可以将 bean 属性和构造函数参数定义为对其他托管 bean（协作者）的引用或内联定义的值。 Infra 基于 XML 的配置元数据在其 <property/> 和 <constructor-arg/> 元素内支持子元素类型以实现此目的。

#### 直接值（基本类型、字符串等）

<property/> 元素的 value 属性将属性或构造函数参数指定为人类可读的字符串表示形式。 Infra 转换服务 用于将这些值从 String 转换为属性或参数的实际类型。 以下示例显示了设置的各种值：

```xml
<bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
  <!-- 导致 setDriverClassName(String) 调用 -->
  <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
  <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
  <property name="username" value="root"/>
  <property name="password" value="misterkaoli"/>
</bean>
```

##### idref 元素

idref 元素只是一种防错方法，用于将容器中另一个 bean 的 id（字符串值 - 不是引用）传递给 <constructor-arg/> 或 <property/> 元素。 以下示例显示了如何使用它：

```xml
<bean id="theTargetBean" class="..."/>

<bean id="theClientBean" class="...">
  <property name="targetName">
    <idref bean="theTargetBean"/>
  </property>
</bean>
```

#### 引用其他 Bean（协作者）

ref 元素是 <constructor-arg/> 或 <property/> 定义元素内部的最后一个元素。 在这里，您将 bean 的指定属性的值设置为对容器管理的另一个 bean（协作者）的引用。 引用的 bean 是要设置属性的 bean 的依赖项，并在设置属性之前根据需要进行初始化。（如果协作者是单例 bean，它可能已经由容器初始化。） 所有引用最终都是对另一个对象的引用。作用域和验证取决于您是通过 bean 还是 parent 属性指定另一个对象的 ID 或名称。 通过 <ref/> 标记的 bean 属性指定目标 bean 是最通用的形式，允许创建对同一容器或父容器中任何 bean 的引用，无论它是否在同一 XML 文件中。 bean 属性的值可以与目标 bean 的 id 属性相同，也可以与目标 bean 的 name 属性中的值之一相同。 以下示例显示了如何使用 ref

#### 内部 Bean

<property/> 或 <constructor-arg/> 元素内的 <bean/> 元素定义内部 bean，如下例所示：

#### 集合

<list/>、<set/>、<map/> 和 <props/> 元素分别设置 Java Collection 类型 List、Set、Map 和 Properties 的属性和参数。 以下示例显示了如何使用它们：

##### 集合合并

Infra 容器还支持合并集合。应用程序开发人员可以定义父 <list/>、<map/>、<set/> 或 <props/> 元素， 并让子 <list/>、<map/>、<set/> 或 <props/> 元素继承和覆盖父集合中的值。 也就是说，子集合的值是合并父集合和子集合元素的结果，子集合元素覆盖父集合中指定的值。 关于合并的这一部分讨论了父子 bean 机制。 不熟悉父 bean 和子 bean 定义的读者可能希望在继续之前阅读 相关部分。 以下示例演示了集合合并：

##### 强类型集合

由于 Java 对泛型类型的支持，您可以使用强类型集合。 也就是说，可以声明一种 Collection 类型，使其只能包含（例如）String 元素。 如果您使用 Infra 将强类型 Collection 依赖注入到 bean 中，您可以利用 Infra 类型转换支持， 以便您的强类型 Collection 实例的元素在添加到 Collection 之前转换为适当的类型。 以下 Java 类和 bean 定义显示了如何执行此操作：

#### Null 和空字符串值

Infra 将属性等的空参数视为空 Strings。 以下基于 XML 的配置元数据片段将 email 属性设置为空 String 值 ("")。

#### 使用 p-namespace 的 XML 快捷方式

p-namespace 允许您使用 bean 元素的属性（而不是嵌套的 <property/> 元素）来描述您的属性值协作 bean，或两者兼而有之。 Infra 支持 带有命名空间 的可扩展配置格式，这些格式基于 XML Schema 定义。 本章讨论的 beans 配置格式是在 XML Schema 文档中定义的。 但是，p-namespace 未在 XSD 文件中定义，仅存在于 Infra 核心中。 以下示例显示了解析为相同结果的两个 XML 片段（第一个使用标准 XML 格式，第二个使用 p-namespace）：

#### 使用 c-namespace 的 XML 快捷方式

类似于 使用 p-namespace 的 XML 快捷方式， Infra 3.1 中引入的 c-namespace 允许使用内联属性来配置构造函数参数，而不是嵌套的 constructor-arg 元素。 以下示例使用 c: 命名空间来做与 基于构造函数的依赖注入 相同的事情：

#### 复合属性名称

在设置 bean 属性时，可以使用复合或嵌套属性名称，只要路径的所有组件（最终属性名称除外）都不为 null。 考虑以下 bean 定义：

## Environment 接口

> 原文：[`core/beans/environment`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/environment.adoc)

### 概述

Environment 接口是集成在容器中的一个抽象， 用于模拟应用程序环境的两个关键方面：profiles 和 properties。 配置文件是一个命名的、逻辑上的 bean 定义组，只有在给定配置文件处于活动状态时才会向容器注册。 无论是在 XML 中定义还是使用注解，都可以将 bean 分配给配置文件。Environment 对象与配置文件的关系在于确定当前激活的配置文件（如果有）以及默认情况下应该激活的配置文件（如果有）。 属性在几乎所有应用程序中都起着重要作用，可以来自各种来源：属性文件、JVM 系统属性、系统环境变量、 JNDI 上下文参数、临时 Properties 对象、Map 对象等等。Environment 对象与属性的关系在于为用户提供一个方便的服务接口，用于配置属性源并从中解析属性。

#### Bean Definition Profiles

Bean 定义配置文件提供了一个机制，允许在不同的环境中注册不同的 bean。"environment" 这个词对不同的用户可能有不同的含义，而这个功能可以帮助解决许多用例，包括： 考虑到第一个用例，在需要 DataSource 的实际应用程序中。在测试环境中，配置可能如下所示：

```java
@Bean
public DataSource dataSource() {
  return new EmbeddedDatabaseBuilder()
    .setType(EmbeddedDatabaseType.HSQL)
    .addScript("my-schema.sql")
    .addScript("my-test-data.sql")
    .build();
}
```

##### 使用 @Profile 注解

@Profile 注解允许您指示在一个或多个指定的配置文件处于活动状态时， 组件是否符合注册条件。使用我们之前的示例，我们可以将 dataSource 配置重写如下：

```java
@Configuration
@Profile("development")
public class StandaloneDataConfig {

  @Bean
  public DataSource dataSource() {
    return new EmbeddedDatabaseBuilder()
      .setType(EmbeddedDatabaseType.HSQL)
      .addScript("classpath:com/bank/config/sql/schema.sql")
      .addScript("classpath:com/bank/config/sql/test-data.sql")
      .build();
  }
}
```

##### 使用 XML Profiles

XML 的对应部分是 <beans> 元素的 profile 属性。我们之前的示例配置可以重写为两个 XML 文件，如下所示：

##### 激活 Profile

现在我们已经更新了配置，但我们仍然需要告诉 Infra 哪个 profile 是激活的。 如果我们现在启动示例应用程序，将会看到一个 NoSuchBeanDefinitionException 异常被抛出， 因为容器找不到名为 dataSource 的 Infra bean。 激活一个 profile 可以通过几种方式来完成，但最直接的方式是通过针对 Environment API 进行编程，该 API 可通过 ApplicationContext 获取。以下示例展示了如何做到这一点：

##### 默认 Profile

默认 profile 表示如果没有激活任何 profile，则启用的 profile。考虑以下示例：

#### PropertySource 接口

Infra Environment 抽象提供了对可配置属性源层次结构的搜索操作。请考虑以下清单：

#### 使用 @PropertySource

@PropertySource 注解提供了一个方便和声明性的机制，用于向 Infra Environment 添加 PropertySource。 假设有一个名为 app.properties 的文件，其中包含键值对 testbean.name=myTestBean， 以下 @Configuration 类使用 @PropertySource，使得调用 testBean.getName() 返回 myTestBean：

#### 占位符解析

在历史上，元素中占位符的值只能针对 JVM 系统属性或环境变量进行解析。但现在情况已经不同了。 由于 Environment 抽象已经整合到容器中，因此很容易通过它来路由占位符的解析。 这意味着您可以按照任何您喜欢的方式配置解析过程。您可以更改通过系统属性和环境变量搜索的优先顺序， 或者完全删除它们。您还可以根据需要将自己的属性源添加到混合中。 具体来说，以下语句可以在 customer 属性定义的任何地方正常工作，只要它在 Environment 中可用：

## 容器扩展点

> 原文：[`core/beans/factory-extension`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/factory-extension.adoc)

### 概述

通常，应用程序开发人员不需要继承 ApplicationContext 实现类。 相反，可以通过插入特殊的集成接口实现来扩展 Infra IoC 容器。 接下来的几节将描述这些集成接口。

##### 示例：Hello World，BeanPostProcessor 风格

第一个示例说明了基本用法。 该示例显示了一个自定义 BeanPostProcessor 实现，该实现调用容器创建的每个 bean 的 toString() 方法，并将结果字符串打印到系统控制台。 以下清单显示了自定义 BeanPostProcessor 实现类定义：

```java
package scripting;

import infra.beans.factory.InitializationBeanPostProcessor;

public class InstantiationTracingBeanPostProcessor implements InitializationBeanPostProcessor {

  // 简单地按原样返回实例化的 bean
  public Object postProcessBeforeInitialization(Object bean, String beanName) {
    return bean; // 我们可以在这里返回任何对象引用...
  }

  public Object postProcessAfterInitialization(Object bean, String beanName) {
    System.out.println("Bean '" + beanName + "' created : " + bean);
    return bean;
  }
}
```

##### 示例：类名替换 PropertySourcesPlaceholderConfigurer

您可以使用 PropertySourcesPlaceholderConfigurer 通过使用标准 Java Properties 格式在单独的文件中外部化 bean 定义中的属性值。 这样做使得部署应用程序的人员可以自定义特定于环境的属性，例如数据库 URL 和密码，而无需承担修改容器的主 XML 定义文件的复杂性或风险。 考虑以下基于 XML 的配置元数据片段，其中定义了一个具有占位符值的 DataSource：

```xml
<bean class="infra.context.support.PropertySourcesPlaceholderConfigurer">
  <property name="locations" value="classpath:com/something/jdbc.properties"/>
</bean>

<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
  <property name="driverClassName" value="${jdbc.driverClassName}"/>
  <property name="url" value="${jdbc.url}"/>
  <property name="username" value="${jdbc.username}"/>
  <property name="password" value="${jdbc.password}"/>
</bean>
```

##### 示例：PropertyOverrideConfigurer

PropertyOverrideConfigurer 是另一个 bean 工厂后处理器，类似于 PropertySourcesPlaceholderConfigurer，但与后者不同的是，原始定义可以具有默认值或根本没有 bean 属性的值。 如果覆盖的 Properties 文件没有某个 bean 属性的条目，则使用默认上下文定义。 请注意，bean 定义不知道被覆盖，因此从 XML 定义文件中并不立即显而易见正在使用覆盖配置器。 如果有多个 PropertyOverrideConfigurer 实例为同一 bean 属性定义了不同的值，由于覆盖机制，最后一个获胜。 属性文件配置行采用以下格式： beanName.property=value 以下清单显示了格式的示例： dataSource.driverClassName=com.mysql.jdbc.Driver dataSource

## 自定义 Bean 的性质

> 原文：[`core/beans/factory-nature`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/factory-nature.adoc)

### 概述

TODAY Framework 提供了许多接口，您可以使用这些接口自定义 bean 的性质。本节将它们分组如下：

##### 初始化回调

infra.beans.factory.InitializingBean 接口允许 bean 在容器设置了 bean 上所有必要的属性后执行初始化工作。 InitializingBean 接口指定了一个方法：

```java
void afterPropertiesSet() throws Exception;
```

##### 销毁回调

实现 infra.beans.factory.DisposableBean 接口允许 bean 在包含它的容器被销毁时获得回调。 DisposableBean 接口指定了一个方法：

```java
void destroy() throws Exception;
```

##### 默认初始化和销毁方法

当您编写不使用 Infra 特定的 InitializingBean 和 DisposableBean 回调接口的初始化和销毁方法回调时， 您通常会编写名为 init()、initialize()、dispose() 等的方法。 理想情况下，此类生命周期回调方法的名称应在整个项目中标准化，以便所有开发人员使用相同的方法名称并确保一致性。 您可以配置 Infra 容器以在每个 bean 上“查找”命名的初始化和销毁回调方法名称。 这意味着，作为应用程序开发人员，您可以编写应用程序类并使用名为 init() 的初始化回调， 而无需为每个 bean 定义配置 init-method="init" 属性。 Infra IoC 容器在创建 bean 时调用该方法（并遵循 前面描述的 标准生命周期回调契约）。 此功能还强制执行初始化和销毁方法回调的一致命名约定。 假设您的初始化回调方法名为 init(

##### 启动和关闭回调

Lifecycle 接口为任何具有自身生命周期需求的对象（如启动和停止某些后台进程）定义了基本方法：

##### 在非 Web 应用程序中优雅地关闭 Infra IoC 容器

本节仅适用于非 Web 应用程序。基于 Infra Web 的 ApplicationContext 实现已经具备了在相关 Web 应用程序关闭时优雅地关闭 Infra IoC 容器的代码。 如果您在非 Web 应用程序环境（例如，富客户端桌面环境）中使用 Infra IoC 容器，请向 JVM 注册关闭钩子。 这样做可以确保优雅关闭，并在您的单例 bean 上调用相关的销毁方法，以便释放所有资源。 您仍然必须正确配置和实现这些销毁回调。 要注册关闭钩子，请调用 ConfigurableApplicationContext 接口上声明的 registerShutdownHook() 方法，如下例所示：

#### ApplicationContextAware and BeanNameAware

当 ApplicationContext 创建一个实现 infra.context.ApplicationContextAware 接口的对象实例时，该实例将获得对该 ApplicationContext 的引用。 下面的列表显示了 ApplicationContextAware 接口的定义：

## Bean 作用域

> 原文：[`core/beans/factory-scopes`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/factory-scopes.adoc)

### 概述

当您创建一个 bean 定义时，您实际上是创建了一个用于创建该 bean 定义所定义的类的实际实例的配方（recipe）。 Bean 定义是一个配方的概念很重要，因为这意味着，与类一样，您可以从单个配方创建许多对象实例。 您不仅可以控制要插入到从特定 bean 定义创建的对象中的各种依赖项和配置值，还可以控制从特定 bean 定义创建的对象的范围（scope）。 这种方法功能强大且灵活，因为您可以选择通过配置创建的对象的范围，而不必在 Java 类级别烘焙对象的范围。 Bean 可以定义为部署在多种作用域之一中。 TODAY Framework 支持六种作用域，其中四种仅在您使用感知 Web 的 ApplicationContext 时才可用。 您还可以创建 自定义作用域。 下表描述了支持的作用域： NOTE: 线程作用域（Thread scope）可用，但默认未注册。有关更多信息，请参阅

#### 单例（Singleton）作用域

只管理单例 bean 的一个共享实例，并且所有对具有与该 bean 定义匹配的 ID 的 bean 的请求都会导致 Infra 容器返回该特定的 bean 实例。 换句话说，当您定义一个 bean 定义并且其作用域为单例时，Infra IoC 容器只创建该 bean 定义所定义的对象的一个实例。 此单个实例存储在此类单例 bean 的缓存中，并且对该命名 bean 的所有后续请求和引用都返回缓存的对象。 下图显示了单例作用域的工作原理： image::singleton.png[] Infra 的单例 bean 概念与 Gang of Four (GoF) 模式书中定义的单例模式不同。 GoF 单例硬编码对象的范围，使得每个 ClassLoader 创建且仅创建一个特定类的实例。 Infra 单例的范围最好描述为每个容器和每个 bean。 这意味着，如果您在单个 Infra 容器中为特定类

```xml
<bean id="accountService" class="com.something.DefaultAccountService"/>

<!-- 以下是等效的，尽管是多余的（单例作用域是默认的） -->
<bean id="accountService" class="com.something.DefaultAccountService" scope="singleton"/>
```

#### 原型（Prototype）作用域

Bean 部署的非单例原型作用域导致每次请求该特定 bean 时都会创建一个新的 bean 实例。 也就是说，bean 被注入到另一个 bean 中，或者您通过容器上的 getBean() 方法调用请求它。 作为规则，您应该对所有有状态 bean 使用原型作用域，对无状态 bean 使用单例作用域。 下图说明了 Infra 原型作用域： image::prototype.png[] (数据访问对象 (DAO) 通常不配置为原型，因为典型的 DAO 不持有任何会话状态。我们要重用单例图的核心更容易。) 以下示例在 XML 中将 bean 定义为原型：

```xml
<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>
```

##### Request 作用域

考虑以下 bean 定义的 XML 配置：

##### Session 作用域

考虑以下 bean 定义的 XML 配置：

##### 作用域 Bean 作为依赖项

Infra IoC 容器不仅管理对象（bean）的实例化，还管理协作者（或依赖项）的装配。 如果您想将（例如）HTTP 请求作用域的 bean 注入到另一个具有更长寿命作用域的 bean 中，您可能选择注入 AOP 代理来代替作用域 bean。 也就是说，您需要注入一个代理对象，该对象公开与作用域对象相同的公共接口，但也能够从相关作用域（如 HTTP 请求）中检索真实的目标对象，并将方法调用委托给真实对象。 您也可以在作用域为 singleton 的 bean 之间使用 <aop:scoped-proxy/>， 然后引用通过中间代理，该代理是可序列化的，因此能够在反序列化时重新获取目标单例 bean。 当针对作用域为 prototype 的 bean 声明 <aop:scoped-proxy/> 时，共享代理上的每个方法调用都会导致创建一个新的目标实例，然后将调用转发给该实例。 此外，作用

##### 选择要创建的代理类型

默认情况下，当 Infra 容器为标记有 <aop:scoped-proxy/> 元素的 bean 创建代理时，将创建基于 CGLIB 的类代理。 CGLIB 代理不拦截私有方法。试图在此类代理上调用私有方法将不会委托给实际的作用域目标对象。 或者，您可以配置 Infra 容器为此类作用域 bean 创建基于标准 JDK 接口的代理，方法是将 <aop:scoped-proxy/> 元素的 proxy-target-class 属性的值指定为 false。 使用基于 JDK 接口的代理意味着您不需要在应用程序类路径中使用其他库来实现此类代理。 但是，这也意味着作用域 bean 的类必须实现至少一个接口，并且注入作用域 bean 的所有协作者必须通过其接口之一引用 bean。 以下示例显示了基于接口的代理：

##### 创建自定义作用域

要将自定义作用域集成到 Infra 容器中，您需要实现 infra.beans.factory.config.Scope 接口，本节将对此进行描述。 要了解如何实现自己的作用域，请参阅 TODAY Framework 本身提供的 Scope 实现以及 Scope javadoc，其中更详细地解释了您需要实现的方法。 Scope 接口有四个方法用于从作用域中获取对象、从作用域中移除对象以及让它们被销毁。 例如，会话作用域实现返回会话作用域的 bean（如果不存在，该方法将返回 bean 的新实例，并将其绑定到会话以供将来参考）。以下方法从底层作用域返回对象：

##### 使用自定义作用域

在编写并测试一个或多个自定义 Scope 实现后，您需要让 Infra 容器知道您的新作用域。 以下方法是将新 Scope 注册到 Infra 容器的核心方法：

## IoC 容器和 Bean 简介

> 原文：[`core/beans/introduction`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/introduction.adoc)

### 概述

本章详细介绍了TODAY框架如何实现控制反转（IoC）原则。依赖注入（DI）是IoC的一种特定实现方式， 其中对象仅通过构造函数参数、工厂方法的参数或对象构造后或从工厂方法返回后设置的属性来定义它们所依赖的其他对象。 然后，IoC容器在创建Bean实例时会自动注入这些依赖项。这个过程的核心思想是， 与Bean自身通过直接实例化类或使用如服务定位器模式等方式来控制其依赖项的创建或定位相反， IoC容器负责管理和注入依赖项，从而实现了控制反转的概念。 实现 IoC 容器的包主要是 infra.beans 和 infra.context BeanFactory 接口提供了能够管理任何类型对象的高级配置机制。 ApplicationContext 继承自 BeanFactory。 它添加了: 简而言之，BeanFactory 提供了配置框架和基本功能，ApplicationContext 添加了更

## 基于 Java 的容器配置

> 原文：[`core/beans/java`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/java.adoc)

### 概述

本节介绍如何在 Java 代码中使用注释来配置 IoC 容器。

## 基本概念：@Bean 和 @Configuration

> 原文：[`core/beans/java/basic-concepts`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/java/basic-concepts.adoc)

### 概述

Infra Java 配置支持中的核心构件是 @Configuration 注解的类和 @Bean 注解的方法。 @Bean 注解用于指示一个方法实例化、配置和初始化一个由 Infra IoC 容器管理的新对象。 对于熟悉 Infra <beans/> XML 配置的人来说，@Bean 注解扮演的角色与 <bean/> 元素相同。 您可以将 @Bean 注解的方法与任何 Infra @Component 一起使用。 但是，它们最常与 @Configuration bean 一起使用。 用 @Configuration 注解一个类表明其主要目的是作为 bean 定义的来源。 此外，@Configuration 类允许通过调用同一类中的其他 @Bean 方法来定义 bean 之间的依赖关系。 最简单的 @Configuration 类如下所示：

```java
@Configuration
public class AppConfig {

  @Bean
  public MyServiceImpl myService() {
    return new MyServiceImpl();
  }
}
```

## 使用 @Bean 注解

> 原文：[`core/beans/java/bean-annotation`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/java/bean-annotation.adoc)

### 概述

@Bean 是一个方法级注解，是 XML <bean/> 元素的直接模拟。 该注解支持 <bean/> 提供的一些属性，例如： 您可以在 @Configuration 注解的类或 @Component 注解的类中使用 @Bean 注解。

#### 声明 Bean

要声明 bean，您可以使用 @Bean 注解对方法进行注解。 您使用此方法在 ApplicationContext 中注册一个 bean 定义，其类型指定为方法的返回值。 默认情况下，bean 名称与方法名称相同。以下示例显示了 @Bean 方法声明：

```java
@Configuration
public class AppConfig {

  @Bean
  public TransferServiceImpl transferService() {
    return new TransferServiceImpl();
  }
}
```

#### Bean 依赖项

@Bean 注解的方法可以有任意数量的参数，描述构建该 bean 所需的依赖项。 例如，如果我们的 TransferService 需要一个 AccountRepository，我们可以通过方法参数具体化该依赖项，如下例所示：

```java
@Configuration
public class AppConfig {

  @Bean
  public TransferService transferService(AccountRepository accountRepository) {
    return new TransferServiceImpl(accountRepository);
  }
}
```

#### 接收生命周期回调

任何使用 @Bean 注解定义的类都支持常规生命周期回调，并可以使用 JSR-250 中的 @PostConstruct 和 @PreDestroy 注解。 有关更多详细信息，请参阅 JSR-250 注解。 完全支持常规 Infra 生命周期 回调。 如果 bean 实现 InitializingBean、DisposableBean 或 Lifecycle，则容器会调用它们各自的方法。 也完全支持标准集 *Aware 接口（例如 BeanFactoryAware、 BeanNameAware、 MessageSourceAware、 ApplicationContextAware 等）。 @Bean 注解支持指定任意初始化和销毁回调方法，就像 Infra XML 中 bean 元素上的 init-method 和 destroy-method 属性一样，如下例所示：

##### 使用 @Scope 注解

您可以指定使用 @Bean 注解定义的 bean 应具有特定的作用域。 您可以使用 Bean 作用域 部分中指定的任何标准作用域。 默认作用域是 singleton，但您可以使用 @Scope 注解覆盖它，如下例所示：

##### @Scope 和 scoped-proxy

Infra 提供了一种通过 作用域代理 处理作用域依赖项的便捷方式。 在使用 XML 配置时创建此类代理的最简单方法是 <aop:scoped-proxy/> 元素。 在 Java 中使用 @Scope 注解配置 bean 提供了与 proxyMode 属性等效的支持。 默认值为 ScopedProxyMode.DEFAULT，这通常表示除非在组件扫描指令级别配置了不同的默认值，否则不应创建作用域代理。 您可以指定 ScopedProxyMode.TARGET_CLASS、ScopedProxyMode.INTERFACES 或 ScopedProxyMode.NO。 如果您将作用域代理示例从 XML 参考文档（请参阅 作用域代理）移植到使用 Java 的 @Bean，它类似于以下内容：

#### 自定义 Bean 命名

默认情况下，配置类使用 @Bean 方法的名称作为生成的 bean 的名称。 但是，可以使用 name 属性覆盖此功能，如下例所示：

#### Bean 别名

如 命名 Bean 中所述，有时希望给单个 bean 提供多个名称，也称为 bean 别名。 @Bean 注解的 name 属性为此目的接受一个 String 数组。 以下示例显示了如何为 bean 设置多个别名：

#### Bean 描述

有时，提供 bean 的更详细文本描述很有帮助。 当 bean 被公开（可能通过 JMX）以进行监控时，这特别有用。 要向 @Bean 添加描述，可以使用 @Description 注解，如下例所示：

## 组合基于 Java 的配置

> 原文：[`core/beans/java/composing-configuration-classes`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/java/composing-configuration-classes.adoc)

### 概述

Infra 基于 Java 的配置功能允许您组合注解，从而降低配置的复杂性。

#### 使用 @Import 注解

就像在 Infra XML 文件中使用 <import/> 元素来帮助模块化配置一样， @Import 注解允许从另一个配置类加载 @Bean 定义，如下例所示：

```java
@Configuration
public class ConfigA {

  @Bean
  public A a() {
    return new A();
  }
}

@Configuration
@Import(ConfigA.class)
public class ConfigB {

  @Bean
  public B b() {
    return new B();
  }
}
```

##### 注入对导入的 @Bean 定义的依赖

前面的例子是有效的，但很简单的。在大多数实际场景中，bean 跨配置类彼此依赖。 使用 XML 时，这不是问题，因为不涉及编译器，您可以声明 ref="someBean" 并相信 Infra 在容器初始化期间会解决它。 当使用 @Configuration 类时，Java 编译器对配置模型施加了约束，即对其他 bean 的引用必须是有效的 Java 语法。 幸运的是，解决这个问题很简单。正如 我们已经讨论过的， @Bean 方法可以有任意数量的参数来描述 bean 依赖项。 考虑以下更真实的场景，其中有几个 @Configuration 类，每个类都依赖于其他类中声明的 bean：

```java
@Configuration
public class ServiceConfig {

  @Bean
  public TransferService transferService(AccountRepository accountRepository) {
    return new TransferServiceImpl(accountRepository);
  }
}

@Configuration
public class RepositoryConfig {

  @Bean
  public AccountRepository accountRepository(DataSource dataSource) {
    return new JdbcAccountRepository(dataSource);
  }
}

@Configuration
@Import({ServiceConfig.class, RepositoryConfig.class})
public class SystemTestConfig {

  @Bean
  public DataSource dataSource() {
    // return new DataSource
  }
}

public static void main(String[] args) {
  ApplicationContext ctx = new AnnotationConfigApplicationContext(SystemTestConfig.class);
  // 一切都在配置类之间连接起来...
  TransferService transferService = ctx.getBean(TransferService.class);
  transferService.transfer(100.00, "A123", "C456");
}
```

#### 有条件地包含 @Configuration 类或 @Bean 方法

根据某些任意系统状态有条件地启用或禁用完整的 @Configuration 类甚至单个 @Bean 方法通常很有用。 这方面的一个常见示例是使用 @Profile 注解仅在 Infra Environment 中启用了特定配置文件时才激活 bean（有关详细信息，请参阅 Bean 定义配置文件）。 @Profile 注解实际上是通过使用名为 @Conditional 的更灵活的注解来实现的。 @Conditional 注解指示在注册 @Bean 之前应咨询的特定 infra.context.annotation.Condition 实现。 Condition 接口的实现提供了一个返回 true 或 false 的 matches(...) 方法。 例如，以下清单显示了用于 @Profile 的实际 Condition 实现：

##### 以 XML 为中心的 @Configuration 类使用

最好从 XML 引导 Infra 容器并以临时方式包含 @Configuration 类。 例如，在使用 Infra XML 的大型现有代码库中，更容易按需创建 @Configuration 类并将其包含在现有 XML 文件中。 在本节后面，我们将介绍在这种“以 XML 为中心”的情况下使用 @Configuration 类的选项。 -- 请记住，@Configuration 类最终是容器中的 bean 定义。 在这个系列示例中，我们创建一个名为 AppConfig 的 @Configuration 类，并将其作为 <bean/> 定义包含在 system-test-config.xml 中。 因为 <context:annotation-config/> 已打开，容器会识别 @Configuration 注解并正确处理 AppConfig 中声明的 @Bean 方法。 以下示例显示了 J

##### 以 @Configuration 类为中心的 XML 使用与 @ImportResource

在 @Configuration 类是配置容器的主要机制的应用程序中，仍然可能需要使用至少一些 XML。 在这些场景中，您可以使用 @ImportResource 并仅定义您需要的 XML。 这样做可以实现“以 Java 为中心”的方法来配置容器，并将 XML 保持在最低限度。 以下示例（包括配置类、定义 bean 的 XML 文件、属性文件和 main 类）显示了如何使用 @ImportResource 注解来实现按需使用 XML 的“以 Java 为中心”的配置：

## 使用 @Configuration 注解

> 原文：[`core/beans/java/configuration-annotation`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/java/configuration-annotation.adoc)

### 概述

@Configuration 是一个类级注解，指示对象是 bean 定义的来源。 @Configuration 类通过 @Bean 注解的方法声明 bean。 对 @Configuration 类上的 @Bean 方法的调用也可用于定义 bean 之间的依赖关系。 有关一般介绍，请参阅 基本概念：@Bean 和 @Configuration。

#### 注入 Bean 之间的依赖关系

当 bean 彼此依赖时，表达这种依赖关系就像让一个 bean 方法调用另一个 bean 方法一样简单，如下例所示：

```java
@Configuration
public class AppConfig {

  @Bean
  public BeanOne beanOne() {
    return new BeanOne(beanTwo());
  }

  @Bean
  public BeanTwo beanTwo() {
    return new BeanTwo();
  }
}
```

#### 查找方法注入

如前所述，查找方法注入 是一项高级功能，您应很少使用。 在单例作用域 bean 依赖于原型作用域 bean 的情况下，它非常有用。 为此类型的配置使用 Java 提供了一种实现此模式的自然手段。 以下示例显示了如何使用查找方法注入：

```java
public abstract class CommandManager {
  public Object process(Object commandState) {
    // 获取适当 Command 接口的新实例
    Command command = createCommand();
    // 设置（希望是全新的）Command 实例的状态
    command.setState(commandState);
    return command.execute();
  }

  // 好的... 但是这个方法的实现哪里去了？
  protected abstract Command createCommand();
}
```

#### 关于基于 Java 的配置如何在内部工作的更多信息

考虑以下示例，该示例显示了被调用两次的 @Bean 注解方法：

## 使用 AnnotationConfigApplicationContext 实例化 Infra 容器

> 原文：[`core/beans/java/instantiating-container`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/java/instantiating-container.adoc)

### 概述

以下部分记录了 Infra 3.0 中引入的 Infra AnnotationConfigApplicationContext。 这个多功能的 ApplicationContext 实现不仅能够接受 @Configuration 类作为输入，还能够接受普通的 @Component 类和使用 JSR-330 元数据注解的类。 当提供 @Configuration 类作为输入时，@Configuration 类本身被注册为 bean 定义，并且类中所有声明的 @Bean 方法也被注册为 bean 定义。 当提供 @Component 和 JSR-330 类时，它们被注册为 bean 定义，并且假设在必要时在这些类中使用 DI 元数据，例如 @Autowired 或 @Inject。

#### 简单构造

就像实例化 ClassPathXmlApplicationContext 时使用 Infra XML 文件作为输入一样， 您可以在实例化 AnnotationConfigApplicationContext 时使用 @Configuration 类作为输入。 这允许完全不使用 XML 的 Infra 容器使用，如下例所示：

```java
public static void main(String[] args) {
  ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
  MyService myService = ctx.getBean(MyService.class);
  myService.doStuff();
}
```

#### 使用 register(Class<?>...) 以编程方式构建容器

您可以使用无参数构造函数实例化 AnnotationConfigApplicationContext，然后使用 register() 方法对其进行配置。 这种方法在以编程方式构建 AnnotationConfigApplicationContext 时特别有用。 以下示例显示了如何执行此操作：

```java
public static void main(String[] args) {
  AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
  ctx.register(AppConfig.class, OtherConfig.class);
  ctx.register(AdditionalConfig.class);
  ctx.refresh();
  MyService myService = ctx.getBean(MyService.class);
  myService.doStuff();
}
```

#### 使用 scan(String...) 启用组件扫描

要启用组件扫描，您可以按如下方式注解您的 @Configuration 类：

## 使用 JSR 330 标准注解

> 原文：[`core/beans/standard-annotations`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/beans/standard-annotations.adoc)

### 概述

Infra 支持 JSR-330 标准注解（依赖注入）。这些注解的扫描方式与 Infra 注解相同。 要使用它们，您需要在类路径中有相关的 jar。 如果您使用 Maven，jakarta.inject 工件在标准 Maven 存储库中可用 ( https://repo.maven.apache.org/maven2/jakarta/inject/jakarta.inject-api/2.0.0/). 您可以将以下依赖项添加到您的 pom.xml 文件中：

```xml
<dependency>
  <groupId>jakarta.inject</groupId>
  <artifactId>jakarta.inject-api</artifactId>
  <version>2.0.0</version>
</dependency>
```

#### 使用 @Inject 和 @Named 进行依赖注入

代替 @Autowired，您可以使用 @jakarta.inject.Inject，如下所示：

```java
import jakarta.inject.Inject;

public class SimpleMovieLister {

  private MovieFinder movieFinder;

  @Inject
  public void setMovieFinder(MovieFinder movieFinder) {
    this.movieFinder = movieFinder;
  }

  public void listMovies() {
    this.movieFinder.findMovies(...);
    // ...
  }
}
```

#### @Named 和 @ManagedBean: @Component 注解的标准等效项

代替 @Component，您可以使用 @jakarta.inject.Named 或 jakarta.annotation.ManagedBean，如下例所示：

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
