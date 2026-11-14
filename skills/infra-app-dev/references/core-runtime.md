# 容器运行时与通用设施

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

资源加载、日志、空值安全、DataBuffer/编解码、AOT、XML Schema、整体架构。

覆盖文档：11 页（含示例 6 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- **资源抽象（Resources）** —— `core/resources`
- **日志记录** —— `core/logger`
- 空安全 —— `core/null-safety`
- **数据缓冲区和编解码器** —— `core/databuffer-codec`
- **提前编译（AOT）优化** —— `core/aot`
- 附录 —— `core/appendix`
- 应用启动步骤 —— `core/appendix/application-startup-steps`
- **XML Schema 编写** —— `core/appendix/xml-custom`
- **XML Schemas** —— `core/appendix/xsd-schemas`
- 系统架构 —— `architecture`
- 概述 —— `overview`

## 资源抽象（Resources）

> 原文：[`core/resources`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/resources.adoc)

### 概述

本章介绍我们如何处理资源以及如何使用资源（Resource）：它包括以下主题：

#### Resource 接口

Resource 接口在 infra.core.io. 包中。它的出现抽象各种资源成为可能。 详细 API 可以查看 Resource.

```java
public interface Resource extends InputStreamSource {

  boolean exists();

  boolean isReadable();

  boolean isOpen();

  boolean isFile();

  URL getURL() throws IOException;

  URI getURI() throws IOException;

  File getFile() throws IOException;

  ReadableByteChannel readableChannel() throws IOException;

  long contentLength() throws IOException;

  long lastModified() throws IOException;

  Resource createRelative(String relativePath) throws IOException;

  String getName();

}
```

##### UrlResource

UrlResource 包装了 java.net.URL 他能访问 URL 能够访问的所有资源。比如 文件， HTTP 资源，FTP等。 所有 URL 都有标准化的字符串表示形式，以便适当的标准化前缀用于指示一种 URL 类型与另一种 URL 类型。 这包括 file: 用于访问文件系统路径，https: 用于通过以下方式访问资源 HTTPS 协议、ftp: 用于通过 FTP 等访问资源。 UrlResource 一般使用一个包含字符串的构造器构造。这个字符串一般是代表着一条路径。

```java
var resource = new UrlResource("http://localhost:9090");
    resource = UrlResource.from("http://localhost:9090");
```

##### ByteArrayResource

该实现是为了适配一个现有的 字节数组。getInputStream() 方法将返回一个 ByteArrayInputStream。

#### ResourceLoader 接口

ResourceLoader 接口用来获取查找 Resource 对象。

#### PatternResourceLoader 接口

PatternResourceLoader 接口继承了（扩展了） ResourceLoader 接口。 他支持 ResourceLoader 的功能以外还支持解析符合通配符的一系列资源。

#### ResourceLoaderAware 接口

ResourceLoaderAware 接口是一个特殊的回调接口，它标识期望提供 ResourceLoader 引用的组件。 以下显示了 ResourceLoaderAware 接口的定义：

#### 当资源作为依赖项时

如果 bean 本身依赖了某种资源，那么当然可以考虑使用 ResourceLoader 接口或者 PatternResourceLoader 接口去加载资源。 但也可以直接注入一个 Resource 对象。这个资源对象将是动态的（ 对于静态的资源获取 使用 ResourceLoader 接口（或 PatternResourceLoader 接口）更好）。 动态的资源底层使用 JavaBeans PropertyEditor，它可以转换 String 路径到 Resource 对象。 例如，以下 MyBean 类有一个 template。

##### 构造 Application Contexts

一个 application context 构造器（针对特定应用程序上下文类型）通常是接受一个字符串或字符串数组作为资源的位置路径， 例如构成上下文定义的 XML 文件。 当这样的位置路径没有前缀时，得到的 Resource 用于加载 Bean 定义取决于具体的 application context 。 例如以下示例，创建了一个 ClassPathXmlApplicationContext：

##### 构造 ClassPathXmlApplicationContext 实例 -- 快捷方式

ClassPathXmlApplicationContext 提供了几个好用的构造器，基本思想是你可以仅提供一个字符串数组仅包含 XML 文件本身的文件名 （没有前导路径信息）并提供一个 Class。 一下是资源目录布局: com/ 下面的 ClassPathXmlApplicationContext 实例，在类路径下定义了 services.xml 和 repositories.xml

