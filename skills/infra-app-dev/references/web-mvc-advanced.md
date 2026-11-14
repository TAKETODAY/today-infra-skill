# Web MVC 进阶

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

函数式端点、CORS、URI 构建、异步请求、视图技术、REST 客户端。

覆盖文档：14 页（含示例 8 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- **Functional Endpoints** —— `web/webmvc-functional`
- **CORS** —— `web/webmvc-cors`
- API 版本管理 —— `web/webmvc-versioning`
- View 技术 —— `web/webmvc-view`
- **PDF 与 Excel** —— `web/webmvc-view/mvc-document`
- **RSS 和 Atom** —— `web/webmvc-view/mvc-feeds`
- **FreeMarker** —— `web/webmvc-view/mvc-freemarker`
- **Groovy 标记** —— `web/webmvc-view/mvc-groovymarkup`
- Jackson —— `web/webmvc-view/mvc-jackson`
- **脚本视图** —— `web/webmvc-view/mvc-script`
- XML 编组 —— `web/webmvc-view/mvc-xml-marshalling`
- **XSLT 视图** —— `web/webmvc-view/mvc-xslt`
- REST 客户端 —— `web/webmvc-client`
- 测试 —— `web/webmvc-test`

## Functional Endpoints

> 原文：[`web/webmvc-functional`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-functional.adoc)

### 概述

Infra Web MVC 包括 WebMvc.fn，这是一个轻量级的函数式编程模型，在该模型中，函数用于路由和处理请求，设计为不可变性。 它是基于注解编程模型的另一种选择，但在其他方面运行在相同的 DispatcherHandler 上。

#### 概述

在 WebMvc.fn 中，一个 HTTP 请求通过 HandlerFunction 处理：一个接受 ServerRequest 并返回 ServerResponse 的函数。 请求和响应对象都具有不可变的合同，提供了与 JDK 8 兼容的访问 HTTP 请求和响应的方式。 HandlerFunction 相当于注解-based 编程模型中 @RequestMapping 方法的主体。 传入的请求通过 RouterFunction 路由到处理函数：一个接受 ServerRequest 并返回可选的 HandlerFunction（即 Optional<HandlerFunction>）的函数。 当路由函数匹配时，会返回一个处理函数；否则返回一个空的 Optional。 RouterFunction 相当于 @RequestMapping 注解，但主要区别在于路由函数不仅提供数据，还提供行为

```java
import static infra.http.MediaType.APPLICATION_JSON;
import static infra.web.handler.function.ReqestPredicates.*;
import static infra.web.handler.function.RouterFunctions.route;

PersonRepository repository = ...
PersonHandler handler = new PersonHandler(repository);

RouterFunction<ServerResponse> route = route() // <1>
  .GET("/person/{id}", accept(APPLICATION_JSON), handler::getPerson)
  .GET("/person", accept(APPLICATION_JSON), handler::listPeople)
  .POST("/person", handler::createPerson)
  .build();


public class PersonHandler {

  // ...

  public ServerResponse listPeople(ServerRequest request) {
    // ...
  }

  public ServerResponse createPerson(ServerRequest request) {
    // ...
  }

  public ServerResponse getPerson(ServerRequest request) {
    // ...
  }
}
```

##### ServerRequest

ServerRequest 提供了访问 HTTP 方法、URI、头和查询参数的方式，而对主体的访问则通过 body 方法提供。 以下示例将请求主体提取为 String：

```java
String string = request.body(String.class);
```

##### ServerResponse

ServerResponse 提供了对 HTTP 响应的访问，并且由于它是不可变的，您可以使用 build 方法来创建它。 您可以使用构建器设置响应状态、添加响应头或提供主体。以下示例创建了一个带有 JSON 内容的 200 (OK) 响应：

##### Handler Classes

我们可以将处理函数写成 lambda 表达式，如下例所示： --

##### Validation

一个 functional endpoint 可以使用 验证设施 来对请求体应用验证。 例如，给定一个针对 Person 的自定义 Infra 验证器 实现：

##### Predicates

您可以编写自己的 RequestPredicate，但 RequestPredicates 实用类提供了基于请求路径、HTTP 方法、内容类型等常用实现。 以下示例使用请求断言基于 Accept 头创建约束：

