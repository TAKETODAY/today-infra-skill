# 校验与类型转换

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

Validator、数据绑定、ConversionService、Formatter、Bean Validation。

覆盖文档：8 页（含示例 6 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- 验证、数据绑定和类型转换 —— `core/validation`
- **数据绑定** —— `core/validation/beans-beans`
- **Java Bean Validation** —— `core/validation/beanvalidation`
- 将代码解析为错误消息 —— `core/validation/conversion`
- **Infra 类型转换** —— `core/validation/convert`
- **配置全局日期和时间格式** —— `core/validation/format-configuring-formatting-globaldatetimeformat`
- **Infra 字段格式化** —— `core/validation/format`
- **使用 Infra Validator 接口进行验证** —— `core/validation/validator`

## 验证、数据绑定和类型转换

> 原文：[`core/validation`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/validation.adoc)

### 概述

在考虑验证作为业务逻辑的利弊时，框架提供了一个不排除任何一方的验证和数据绑定设计。 具体来说，验证不应该仅限于 Web 层，并且应该容易本地化，同时应该能够接入任何可用的验证器。 鉴于这些考虑，框架提供了一个既基础又极具可用性的 Validator 合约，可在应用的每个层次中使用。 数据绑定对于让用户输入动态地绑定到应用的领域模型（或任何用于处理用户输入的对象）非常有用。 框架提供了恰当命名的 DataBinder 来做到这一点。Validator 和 DataBinder 构成了主要用于但不限于 Web 层的 validation 包。 DataBinder 的 maxNestedPathDepth 同时限制属性绑定和通过 construct 进行的构造器绑定。 构造器参数本身为对象时，绑定器会沿嵌套属性路径递归构造；路径超过配置的最大深度时， 抛出包含出错属性路径的 BeanInsta

## 数据绑定

> 原文：[`core/validation/beans-beans`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/validation/beans-beans.adoc)

### 概述

数据绑定对于将用户输入绑定到目标对象非常有用，其中用户输入是键为属性路径的映射，遵循 JavaBeans 约定。 DataBinder 是支持此功能的主要类，它提供了两种绑定用户输入的方法： - 构造函数绑定 - 将用户输入绑定到公共数据构造函数，在用户输入中查找构造函数参数值。 - 属性绑定 - 将用户输入绑定到设置器（setters），将用户输入的键与目标对象结构的属性进行匹配。 您可以同时应用构造函数绑定和属性绑定，也可以只应用其中一种。

##### 设置和获取基本及嵌套属性

设置和获取属性是通过 BeanWrapper 的 setPropertyValue 和 getPropertyValue 重载方法变体完成的。有关详细信息，请参阅其 Javadoc。下表显示了这些约定的一些示例： （如果您不打算直接使用 BeanWrapper，那么下一节对您来说并不重要。如果您只使用 DataBinder 和 BeanFactory 及其默认实现，则应跳至 PropertyEditors 部分。） 以下两个示例类使用 BeanWrapper 来获取和设置属性：

```java
public class Company {

  private String name;
  private Employee managingDirector;

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Employee getManagingDirector() {
    return this.managingDirector;
  }

  public void setManagingDirector(Employee managingDirector) {
    this.managingDirector = managingDirector;
  }
}
```

#### PropertyEditor

Infra 使用 PropertyEditor 的概念来实现 Object 和 String 之间的转换。以不同于对象本身的方式表示属性可能很方便。例如，Date 可以以人类可读的方式表示（如 String: '2007-14-09'），而我们仍然可以将人类可读的形式转换回原始日期（或者更好的是，将以人类可读形式输入的任何日期转换回 Date 对象）。这种行为可以通过注册类型为 java.beans.PropertyEditor 的自定义编辑器来实现。在 BeanWrapper 上注册自定义编辑器，或者在特定的 IoC 容器中注册（如前一章所述），使其了解如何将属性转换为所需的类型。有关 PropertyEditor 的更多信息，请参阅 来自 Oracle 的 java.beans 包的 javadoc。 Infra 中使用属性编辑的几个示例： Infra 有许多内置的 PropertyE

```java
public class SomethingBeanInfo extends SimpleBeanInfo {

  public PropertyDescriptor[] getPropertyDescriptors() {
    try {
      final PropertyEditor numberPE = new CustomNumberEditor(Integer.class, true);
      PropertyDescriptor ageDescriptor = new PropertyDescriptor("age", Something.class) {
        @Override
        public PropertyEditor createPropertyEditor(Object bean) {
          return numberPE;
        }
      };
      return new PropertyDescriptor[] { ageDescriptor };
    }
    catch (IntrospectionException ex) {
      throw new Error(ex.toString());
    }
  }
}
```

##### 自定义 PropertyEditor