##### classpath*: 前缀

当构建基于 XML 的 application context 时，定位字符串可以使用特殊的 classpath*: 前缀，如下例所示：

##### FileSystemResource 注意事项

一个未附加到 FileSystemApplicationContext 的 FileSystemResource （也就是说，当 FileSystemApplicationContext 不是实际的 ResourceLoader 时）， 会按照您所期望的方式处理绝对和相对路径。相对路径是相对于当前工作目录，而绝对路径是相对于文件系统的根目录。

## 日志记录

> 原文：[`core/logger`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/logger.adoc)

### 概述

下面的例子通过 infra.logging.LoggerFactory 获取 Logger 对象；

```java
public class MyBean {
  private final Logger logger = LoggerFactory.getLogger(getClass());
  // ...

}
```

## 空安全

> 原文：[`core/null-safety`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/null-safety.adoc)

### 概述

我们在 infra.lang 包下提供了一些注解，能够帮助你声明 API 和字段的可为空性，可以在一定程度上减少 BUG ： 在特定参数、返回值或字段不能为 null（参数、返回值、以及分别适用 @NonNullApi 和 @NonNullFields 的字段）。 框架代码本身利用了这些注解，但它们也可以用于任何基于该框架的 Java 项目，用于声明空安全 API 和可选的空安全字段。 尚不支持泛型类型参数、可变参数和数组元素的可为空声明。

## 数据缓冲区和编解码器

> 原文：[`core/databuffer-codec`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/databuffer-codec.adoc)

### 概述

Java NIO 提供了 ByteBuffer，但许多库在其之上构建了自己的字节缓冲区 API， 特别是对于网络操作，其中重用缓冲区和/或使用直接缓冲区有利于性能。例如，Netty 使用 ByteBuf 结构， Undertow 使用 XNIO，Jetty 使用带有释放回调的池化字节缓冲区，等等。 infra-core 模块提供了一组抽象，以处理各种字节缓冲区 API，如下所示： 池化、

#### 使用 DataBuffer

在处理数据缓冲区时，必须特别注意确保释放缓冲区，因为它们可能是 池化的 的。我们将使用编解码器来说明这是如何工作的，但这些概念通常适用。让我们看看编解码器在内部如何管理数据缓冲区。 Decoder 是最后一个读取输入数据缓冲区的对象，在创建更高级别对象之前，因此它必须按以下方式释放它们： filter、skip 和其他排除项的操作符，则必须将 doOnDiscard(DataBuffer.class, DataBuffer::release) 添加到组合链中，以确保在被丢弃之前释放这些缓冲区，可能还包括作为错误或取消信号的结果而被丢弃。 请注意，DataBufferUtils#join 提供了一种安全高效的方式将数据缓冲流聚合成单个数据缓冲区。同样， skipUntilByteCount 和 takeUntilByteCount 是解码器使用的额外安全方法。 Encoder 分配其他对象必

```java
DataBuffer buffer = factory.allocateBuffer();
boolean release = true;
try {
  // serialize and populate buffer..
  release = false;
}
finally {
  if (release) {
    buffer.release();
  }
}
return buffer;
```

## 提前编译（AOT）优化

> 原文：[`core/aot`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/aot.adoc)

### 概述

这一章涵盖了 Infra Ahead of Time (AOT) 优化。 对于集成测试特定的 AOT 支持, 参见 测试的 AOT 支持.

#### AOT 处理的刷新

AOT 处理的刷新在所有 GenericApplicationContext 实现上都受支持。 应用程序上下文是通过任意数量的入口点创建的，通常以 @Configuration 注解的类的形式。 一个基本示例：

```java
@Configuration(proxyBeanMethods=false)
@ComponentScan
@Import({DataSourceConfiguration.class, ContainerConfiguration.class})
public class MyApplication {
}

class DataSourceConfiguration {
}

class ContainerConfiguration {
}
```

##### Bean 注册的 AOT 贡献