##### Routes

路由函数按顺序进行评估：如果第一个路由不匹配，则评估第二个，依此类推。 因此，将更具体的路由声明在一般性路由之前是有意义的。 这也在将路由函数注册为 Infra bean 时很重要，稍后将进行描述。 请注意，此行为与基于注解的编程模型不同，在该模型中，“最具体”的控制器方法会自动选择。 在使用路由函数构建器时，所有定义的路由都被组合成一个 RouterFunction，并从 build() 返回。 还有其他将多个路由函数组合在一起的方法： 以下示例显示了四个路由的组合：

##### Nested Routes

一组路由函数经常具有共享的断言，例如共享路径。 在上面的示例中，共享的断言将是一个路径断言，匹配 /person，被三个路由使用。 在使用注解时，您可以通过使用类型级别的 @RequestMapping 注解将其映射到 /person 来消除此重复。 在 WebMvc.fn 中，路径断言可以通过路由函数构建器上的 path 方法共享。 例如，通过使用嵌套路由，上面示例的最后几行可以通过以下方式改进：

##### 重定向到资源

可以将匹配指定谓词的请求重定向到资源。例如，在单页应用程序中处理重定向时可能很有用。

##### 从根路径提供资源服务

还可以将匹配给定模式的请求路由到相对于给定根位置的资源。

#### Running a Server

通常，在基于 DispatcherHandler 的设置中通过 MVC Config 运行路由器函数，该配置使用 Infra 配置声明处理请求所需的组件。 MVC Java 配置声明以下基础设施组件以支持功能端点： 对其进行排序， 通过 RouterFunction.andOther 将它们组合，并将请求路由到生成的组合 RouterFunction。 上述组件使功能端点适应 DispatcherHandler 请求处理生命周期，并且（可能）与已声明的注释控制器并行运行。 这也是通过 App Web 启动器启用功能端点的方式。 以下示例显示了一个 Web Java 配置：

#### Filtering Handler Functions

你可以通过在路由函数构建器上使用 before、after 或 filter 方法来过滤处理函数。 使用注解时，你可以通过使用 @ControllerAdvice、ServletFilter 或两者来实现类似的功能。 该过滤器将应用于由构建器构建的所有路由。 这意味着嵌套路由中定义的过滤器不适用于“顶级”路由。 例如，请考虑以下示例：

## CORS

> 原文：[`web/webmvc-cors`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-cors.adoc)

### 概述

Web MVC 允许您处理跨源资源共享 (CORS，跨源资源共享)。本节描述了如何实现此功能。

#### @CrossOrigin

@CrossOrigin 注解在注释的控制器方法上启用跨源请求，如下例所示：

```java
@RestController
@RequestMapping("/account")
public class AccountController {

  @CrossOrigin
  @GetMapping("/{id}")
  public Account retrieve(@PathVariable Long id) {
    // ...
  }

  @DeleteMapping("/{id}")
  public void remove(@PathVariable Long id) {
    // ...
  }
}
```

##### Java 配置