当将 bean 属性设置为字符串值时，Infra IoC 容器最终使用标准 JavaBeans PropertyEditor 实现将这些字符串转换为属性的复杂类型。Infra 预注册了许多自定义 PropertyEditor 实现（例如，将表示为字符串的类名转换为 Class 对象）。此外，Java 的标准 JavaBeans PropertyEditor 查找机制允许对类的 PropertyEditor 进行适当命名并将其放置在与其提供支持的类相同的包中，以便可以自动找到它。 如果需要注册其他自定义 PropertyEditors，有几种机制可用。最手动的如果不通常方便或不推荐的方法是使用 ConfigurableBeanFactory 接口的 registerCustomEditor() 方法，假设您有 BeanFactory 引用。另一种（稍微方便一点的）机制是使用名为 Custom

##### PropertyEditorRegistrar

向 Infra 容器注册属性编辑器的另一种机制是创建并使用 PropertyEditorRegistrar。当您需要在几种不同情况下使用同一组属性编辑器时，此接口特别有用。您可以编写相应的注册器并在每种情况下重用它。PropertyEditorRegistrar 实例与名为 PropertyEditorRegistry 的接口一起工作，该接口由 Infra BeanWrapper（和 DataBinder）实现。当与 CustomEditorConfigurer（此处 描述）结合使用时，PropertyEditorRegistrar 实例特别方便，它公开了一个名为 setPropertyEditorRegistrars(..) 的属性。以这种方式添加到 CustomEditorConfigurer 的 PropertyEditorRegistrar 实例可以轻松地与 DataBinder 

## Java Bean Validation

> 原文：[`core/validation/beanvalidation`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/validation/beanvalidation.adoc)

### 概述

TODAY Framework 提供了对 Java Bean Validation API 的支持。

#### Bean Validation 概述

Bean Validation 通过约束声明和元数据为 Java 应用程序提供了一种通用的验证方式。要使用它，您可以用声明性验证约束来注释域模型属性，然后由运行时强制执行这些约束。有一些内置约束，您也可以定义自己的自定义约束。 考虑以下示例，它显示了一个具有两个属性的简单 PersonForm 模型：

```java
public class PersonForm {
  private String name;
  private int age;
}
```

#### 配置 Bean Validation 提供者

Infra 为 Bean Validation API 提供全面支持，包括将 Bean Validation 提供者引导为 Infra bean。这使您可以在应用程序中需要验证的任何地方注入 jakarta.validation.ValidatorFactory 或 jakarta.validation.Validator。 您可以使用 LocalValidatorFactoryBean 将默认验证器配置为 Infra bean，如下例所示：

```java
import infra.validation.beanvalidation.LocalValidatorFactoryBean;

@Configuration
public class AppConfig {

  @Bean
  public LocalValidatorFactoryBean validator() {
    return new LocalValidatorFactoryBean();
  }
}
```

##### 注入 Jakarta Validator

LocalValidatorFactoryBean 同时实现了 jakarta.validation.ValidatorFactory 和 jakarta.validation.Validator，因此如果您更喜欢直接使用 Bean Validation API，您可以注入对后者的引用来应用验证逻辑，如下例所示：

##### 注入 Infra Validator

除了实现 jakarta.validation.Validator 之外，LocalValidatorFactoryBean 还适配了 infra.validation.Validator，因此如果您的 bean 需要 Infra Validation API，您可以注入对后者的引用。 例如：

##### 配置自定义约束

每个 bean 验证约束由两部分组成： 为了将声明与实现相关联，每个 @Constraint 注解都引用一个相应的 ConstraintValidator 实现类。在运行时，当在您的域模型中遇到约束注解时，ConstraintValidatorFactory 会实例化引用的实现。 默认情况下，LocalValidatorFactoryBean 配置一个 InfraConstraintValidatorFactory，它使用 Infra 来创建 ConstraintValidator 实例。这使您的自定义 ConstraintValidator 可以像任何其他 Infra bean 一样受益于依赖注入。 以下示例显示了一个自定义 @Constraint 声明，后跟一个关联的 ConstraintValidator 实现，该实现使用 Infra 进行依赖注入：

#### Infra 驱动的方法验证

您可以通过 MethodValidationPostProcessor bean 定义将 Bean Validation 的方法验证功能集成到 Infra 上下文中：

##### 方法验证异常

默认情况下，使用 jakarata.validation.Validator 返回的 ConstraintViolation 集合引发 jakarta.validation.ConstraintViolationException。作为替代方案，您可以引发 MethodValidationException，并将 ConstraintViolation 适配为 MessageSourceResolvable 错误。要启用，请设置以下标志：

##### 自定义验证错误