一个核心的 BeanFactoryInitializationAotProcessor 实现负责收集每个候选 BeanDefinition 的必要贡献。 它使用专门的 BeanRegistrationAotProcessor 来实现这一点。 这个接口的使用如下： AutowiredAnnotationBeanPostProcessor 实现了这个接口，以生成代码，注入带有 @Autowired 注解的成员。 如果一个 bean 实现了 BeanRegistrationAotProcessor 接口，那么该 bean 和 所有 它的依赖项都将在 AOT 处理期间初始化。 我们通常建议只有基础设施 bean，如 BeanFactoryPostProcessor，才实现这个接口，这些 bean 的依赖性有限，并且在 bean 工厂的生命周期早期已经初始化。 如果使用 @Bean 工厂方法注册这样

```java
@Configuration(proxyBeanMethods = false)
public class DataSourceConfiguration {

  @Bean
  public SimpleDataSource dataSource() {
    return new SimpleDataSource();
  }

}
```

##### 暴露最精确的 Bean 类型

尽管您的应用程序可能与一个 bean 实现的接口进行交互，但声明最精确的类型仍然非常重要。 AOT 引擎对 bean 类型执行额外的检查，例如检测是否存在 @Autowired 成员或生命周期回调方法。 对于 @Configuration 类，请确保工厂 @Bean 方法的返回类型尽可能精确。 考虑以下示例：

##### FactoryBean

应谨慎使用 FactoryBean，因为它在bean类型解析方面引入了一个中间层，这在概念上可能并不必要。 作为一个经验法则，如果 FactoryBean 实例不持有长期状态，并且在运行时不需要在以后的某个时间点使用它，那么它应该被一个普通的工厂方法替换， 可能在顶部使用一个 FactoryBean 适配器层（用于声明性配置目的）。 如果你的 FactoryBean 实现不解析对象类型（即 T），则需要格外小心。 考虑以下示例：

##### JPA

WARNING: 5.0 将不在支持 JPA 对于某些优化要应用，必须预先知道 JPA 持久化单元。 考虑以下基本示例：

#### 运行时提示

在将应用程序作为本机镜像运行时，与常规 JVM 运行时相比，需要额外的信息。 例如，GraalVM 需要提前知道组件是否使用了反射。 同样，除非明确指定，否则类路径资源不会包含在本机镜像中。 因此，如果应用程序需要加载资源，则必须从相应的 GraalVM 本机镜像配置文件中引用。 RuntimeHints API 在运行时收集了反射、资源加载、序列化和 JDK 代理的需求。 以下示例确保 config/app.properties 可以在本机镜像中的运行时从类路径加载：

##### @ImportRuntimeHints

RuntimeHintsRegistrar 实现允许您获取由 AOT 引擎管理的 RuntimeHints 实例的回调。 可以使用 @ImportRuntimeHints 注解在任何 Infra bean 或 @Bean 工厂方法上注册此接口的实现。 RuntimeHintsRegistrar 实现在构建时被检测并调用。

##### @RegisterReflection

@RegisterReflection 是 @Reflective 的一个特化，它提供了一种声明式的方式来为任意类型注册反射。 在以下示例中，可以通过反射调用 AccountService 上的公共构造函数和公共方法：

##### @RegisterReflectionForBinding

@RegisterReflectionForBinding 是 @Reflective 的一种特化，用于注册序列化任意类型的需求。典型用例是使用容器无法推断的 DTO，例如在方法体中使用 Web 客户端。 @RegisterReflectionForBinding 可以应用于类级别的任何 Infra bean，但也可以直接应用于方法、字段或构造函数，以更好地指示实际需要提示的位置。 以下示例注册 Account 进行序列化。

##### 测试运行时提示

Infra Core 还提供了 RuntimeHintsPredicates，这是一个用于检查现有提示是否与特定用例匹配的实用工具。 您可以在自己的测试中使用它来验证 RuntimeHintsRegistrar 包含了预期的结果。 我们可以为我们的 SpellCheckService 编写一个测试，并确保我们能够在运行时加载字典：

## 附录

> 原文：[`core/appendix`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/appendix.adoc)

### 概述

## 应用启动步骤

> 原文：[`core/appendix/application-startup-steps`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/appendix/application-startup-steps.adoc)

### 概述

WARNING: 每个启动步骤的名称和详细信息不属于公共契约，可能会发生变化；这被视为核心容器的实现细节，并将随其行为变化而调整。

## XML Schema 编写