要在 MVC Java 配置中启用 CORS，你可以使用 CorsRegistry 回调，如下例所示：

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {

    registry.addMapping("/api/**")
      .allowedOrigins("https://domain2.com")
      .allowedMethods("PUT", "DELETE")
      .allowedHeaders("header1", "header2", "header3")
      .exposedHeaders("header1", "header2")
      .allowCredentials(true).maxAge(3600);

    // Add more mappings...
  }
}
```

#### CORS 拦截器

你可以通过内置的 CorsInterceptor 应用 CORS 支持。 要配置过滤器，将 CorsConfigurationSource 传递给它的构造函数，如下例所示：

## API 版本管理

> 原文：[`web/webmvc-versioning`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-versioning.adoc)

### 概述

Web MVC 支持 API 版本管理。本节介绍相关策略及其职责。 服务端通过 infra.web.config.annotation.WebMvcConfigurer 的 configureApiVersioning(ApiVersionConfigurer) 方法配置版本管理， 通过 @RequestMapping 的 version 属性声明控制器映射所需的版本。 客户端的版本传递配置参见 REST 客户端。

## View 技术

> 原文：[`web/webmvc-view`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view.adoc)

### 概述

Web MVC 中视图技术的使用是可插拔的。无论您决定使用 Thymeleaf、Groovy Markup Templates、JSP 还是其他技术， 主要是一种配置更改的问题。本章介绍了与 Web MVC 集成的视图技术。我们假设您已经熟悉了 视图解析。 WARNING: Web MVC 应用程序的视图存在于该应用程序的内部信任边界内。视图可以访问应用程序上下文中的所有 bean。 因此，在模板可由外部来源编辑的应用程序中不建议使用 Web MVC 的模板支持，因为这可能会带来安全性问题。

## PDF 与 Excel

> 原文：[`web/webmvc-view/mvc-document`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view/mvc-document.adoc)

### 概述

Infra 提供了除 HTML 以外的输出方式，包括 PDF 和 Excel 电子表格。 本节介绍如何使用这些功能。

#### PDF 视图

一个用于单词列表的简单 PDF 视图可以继承 infra.web.view.document.AbstractPdfView 并实现 buildPdfDocument() 方法，如下例所示：

```java
public class PdfWordList extends AbstractPdfView {

  protected void buildPdfDocument(Map<String, Object> model, Document doc, PdfWriter writer,
      HttpContext request) throws Exception {

    List<String> words = (List<String>) model.get("wordList");
    for (String word : words) {
      doc.add(new Paragraph(word));
    }
  }
}
```

## RSS 和 Atom

> 原文：[`web/webmvc-view/mvc-feeds`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view/mvc-feeds.adoc)

### 概述

AbstractAtomFeedView 和 AbstractRssFeedView 都继承自 AbstractFeedView 基类，分别用于提供 Atom 和 RSS Feed 视图。它们基于 ROME 项目，位于 infra.web.view.feed 包中。 AbstractAtomFeedView 要求您实现 buildFeedEntries() 方法，并可选地重写 buildFeedMetadata() 方法（默认实现为空）。以下示例展示了如何实现：

```java
public class SampleContentAtomView extends AbstractAtomFeedView {

  @Override
  protected void buildFeedMetadata(Map<String, Object> model,
      Feed feed, HttpContext request) {
    // 省略实现
  }

  @Override
  protected List<Entry> buildFeedEntries(Map<String, Object> model,
      HttpContext request) throws Exception {
    // 省略实现
  }
}
```

## FreeMarker

> 原文：[`web/webmvc-view/mvc-freemarker`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view/mvc-freemarker.adoc)

### 概述

Apache FreeMarker 是一个模板引擎，用于生成从 HTML 到电子邮件等各种文本输出。 Infra Framework 内置了使用 FreeMarker 模板的 Infra MVC 集成。

#### 视图配置

以下示例展示了如何将 FreeMarker 配置为视图技术：

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void configureViewResolvers(ViewResolverRegistry registry) {
    registry.freeMarker();
  }

  // 配置 FreeMarker...

  @Bean
  public FreeMarkerConfigurer freeMarkerConfigurer() {
    FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
    configurer.setTemplateLoaderPath("classpath:freemarker");
    return configurer;
  }
}
```

#### FreeMarker 配置

您可以通过在 FreeMarkerConfigurer bean 上设置相应的 bean 属性，将 FreeMarker 'Settings' 和 'SharedVariables' 直接传递给 FreeMarker Configuration 对象（由 Infra 管理）。 freemarkerSettings 属性需要一个 java.util.Properties 对象，而 freemarkerVariables 属性需要一个 java.util.Map。 以下示例展示了如何使用 FreeMarkerConfigurer：

```xml
<bean id="freemarkerConfig" class="infra.web.view.freemarker.FreeMarkerConfigurer">
  <property name="templateLoaderPath" value="classpath:freemarker/"/>
  <property name="freemarkerVariables">
    <map>
      <entry key="xml_escape" value-ref="fmXmlEscape"/>
    </map>
  </property>
</bean>

<bean id="fmXmlEscape" class="freemarker.template.utility.XmlEscape"/>
```

##### 简单绑定