适配后的 MessageSourceResolvable 错误可以通过配置的 MessageSource 转换为错误消息，以显示给用户，并支持特定于区域和语言的资源包。本节提供了一个示例进行说明。 给定以下类声明：

#### 配置 DataBinder

您可以使用 Validator 配置 DataBinder 实例。配置完成后，您可以通过调用 binder.validate() 来调用 Validator。任何验证 Errors 都会自动添加到绑定器的 BindingResult 中。 以下示例显示了如何以编程方式使用 DataBinder 在绑定到目标对象后调用验证逻辑：

## 将代码解析为错误消息

> 原文：[`core/validation/conversion`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/validation/conversion.adoc)

### 概述

我们介绍了数据绑定和验证。本节介绍输出对应于验证错误的消息。 在 上一节 显示的示例中，我们拒绝了 name 和 age 字段。 如果我们想使用 MessageSource 输出错误消息，我们可以使用我们在拒绝字段时提供的错误代码 （在本例中为 'name' 和 'age'）来实现。 当你调用（直接调用，或间接通过使用例如 ValidationUtils 类调用）Errors 接口中的 rejectValue 或其他 reject 方法之一时，底层实现不仅会注册你传入的代码，还会注册许多其他错误代码。 MessageCodesResolver 确定 Errors 接口注册哪些错误代码。 默认情况下，使用 DefaultMessageCodesResolver，它（例如）不仅注册包含你给出的代码的消息， 还注册包含你传递给 reject 方法的字段名称的消息。 因此，如果你使用 reject

## Infra 类型转换

> 原文：[`core/validation/convert`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/validation/convert.adoc)

### 概述

core.convert 包提供了一个通用的类型转换系统。该系统定义了一个 SPI 来实现类型转换逻辑，并定义了一个 API 来在运行时执行类型转换。在 Infra 容器中，您可以使用此系统作为 PropertyEditor 实现的替代方案，将外部化的 bean 属性值字符串转换为所需的属性类型。您还可以在应用程序中需要类型转换的任何地方使用公共 API。

#### Converter SPI

用于实现类型转换逻辑的 SPI 简单且强类型化，如下面的接口定义所示：

```java
package infra.core.conversion.converter;

public interface Converter<S, T> {

  T convert(S source);
}
```

#### 使用 ConverterFactory

当您需要集中整个类层次结构的转换逻辑时（例如，从 String 转换为 Enum 对象时），您可以实现 ConverterFactory，如下例所示：

```java
package infra.core.conversion.converter;

public interface ConverterFactory<S, R> {

  <T extends R> Converter<S, T> getConverter(Class<T> targetType);
}
```

#### 使用 GenericConverter

当您需要复杂的 Converter 实现时，请考虑使用 GenericConverter 接口。GenericConverter 具有比 Converter 更灵活但类型不那么强的签名，支持在多种源类型和目标类型之间进行转换。此外，GenericConverter 提供了可用的源和目标字段上下文，您可以在实现转换逻辑时使用这些上下文。此类上下文允许类型转换由字段注解或字段签名上声明的泛型信息驱动。以下清单显示了 GenericConverter 的接口定义：

##### 使用 ConditionalGenericConverter

有时，您只希望在特定条件成立时运行 Converter。例如，您可能只想在目标字段上存在特定注解时运行 Converter，或者只想在目标类上定义了特定方法（例如 static valueOf 方法）时运行 Converter。 ConditionalGenericConverter 是 GenericConverter 和 ConditionalConverter 接口的联合，允许您定义此类自定义匹配条件：

#### ConversionService API

ConversionService 定义了一个统一的 API，用于在运行时执行类型转换逻辑。转换器通常在以下外观接口后面运行：

#### 配置 ConversionService

ConversionService 是一个无状态对象，设计为在应用程序启动时实例化，然后在多个线程之间共享。在 Infra 应用程序中，您通常为每个 Infra 容器（或 ApplicationContext）配置一个 ConversionService 实例。Infra 会获取该 ConversionService，并在框架需要执行类型转换时使用它。您还可以将此 ConversionService 注入到任何 bean 中并直接调用它。 NOTE: 如果没有向 Infra 注册 ConversionService，则使用原本基于 PropertyEditor 的系统。 要向 Infra 注册默认的 ConversionService，请添加以下 id 为 conversionService 的 bean 定义：

#### 以编程方式使用 ConversionService

要以编程方式使用 ConversionService 实例，您可以像对待任何其他 bean 一样注入对它的引用。以下示例显示了如何执行此操作：

## 配置全局日期和时间格式

> 原文：[`core/validation/format-configuring-formatting-globaldatetimeformat`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/validation/format-configuring-formatting-globaldatetimeformat.adoc)

### 概述