> 原文：[`core/appendix/xml-custom`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/appendix/xml-custom.adoc)

### 概述

自 2.0 版本以来，Infra 引入了一种机制，用于向定义和配置 bean 的基本 Infra XML 格式添加基于模式的扩展。 本节介绍如何编写自己的自定义 XML bean 定义解析器，并将这些解析器集成到 Infra IoC 容器中。 为了便于编写使用感知模式的 XML 编辑器的配置文件，Infra 的可扩展 XML 配置机制基于 XML Schema。 如果您不熟悉标准 Infra 发行版附带的当前 XML 配置扩展，您应该首先阅读上一节 XML Schemas。 要创建新的 XML 配置扩展： 作为一个统一的示例，我们创建一个 XML 扩展（一个自定义 XML 元素），让我们配置 SimpleDateFormat 类型（来自 java.text 包）的对象。 完成后，我们将能够如下定义 SimpleDateFormat 类型的 bean 定义：

```xml
<myns:dateformat id="dateFormat" pattern="yyyy-MM-dd HH:mm" lenient="true"/>
```

#### 编写 Schema

创建用于 Infra IoC 容器的 XML 配置扩展首先要编写一个 XML Schema 来描述该扩展。 对于我们的示例，我们使用以下模式来配置 SimpleDateFormat 对象： myns.xsd (在 infra/samples/xml 包内)

```xml

<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="http://www.mycompany.example/schema/myns"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:beans="http://www.springframework.org/schema/beans"
    targetNamespace="http://www.mycompany.example/schema/myns"
    elementFormDefault="qualified"
    attributeFormDefault="unqualified">

  <xsd:import namespace="http://www.springframework.org/schema/beans"/>

  <xsd:element name="dateformat">
    <xsd:complexType>
      <xsd:complexContent>
        <xsd:extension base="beans:identifiedType"> <1>
          <xsd:attribute name="lenient" type="xsd:boolean"/>
          <xsd:attribute name="pattern" type="xsd:string" use="required"/>
        </xsd:extension>
      </xsd:complexContent>
    </xsd:complexType>
  </xsd:element>
</xsd:schema>
```

#### 编写 NamespaceHandler

除了模式之外，我们还需要一个 NamespaceHandler 来解析 Infra 在解析配置文件时遇到的此特定命名空间的所有元素。 对于此示例，NamespaceHandler 应负责解析 myns:dateformat 元素。 NamespaceHandler 接口具有三个方法： 虽然您可以为整个命名空间编写自己的 NamespaceHandler（从而提供解析命名空间中每个元素的代码）， 但通常情况下，Infra XML 配置文件中的每个顶级 XML 元素都会产生一个 bean 定义（就像我们的例子一样，其中单个 <myns:dateformat/> 元素产生单个 SimpleDateFormat bean 定义）。 Infra 具有许多支持此场景的便利类。在以下示例中，我们使用 NamespaceHandlerSupport 类：

#### 使用 BeanDefinitionParser

如果 NamespaceHandler 遇到已映射到特定 bean 定义解析器（在本例中为 dateformat）类型的 XML 元素，则使用 BeanDefinitionParser。 换句话说，BeanDefinitionParser 负责解析模式中定义的一个不同的顶级 XML 元素。 在解析器中，我们可以访问 XML 元素（从而也可以访问其子元素），以便我们可以解析我们的自定义 XML 内容，如下例所示：

#### 在您的 Infra XML 配置中使用自定义扩展

使用您自己实现的自定义扩展与使用 Infra 提供的“自定义”扩展没有什么不同。 以下示例在 Infra XML 配置文件使用了在前面的步骤中开发的自定义 <dateformat/> 元素：

##### 在自定义元素中嵌套自定义元素

本节中介绍的示例展示了如何编写满足以下配置目标的各种工件：

##### “普通”元素上的自定义属性

编写自己的自定义解析器和相关工件并不难。然而，有时这不是正确的事情。 考虑一种场景，您需要将元数据添加到现有的 bean 定义中。在这种情况下，您肯定不想编写自己的整个自定义扩展。 相反，您只想向现有的 bean 定义元素添加一个附加属性。 举个例子，假设您为服务对象定义了一个 bean 定义，该服务对象（它不知道）访问集群 JCache， 并且您希望确命名 JCache 实例在周围的集群中急切启动。 以下清单显示了这样的定义：