在基于充当 Infra MVC 控制器表单视图的 FreeMarker 模板的 HTML 表单中，您可以使用类似于下一个示例的代码绑定到字段值， 并以等效项类似的方式显示每个输入字段的错误消息。 以下示例显示了 personForm 视图：

##### 输入字段

formInput 宏采用 path 参数 (command.name) 和一个附加的 attributes 参数（在接下来的示例中为空）。 该宏与所有其他表单生成宏一样，对路径参数执行隐式 Infra 绑定。 绑定在发生新绑定之前一直有效，因此 showErrors 宏不需要再次传递路径参数——它对上次创建绑定的字段进行操作。 showErrors 宏采用分隔符参数（用于分隔给定字段上的多个错误的字符），并且还接受第二个参数——这次是类名或样式属性。 请注意，FreeMarker 可以为属性参数指定默认值。 以下示例展示了如何使用 formInput 和 showErrors 宏：

##### 选择字段

您可以使用四个选择字段宏在 HTML 表单中生成常见的 UI 值选择输入： 四个宏中的每一个都接受一个选项 Map，其中包含表单字段的值以及与该值对应的标签。 值和标签可以相同。 下一个示例是 FTL 中的单选按钮。表单支持对象为此字段指定默认值 'London'，因此无需验证。 当渲染表单时，可供选择的整个城市列表作为参考数据在名称 'cityMap' 下的模型中提供。 以下清单显示了该示例：

##### HTML 转义

要为您的标记切换到 XHTML 合规性，请为名为 xhtmlCompliant 的模型或上下文变量指定值 true，如下例所示：

## Groovy 标记

> 原文：[`web/webmvc-view/mvc-groovymarkup`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view/mvc-groovymarkup.adoc)

### 概述

Groovy 标记模板引擎 主要用于生成类似 XML 的标记（XML、XHTML、HTML5 等），但您也可以使用它来生成任何基于文本的内容。TODAY Framework 内置了 Web MVC 与 Groovy 标记的集成。 NOTE: Groovy 标记模板引擎需要 Groovy 2.3.1+。

#### 配置

以下示例展示了如何配置 Groovy 标记模板引擎：

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void configureViewResolvers(ViewResolverRegistry registry) {
    registry.groovy();
  }

  // 配置 Groovy 标记模板引擎...

  @Bean
  public GroovyMarkupConfigurer groovyMarkupConfigurer() {
    GroovyMarkupConfigurer configurer = new GroovyMarkupConfigurer();
    configurer.setResourceLoaderPath("/WEB-INF/");
    return configurer;
  }
}
```

#### 示例

与传统的模板引擎不同，Groovy 标记依赖于使用构建器语法的 DSL。以下示例展示了一个 HTML 页面的示例模板：

```groovy
	yieldUnescaped '<!DOCTYPE html>'
	html(lang:'en') {
		head {
			meta('http-equiv':'"Content-Type" content="text/html; charset=utf-8"')
			title('My page')
		}
		body {
			p('This is an example of HTML contents')
		}
	}
```

## Jackson

> 原文：[`web/webmvc-view/mvc-jackson`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view/mvc-jackson.adoc)

### 概述

Infra 提供了对 Jackson JSON 库的支持。

## 脚本视图

> 原文：[`web/webmvc-view/mvc-script`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view/mvc-script.adoc)

### 概述

TODAY Framework 内置了 Web MVC 与任何可以在 JSR-223 Java 脚本引擎之上运行的模板库的集成。我们已经在不同的脚本引擎上测试了以下模板库： TIP: 集成任何其他脚本引擎的基本规则是它必须实现 ScriptEngine 和 Invocable 接口。

#### 脚本模板

您可以声明一个 ScriptTemplateConfigurer bean 来指定要使用的脚本引擎、要加载的脚本文件、要调用以渲染模板的函数等。 以下示例使用 Mustache 模板和 Nashorn JavaScript 引擎：

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void configureViewResolvers(ViewResolverRegistry registry) {
    registry.scriptTemplate();
  }

  @Bean
  public ScriptTemplateConfigurer configurer() {
    ScriptTemplateConfigurer configurer = new ScriptTemplateConfigurer();
    configurer.setEngineName("nashorn");
    configurer.setScripts("mustache.js");
    configurer.setRenderObject("Mustache");
    configurer.setRenderFunction("render");
    return configurer;
  }
}
```