默认情况下，未用 @DateTimeFormat 注解的日期和时间字段将使用 DateFormat.SHORT 样式从字符串转换。如果您愿意，可以通过定义自己的全局格式来更改此设置。 为此，请确保 Infra 不注册默认格式化程序。相反，请借助以下类手动注册格式化程序： 例如，以下配置注册了一个全局 yyyyMMdd 格式：

```java
@Configuration
public class ApplicationConfiguration {

  @Bean
  public FormattingConversionService conversionService() {

    // 使用 DefaultFormattingConversionService 但不注册默认值
    DefaultFormattingConversionService conversionService =
            new DefaultFormattingConversionService(false);

    // 确保仍然支持 @NumberFormat
    conversionService.addFormatterForFieldAnnotation(
            new NumberFormatAnnotationFormatterFactory());

    // 使用特定的全局格式注册 JSR-310 日期转换
    DateTimeFormatterRegistrar dateTimeRegistrar = new DateTimeFormatterRegistrar();
    dateTimeRegistrar.setDateFormatter(DateTimeFormatter.ofPattern("yyyyMMdd"));
    dateTimeRegistrar.registerFormatters(conversionService);

    // 使用特定的全局格式注册日期转换
    DateFormatterRegistrar dateRegistrar = new DateFormatterRegistrar();
    dateRegistrar.setFormatter(new DateFormatter("yyyyMMdd"));
    dateRegistrar.registerFormatters(conversionService);

    return conversionService;
  }
}
```

## Infra 字段格式化

> 原文：[`core/validation/format`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/validation/format.adoc)

### 概述

如 前一节 所述，core.convert 是一个通用的类型转换系统。 它提供了一个统一的 ConversionService API 以及一个强类型的 Converter SPI，用于实现从一种类型到另一种类型的转换逻辑。 Infra 容器使用此系统绑定 bean 属性值。 此外，Infra 表达式语言 (SpEL) 和 DataBinder 都使用此系统绑定字段值。 例如，当 SpEL 需要将 Short 强制转换为 Long 以完成 expression.setValue(Object bean, Object value) 尝试时， core.convert 系统执行该强制转换。 现在考虑典型客户端环境（例如 Web 或桌面应用程序）的类型转换要求。 在此类环境中，您通常从 String 转换以支持客户端回发过程，以及转换回 String 以支持视图渲染过程。 此外，您经常需要本地

#### Formatter SPI

用于实现字段格式化逻辑的 Formatter SPI 简单且强类型化。 以下清单显示了 Formatter 接口定义：

```java
package infra.format;

public interface Formatter<T> extends Printer<T>, Parser<T> {
}
```

#### 注解驱动的格式化

字段格式化可以通过字段类型或注解进行配置。要将注解绑定到 Formatter，请实现 AnnotationFormatterFactory。 以下清单显示了 AnnotationFormatterFactory 接口的定义：

```java
package infra.format;

public interface AnnotationFormatterFactory<A extends Annotation> {

  Set<Class<?>> getFieldTypes();

  Printer<?> getPrinter(A annotation, Class<?> fieldType);

  Parser<?> getParser(A annotation, Class<?> fieldType);
}
```

##### 格式注解 API

infra.format.annotation 包中存在一个可移植的格式注解 API。 您可以使用 @NumberFormat 格式化 Number 字段，例如 Double 和 Long， 以及使用 @DateTimeFormat 格式化 java.util.Date、java.util.Calendar、Long（用于毫秒时间戳）以及 JSR-310 java.time。 以下示例使用 @DateTimeFormat 将 java.util.Date 格式化为 ISO 日期 (yyyy-MM-dd)：

#### FormatterRegistry SPI

FormatterRegistry 是用于注册格式化程序和转换器的 SPI。 FormattingConversionService 是适用于大多数环境的 FormatterRegistry 实现。 您可以以编程方式或声明方式将此变体配置为 Infra bean，例如使用 FormattingConversionServiceFactoryBean。 因为此实现也实现了 ConversionService，所以您可以直接配置它以与 Infra DataBinder 和 Infra 表达式语言 (SpEL) 一起使用。 以下清单显示了 FormatterRegistry SPI：

#### FormatterRegistrar SPI

FormatterRegistrar 是一个用于通过 FormatterRegistry 注册格式化程序和转换器的 SPI。 以下清单显示了其接口定义：

## 使用 Infra Validator 接口进行验证

> 原文：[`core/validation/validator`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/core/validation/validator.adoc)

### 概述

Infra 提供了一个 Validator 接口，您可以使用它来验证对象。 Validator 接口通过使用 Errors 对象工作，以便在验证时，验证器可以向 Errors 对象报告验证失败。 考虑以下一个简单数据对象的示例：

```java
public class Person {

  private String name;
  private int age;

  // 通常的 getter 和 setter...
}
```

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