## XML Schemas

> 原文：[`core/appendix/xsd-schemas`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/appendix/xsd-schemas.adoc)

### 概述

附录的这一部分列出了与核心容器相关的 XML 模式。

#### util Schema

顾名思义，util 标签处理通用的、实用性的配置问题，例如配置集合、引用常量等。 要使用 util 模式中的标签，您需要在 Infra XML 配置文件顶部包含以下序言 （代码段中的文本引用了正确的模式，以便您可以使用 util 命名空间中的标签）：

```xml
 <?xml version="1.0" encoding="UTF-8"?>
 <beans xmlns="http://www.springframework.org/schema/beans"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xmlns:util="http://www.springframework.org/schema/util"
   xsi:schemaLocation="
     http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
     http://www.springframework.org/schema/util https://www.springframework.org/schema/util/spring-util.xsd">

     <!-- bean definitions here -->

 </beans>
```

##### 使用 <util:constant/>

考虑以下 bean 定义：

```xml
 <bean id="..." class="...">
   <property name="isolation">
     <bean id="java.sql.Connection.TRANSACTION_SERIALIZABLE"
         class="infra.beans.factory.config.FieldRetrievingFactoryBean" />
   </property>
 </bean>
```

##### 从字段值设置 Bean 属性或构造函数参数

FieldRetrievingFactoryBean 是一个 FactoryBean，它检索 static 或非静态字段值。它通常用于检索 public static final 常量， 然后可用于设置另一个 bean 的属性值或构造函数参数。 以下示例显示了如何使用 staticField 属性公开 static 字段：

##### 使用 <util:property-path/>

考虑以下示例：

##### 使用 <util:property-path/> 设置 Bean 属性或构造函数参数

PropertyPathFactoryBean 是一个 FactoryBean，它对给定的目标对象评估属性路径。 目标对象可以直接指定，也可以通过 bean 名称指定。然后，您可以在另一个 bean 定义中将此值用作属性值或构造函数参数。 以下示例显示了按名称对另一个 bean 使用路径：

##### 使用 <util:properties/>

考虑以下示例：

##### 使用 <util:list/>

考虑以下示例：

##### 使用 <util:map/>

考虑以下示例：

##### 使用 <util:set/>

考虑以下示例：

#### aop Schema

aop 标签处理 Infra 中所有 AOP 的配置，包括 Infra 自己的基于代理的 AOP 框架以及 Infra 与 AspectJ AOP 框架的集成。 这些标签在名为 Infra 面向切面编程 的一章中进行了全面介绍。 为了完整起见，要使用 aop 模式中的标签，您需要在 Infra XML 配置文件顶部包含以下序言 （代码段中的文本引用了正确的模式，以便您可以使用 aop 命名空间中的标签）：

#### context Schema

context 标签处理与管道相关的 ApplicationContext 配置——即通常不是对最终用户重要的 bean，而是做很多 Infra “苦力”工作的 bean，例如 BeanfactoryPostProcessors。 以下代码段引用了正确的模式，以便您可以使用 context 命名空间中的元素：

#### beans Schema

最后但同样重要的是，我们有 beans 模式中的元素。这些元素从框架诞生之初就存在于 Infra 中。 这里没有显示 beans 模式中各种元素的示例，因为它们在 依赖项和配置详解 （实际上，在整个 章）中都有非常全面的介绍。 请注意，您可以向 <bean/> XML 定义添加零个或多个键值对。 对这些额外的元数据做什么（如果有的话）完全取决于您自己的自定义逻辑 （因此，如果您编写自己的自定义元素，如 XML Schema 编写 附录中所述，这通常才有用）。 以下示例显示了周围 <bean/> 上下文中的 <meta/> 元素 （请注意，如果没有解释它的逻辑，元数据实际上是无用的）。

## 系统架构

> 原文：[`architecture`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/architecture.adoc)

### 概述

本文档展示 TODAY Infrastructure 的整体模块架构与分层设计。

## 概述

> 原文：[`overview`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/overview.adoc)

### 概述

该项目起源于 2017 年。主要用于构建高性能 Web 应用程序和普通应用程序的 Java 库。

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