## XML 编组

> 原文：[`web/webmvc-view/mvc-xml-marshalling`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view/mvc-xml-marshalling.adoc)

### 概述

MarshallingView 使用 XML Marshaller（定义在 infra.oxm 包中）将响应内容渲染为 XML。您可以使用 MarshallingView 实例的 modelKey bean 属性显式设置要编组的对象。或者，视图会迭代所有模型属性并编组 Marshaller 支持的第一个类型。有关 infra.oxm 包中功能的更多信息，请参阅 使用 O/X 映射器编组 XML。

## XSLT 视图

> 原文：[`web/webmvc-view/mvc-xslt`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-view/mvc-xslt.adoc)

### 概述

XSLT 是一种 XML 转换语言，作为 Web 应用程序中的视图技术很受欢迎。如果您的应用程序自然处理 XML，或者如果您的模型可以轻松转换为 XML，那么 XSLT 可能是视图技术的不错选择。以下部分展示了如何在 Infra Web MVC 应用程序中生成 XML 文档作为模型数据并使用 XSLT 对其进行转换。 这是一个简单的 Infra 应用程序，它在 Controller 中创建一个单词列表并将它们添加到模型映射中。返回该映射以及我们的 XSLT 视图的视图名称。有关 Infra Web MVC 的 Controller 接口的详细信息，请参阅 注解控制器。XSLT 控制器将单词列表转换为简单的 XML 文档，以供转换。

#### Beans

配置对于简单的 Infra Web 应用程序来说是标准的：MVC 配置必须定义一个 XsltViewResolver bean 和常规的 MVC 注解配置。 以下示例展示了如何做到这一点：

```java
@EnableWebMvc
@ComponentScan
@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Bean
  public XsltViewResolver xsltViewResolver() {
    XsltViewResolver viewResolver = new XsltViewResolver();
    viewResolver.setPrefix("/WEB-INF/xsl/");
    viewResolver.setSuffix(".xslt");
    return viewResolver;
  }
}
```

#### Controller

我们还需要一个封装了单词生成逻辑的 Controller。 控制器逻辑封装在一个 @Controller 类中，处理方法的定义如下：

```java
@Controller
public class XsltController {

  @RequestMapping("/")
  public String home(Model model) throws Exception {
    Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
    Element root = document.createElement("wordList");

    List<String> words = Arrays.asList("Hello", "Infra", "Framework");
    for (String word : words) {
      Element wordNode = document.createElement("word");
      Text textNode = document.createTextNode(word);
      wordNode.appendChild(textNode);
      root.appendChild(wordNode);
    }

    model.addAttribute("wordList", root);
    return "home";
  }
}
```

#### 转换

最后，XsltViewResolver 解析 "home" XSLT 模板文件并将 DOM 文档合并到其中以生成我们的视图。如 XsltViewResolver 配置所示，XSLT 模板位于 war 文件的 WEB-INF/xsl 目录中，并以 xslt 文件扩展名结尾。 以下示例显示了一个 XSLT 转换：

## REST 客户端

> 原文：[`web/webmvc-client`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-client.adoc)

### 概述

本节描述了客户端访问 REST API 的选项。

## 测试

> 原文：[`web/webmvc-test`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/webmvc-test.adoc)

### 概述

本节总结了 infra-test 在 Web MVC 应用程序中提供的选项。 有关详细信息，请参阅 Mock API 模拟对象。 包括在测试方法之间高效缓存加载的配置。 有关详细信息，请参阅 TestContext Framework。 测试带有完整 Web MVC 基础设施但没有 HTTP 服务器的注解控制器。有关详细信息， 请参阅 Web MVC Test。 您可以将其用作用于测试内部使用 RestTemplate 的客户端代码的模拟服务器。有关详细信息， 请参阅 客户端 REST 测试。 它是一个非阻塞、反应式客户端，非常适合测试异步和流式场景。有关详细信息，请参阅 WebTestClient。

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
