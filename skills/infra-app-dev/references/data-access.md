# JDBC 与数据访问

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

JdbcTemplate、行映射、参数处理、嵌入式数据库、DAO 支持。

覆盖文档：14 页（含示例 11 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- 使用 JDBC 进行数据访问 —— `data-access/jdbc`
- **JDBC 批量操作** —— `data-access/jdbc/advanced`
- 选择 JDBC 数据库访问方式 —— `data-access/jdbc/choose-style`
- **控制数据库连接** —— `data-access/jdbc/connections`
- **使用 JDBC 核心类控制基本 JDBC 处理和错误处理** —— `data-access/jdbc/core`
- **嵌入式数据库支持** —— `data-access/jdbc/embedded-database-support`
- **初始化 DataSource** —— `data-access/jdbc/initializing-datasource`
- **将 JDBC 操作建模为 Java 对象** —— `data-access/jdbc/object`
- 包层次结构 —— `data-access/jdbc/packages`
- **参数和数据值处理的常见问题** —— `data-access/jdbc/parameter-handling`
- **使用 SimpleJdbc 类简化 JDBC 操作** —— `data-access/jdbc/simple`
- **DAO 支持** —— `data-access/dao`
- **使用 Object-XML 映射器编组 XML** —— `data-access/oxm`
- **附录** —— `data-access/appendix`

## 使用 JDBC 进行数据访问

> 原文：[`data-access/jdbc`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc.adoc)

### 概述

TODAY Framework JDBC 抽象提供的价值或许最好通过下表列出的操作序列来展示。该表显示了哪些操作由 Infra 负责，哪些操作由您负责。 TODAY Framework 处理了所有可能使 JDBC 成为如此繁琐 API 的底层细节。

## JDBC 批量操作

> 原文：[`data-access/jdbc/advanced`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/advanced.adoc)

### 概述

如果对同一个预处理语句（prepared statement）进行批量多次调用，大多数 JDBC 驱动程序都能提供更好的性能。 通过将更新分组到批次中，您可以限制到数据库的往返次数。

#### 使用 JdbcTemplate 进行基本批量操作

您可以通过实现一个特殊接口 BatchPreparedStatementSetter 的两个方法，并将该实现作为第二个参数传递给 batchUpdate 方法调用，来实现 JdbcTemplate 批量处理。您可以使用 getBatchSize 方法提供当前批次的大小。 您可以使用 setValues 方法为预处理语句的参数设置值。此方法的调用次数与您在 getBatchSize 调用中指定的次数相同。 以下示例根据列表中的条目更新 t_actor 表，整个列表用作批次：

```java
public class JdbcActorDao implements ActorDao {

  private JdbcTemplate jdbcTemplate;

  public void setDataSource(DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public int[] batchUpdate(final List<Actor> actors) {
    return this.jdbcTemplate.batchUpdate(
        "update t_actor set first_name = ?, last_name = ? where id = ?",
        new BatchPreparedStatementSetter() {
          public void setValues(PreparedStatement ps, int i) throws SQLException {
            Actor actor = actors.get(i);
            ps.setString(1, actor.getFirstName());
            ps.setString(2, actor.getLastName());
            ps.setLong(3, actor.getId().longValue());
          }
          public int getBatchSize() {
            return actors.size();
          }
        });
  }

  // ... 其他方法
}
```

#### 使用对象列表进行批量操作

JdbcTemplate 和 NamedParameterJdbcTemplate 都提供了另一种提供批量更新的方式。 无需实现特殊的批处理接口，您可以将所有参数值作为列表在调用中提供。框架会循环遍历这些值并使用内部预处理语句设置器。 API 取决于您是否使用命名参数。对于命名参数，您提供一个 SqlParameterSource 数组，批次中的每个成员对应一个条目。 您可以使用 SqlParameterSourceUtils.createBatch 便捷方法创建此数组，传入一组 bean 风格的对象 （带有对应于参数的 getter 方法）、以 String 为键的 Map 实例（包含对应参数作为值），或者两者的混合。 以下示例展示了使用命名参数的批量更新：

```java
public class JdbcActorDao implements ActorDao {

  private NamedParameterTemplate namedParameterJdbcTemplate;

  public void setDataSource(DataSource dataSource) {
    this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
  }

  public int[] batchUpdate(List<Actor> actors) {
    return this.namedParameterJdbcTemplate.batchUpdate(
        "update t_actor set first_name = :firstName, last_name = :lastName where id = :id",
        SqlParameterSourceUtils.createBatch(actors));
  }

  // ... 其他方法
}
```

#### 多批次批量操作

前面的批量更新示例处理的是非常大的批次，以至于您希望将它们分解为几个较小的批次。 您可以使用前面提到的方法通过多次调用 batchUpdate 方法来做到这一点，但现在有一个更方便的方法。 此方法除了 SQL 语句外，还需要一个包含参数的对象 Collection、每个批次的更新次数， 以及一个用于设置预处理语句参数值的 ParameterizedPreparedStatementSetter。 框架循环遍历提供的值，并将更新调用分解为指定大小的批次。 以下示例展示了使用批次大小为 100 的批量更新：

## 选择 JDBC 数据库访问方式

> 原文：[`data-access/jdbc/choose-style`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/choose-style.adoc)

### 概述

您可以选择多种方法作为 JDBC 数据库访问的基础。除了三种风格的 JdbcTemplate 之外，SimpleJdbcInsert 和 SimpleJdbcCall 方法优化了数据库元数据，而 RDBMS 对象风格则产生了一种更面向对象的方法。一旦您开始使用其中一种方法，您仍然可以混合搭配以包含来自不同方法的功能。

## 控制数据库连接

> 原文：[`data-access/jdbc/connections`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/connections.adoc)

### 概述

本节涵盖：

#### 使用 DataSource

Infra 通过 DataSource 获取与数据库的连接。DataSource 是 JDBC 规范的一部分，是一个通用的连接工厂。它允许容器或框架向应用程序代码隐藏连接池和事务管理问题。作为开发人员，您无需了解有关如何连接到数据库的详细信息。这是设置数据源的管理员的责任。在开发和测试代码时，您很可能同时担任这两个角色，但您不一定非要了解生产数据源是如何配置的。 当您使用 Infra JDBC 层时，您可以从 JNDI 获取数据源，或者您可以使用第三方提供的连接池实现来配置自己的数据源。传统的选择是 Apache Commons DBCP 和 C3P0，带有 bean 风格的 DataSource 类；对于现代 JDBC 连接池，请考虑使用带有构建器风格 API 的 HikariCP。 NOTE: 您应该仅出于测试目的使用 DriverManagerDataSource 和 SimpleD

```java
@Configuration
class DriverManagerDataSourceConfiguration {

  @Component
  static DriverManagerDataSource dataSource() {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName("org.hsqldb.jdbcDriver");
    dataSource.setUrl("jdbc:hsqldb:hsql://localhost:");
    dataSource.setUsername("sa");
    dataSource.setPassword("");
    return dataSource;
  }

}
```

## 使用 JDBC 核心类控制基本 JDBC 处理和错误处理

> 原文：[`data-access/jdbc/core`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/core.adoc)

### 概述

本节介绍如何使用 JDBC 核心类来控制基本的 JDBC 处理，包括错误处理。它包含以下主题：

##### 查询 (SELECT)

以下查询获取关系中的行数：

```java
int rowCount = this.jdbcTemplate.queryForObject("select count(*) from t_actor", Integer.class);
```

##### 使用 JdbcTemplate 进行更新 (INSERT, UPDATE, 和 DELETE)

您可以使用 update(..) 方法执行插入、更新和删除操作。 参数值通常作为可变参数提供，或者作为对象数组提供。 以下示例插入一个新条目：

```java
this.jdbcTemplate.update(
    "insert into t_actor (first_name, last_name) values (?, ?)", "Leonor", "Watling");
```

##### 其他 JdbcTemplate 操作

您可以使用 execute(..) 方法运行任何任意 SQL。因此，该方法通常用于 DDL 语句。它被大量重载，具有接受回调接口、绑定变量数组等的变体。以下示例创建一个表：

##### JdbcTemplate 最佳实践

JdbcTemplate 类的实例一旦配置好就是线程安全的。 这很重要，因为这意味着您可以配置 JdbcTemplate 的单个实例，然后安全地将此共享引用注入到多个 DAO（或存储库）中。 JdbcTemplate 是有状态的，因为它维护对 DataSource 的引用，但此状态不是会话状态。 使用 JdbcTemplate 类（以及关联的 NamedParameterJdbcTemplate 类）时的常见做法是在 Infra 配置文件中配置 DataSource，然后将该共享 DataSource bean 依赖注入到您的 DAO 类中。JdbcTemplate 在 DataSource 的 setter 中创建。这导致 DAO 类似于以下内容： --

#### 使用 NamedParameterJdbcTemplate

NamedParameterJdbcTemplate 类增加了使用命名参数编程 JDBC 语句的支持，而不是仅使用经典占位符 ('?') 参数编程 JDBC 语句。NamedParameterJdbcTemplate 类包装了一个 JdbcTemplate 并委托给包装的 JdbcTemplate 来完成其大部分工作。本节仅描述 NamedParameterJdbcTemplate 类与 JdbcTemplate 本身不同的那些方面——即使用命名参数编程 JDBC 语句。以下示例显示了如何使用 NamedParameterJdbcTemplate：

#### 统一的 JDBC 查询/更新操作：JdbcClient

从 5.0 开始，NamedParameterJdbcTemplate 的命名参数语句和常规 JdbcTemplate 的位置参数语句都可以通过具有流畅交互模型的统一客户端 API 使用。 例如，使用位置参数：

#### 使用 SQLExceptionTranslator

SQLExceptionTranslator 是一个接口，由可以在 SQLException 和 Infra 自己的 infra.dao.DataAccessException 之间进行转换的类实现，后者与数据访问策略无关。实现可以是通用的（例如，使用 JDBC 的 SQLState 代码）或专有的（例如，使用 Oracle 错误代码）以获得更高的精度。这种异常转换机制用于通用的 JdbcTemplate 和 JdbcTransactionManager 入口点之后，它们不传播 SQLException，而是传播 DataAccessException。 NOTE: 默认的异常转换器是 SQLExceptionSubclassTranslator，它通过一些额外的检查检测 JDBC 4 SQLException 子类，并通过 SQLStateSQLExceptionTranslator 回

#### 运行语句

运行 SQL 语句只需要很少的代码。您需要一个 DataSource 和一个 JdbcTemplate，包括 JdbcTemplate 提供的便捷方法。以下示例显示了创建一个新表所需的最小但功能齐全的类中包含的内容：

#### 运行查询

一些查询方法返回单个值。要从一行中检索计数或特定值，请使用 queryForObject(..)。后者将返回的 JDBC Type 转换为作为参数传入的 Java 类。如果类型转换无效，则抛出 InvalidDataAccessApiUsageException。以下示例包含两个查询方法，一个用于 int，一个用于查询 String：

#### 更新数据库

以下示例更新某个主键的列：

#### 检索自动生成的键

update() 便捷方法支持检索由数据库生成的主键。此支持是 JDBC 3.0 标准的一部分。有关详细信息，请参阅规范的第 13.6 章。该方法将 PreparedStatementCreator 作为其第一个参数，这是指定所需插入语句的方式。另一个参数是 KeyHolder，它在更新成功返回时包含生成的键。没有标准的单一方法来创建适当的 PreparedStatement（这解释了为什么方法签名是这样的）。以下示例在 Oracle 上有效，但在其他平台上可能无效：

## 嵌入式数据库支持

> 原文：[`data-access/jdbc/embedded-database-support`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/embedded-database-support.adoc)

### 概述

infra.jdbc.datasource.embedded 包提供了对嵌入式 Java 数据库引擎的支持。原生支持 HSQL 和 H2。您还可以使用可扩展的 API 插入新的嵌入式数据库类型和 DataSource 实现。

#### 创建嵌入式数据库

您可以将嵌入式数据库实例作为 bean 公开，如下例所示： include-code::./JdbcEmbeddedDatabaseConfiguration[tag=snippet,indent=0]

```java
@Configuration
public class JdbcEmbeddedDatabaseConfiguration {

  @Bean
  static DataSource dataSource() {
    return new EmbeddedDatabaseBuilder()
            .generateUniqueName(true)
            .setType(EmbeddedDatabaseType.H2)
            .addScripts("schema.sql", "test-data.sql")
            .build();
  }

}
```

#### 自定义嵌入式数据库类型

虽然每种支持的类型都带有默认连接设置，但在必要时可以对其进行自定义。以下示例使用带有自定义驱动程序的 H2：

```java
@Configuration
public class DataSourceConfig {

  @Bean
  public DataSource dataSource() {
    return new EmbeddedDatabaseBuilder()
        .setDatabaseConfigurer(EmbeddedDatabaseConfigurers
            .customizeConfigurer(H2, this::customize))
            .addScript("schema.sql")
            .build();
  }

  private EmbeddedDatabaseConfigurer customize(EmbeddedDatabaseConfigurer defaultConfigurer) {
    return new EmbeddedDatabaseConfigurerDelegate(defaultConfigurer) {
      @Override
      public void configureConnectionProperties(ConnectionProperties properties, String databaseName) {
        super.configureConnectionProperties(properties, databaseName);
        properties.setDriverClass(CustomDriver.class);
      }
    };
  }
}
```

#### 使用嵌入式数据库测试数据访问逻辑

嵌入式数据库提供了一种轻量级的方法来测试数据访问代码。下一个示例是使用嵌入式数据库的数据访问集成测试模板。当嵌入式数据库不需要在测试类之间重用时，使用这样的模板对于一次性操作很有用。但是，如果您希望创建一个在测试套件中共享的嵌入式数据库，请考虑使用 Infra TestContext Framework，并将嵌入式数据库配置为 Infra ApplicationContext 中的 bean，如 创建嵌入式数据库 中所述。以下清单显示了测试模板：

## 初始化 DataSource

> 原文：[`data-access/jdbc/initializing-datasource`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/initializing-datasource.adoc)

### 概述

infra.jdbc.datasource.init 包提供了对初始化现有 DataSource 的支持。嵌入式数据库支持提供了为应用程序创建和初始化 DataSource 的一种选择。但是，您有时可能需要初始化运行在某处服务器上的实例。

#### 使用 Infra XML 初始化数据库

如果您想初始化数据库并且可以提供对 DataSource bean 的引用，则可以使用 infra-jdbc 命名空间中的 initialize-database 标签：

```xml
<jdbc:initialize-database data-source="dataSource">
  <jdbc:script location="classpath:com/foo/sql/db-schema.sql"/>
  <jdbc:script location="classpath:com/foo/sql/db-test-data.sql"/>
</jdbc:initialize-database>
```

## 将 JDBC 操作建模为 Java 对象

> 原文：[`data-access/jdbc/object`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/object.adoc)

### 概述

infra.jdbc.object 包包含允许您以更面向对象的方式访问数据库的类。例如，您可以运行查询并将结果作为包含业务对象的列表返回，其中关系列数据映射到业务对象的属性。您还可以运行存储过程以及执行更新、删除和插入语句。 许多 Infra 开发人员认为，下面描述的各种 RDBMS 操作类（StoredProcedure 类除外）通常可以用直接的 JdbcTemplate 调用来代替。通常，编写一个直接调用 JdbcTemplate 方法的 DAO 方法（而不是将查询封装为一个完整的类）更简单。 但是，如果您从使用 RDBMS 操作类中获得了可衡量的价值，则应继续使用这些类。

#### 使用 MappingSqlQuery

MappingSqlQuery 是一个可重用的查询，具体的子类必须实现抽象的 mapRow(..) 方法，以将提供的 ResultSet 的每一行转换为指定类型的对象。以下示例显示了一个自定义查询，该查询将来自 t_actor 关系的数据映射到 Actor 类的实例：

```java
public class ActorMappingQuery extends MappingSqlQuery<Actor> {

  public ActorMappingQuery(DataSource ds) {
    super(ds, "select id, first_name, last_name from t_actor where id = ?");
    declareParameter(new SqlParameter("id", Types.INTEGER));
    compile();
  }

  @Override
  protected Actor mapRow(ResultSet rs, int rowNumber) throws SQLException {
    Actor actor = new Actor();
    actor.setId(rs.getLong("id"));
    actor.setFirstName(rs.getString("first_name"));
    actor.setLastName(rs.getString("last_name"));
    return actor;
  }
}
```

#### 使用 SqlUpdate

SqlUpdate 类封装了一个 SQL 更新。与查询一样，更新对象是可重用的，并且与所有 RdbmsOperation 类一样，更新可以具有参数并在 SQL 中定义。该类提供了许多类似于查询对象的 execute(..) 方法的 update(..) 方法。SqlUpdate 类是具体的。它可以被子类化——例如，添加自定义更新方法。 但是，您不必子类化 SqlUpdate 类，因为可以通过设置 SQL 和声明参数轻松地将其参数化。 以下示例创建了一个名为 execute 的自定义更新方法：

```java
import java.sql.Types;
import javax.sql.DataSource;
import infra.jdbc.core.SqlParameter;
import infra.jdbc.object.SqlUpdate;

public class UpdateCreditRating extends SqlUpdate {

  public UpdateCreditRating(DataSource ds) {
    setDataSource(ds);
    setSql("update customer set credit_rating = ? where id = ?");
    declareParameter(new SqlParameter("creditRating", Types.NUMERIC));
    declareParameter(new SqlParameter("id", Types.NUMERIC));
    compile();
  }

  /**
   * @param id 要更新的客户的 id
   * @param rating 信用评级的新值
   * @return 更新的行数
   */
  public int execute(int id, int rating) {
    return update(rating, id);
  }
}
```

#### 使用 StoredProcedure

StoredProcedure 类是 RDBMS 存储过程的对象抽象的 abstract 超类。 继承的 sql 属性是 RDBMS 中存储过程的名称。 要为 StoredProcedure 类定义参数，您可以使用 SqlParameter 或其子类之一。您必须在构造函数中指定参数名称和 SQL 类型，如以下代码片段所示：

## 包层次结构

> 原文：[`data-access/jdbc/packages`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/packages.adoc)

### 概述

TODAY Framework 的 JDBC 抽象框架由四个不同的包组成：

## 参数和数据值处理的常见问题

> 原文：[`data-access/jdbc/parameter-handling`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/parameter-handling.adoc)

### 概述

TODAY Framework 的 JDBC 支持提供的不同方法中存在参数和数据值处理的常见问题。本节介绍如何解决这些问题。

#### 处理 BLOB 和 CLOB 对象

您可以在数据库中存储图像、其他二进制数据和大块文本。这些大对象对于二进制数据称为 BLOB（Binary Large OBject）， 对于字符数据称为 CLOB（Character Large OBject）。在 Infra 中，您可以直接使用 JdbcTemplate 处理这些大对象， 也可以在使用 RDBMS 对象和 SimpleJdbc 类提供的更高层抽象时处理。所有这些方法都使用 LobHandler 接口的实现来进行 LOB（Large OBject）数据的实际管理。LobHandler 通过 getLobCreator 方法提供对 LobCreator 类的访问，该类用于创建要插入的新 LOB 对象。 LobCreator 和 LobHandler 为 LOB 输入和输出提供以下支持： 下一个示例展示了如何创建和插入 BLOB。稍后我们将展示如何从数据库中读回它。 此示例使用

```java
final File blobIn = new File("spring2004.jpg");
final InputStream blobIs = new FileInputStream(blobIn);
final File clobIn = new File("large.txt");
final InputStream clobIs = new FileInputStream(clobIn);
final InputStreamReader clobReader = new InputStreamReader(clobIs);

jdbcTemplate.execute(
  "INSERT INTO lob_table (id, a_clob, a_blob) VALUES (?, ?, ?)",
  new AbstractLobCreatingPreparedStatementCallback(lobHandler) {  // <1>
    protected void setValues(PreparedStatement ps, LobCreator lobCreator) throws SQLException {
      ps.setLong(1, 1L);
      lobCreator.setClobAsCharacterStream(ps, 2, clobReader, (int)clobIn.length());  // <2>
      lobCreator.setBlobAsBinaryStream(ps, 3, blobIs, (int)blobIn.length());  // <3>
    }
  }
);

blobIs.close();
clobReader.close();
```

#### 处理存储过程调用的复杂类型

调用存储过程时，有时可以使用特定于数据库的复杂类型。为了适应这些类型，Infra 提供了 SqlReturnType 用于处理从存储过程调用返回的它们，以及 SqlTypeValue 用于将它们作为参数传递给存储过程。 SqlReturnType 接口有一个必须实现的单一方法（名为 getTypeValue）。此接口用作 SqlOutParameter 声明的一部分。 以下示例显示了返回用户声明类型 ITEM_TYPE 的 Oracle STRUCT 对象的值：

```java
public class TestItemStoredProcedure extends StoredProcedure {

  public TestItemStoredProcedure(DataSource dataSource) {
    // ...
    declareParameter(new SqlOutParameter("item", OracleTypes.STRUCT, "ITEM_TYPE",
      (CallableStatement cs, int colIndx, int sqlType, String typeName) -> {
        STRUCT struct = (STRUCT) cs.getObject(colIndx);
        Object[] attr = struct.getAttributes();
        TestItem item = new TestItem();
        item.setId(((Number) attr[0]).longValue());
        item.setDescription((String) attr[1]);
        item.setExpirationDate((java.util.Date) attr[2]);
        return item;
      }));
    // ...
  }
```

## 使用 SimpleJdbc 类简化 JDBC 操作

> 原文：[`data-access/jdbc/simple`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/jdbc/simple.adoc)

### 概述

SimpleJdbcInsert 和 SimpleJdbcCall 类利用可以通过 JDBC 驱动程序检索的数据库元数据，提供了简化的配置。 这意味着您可以减少前期的配置工作，当然，如果您更喜欢在代码中提供所有细节，也可以覆盖或关闭元数据处理。

#### 使用 SimpleJdbcInsert 插入数据

我们首先看看具有最少配置选项的 SimpleJdbcInsert 类。您应该在数据访问层的初始化方法中实例化 SimpleJdbcInsert。 对于此示例，初始化方法是 setDataSource 方法。您不需要子类化 SimpleJdbcInsert 类。 相反，您可以创建一个新实例并使用 withTableName 方法设置表名。 此类的配置方法遵循返回 SimpleJdbcInsert 实例的“流式”风格，这允许您链接所有配置方法。 以下示例仅使用一种配置方法（我们稍后将展示多种方法）：

```java
public class JdbcActorDao implements ActorDao {

  private SimpleJdbcInsert insertActor;

  public void setDataSource(DataSource dataSource) {
    this.insertActor = new SimpleJdbcInsert(dataSource).withTableName("t_actor");
  }

  public void add(Actor actor) {
    Map<String, Object> parameters = new HashMap<>(3);
    parameters.put("id", actor.getId());
    parameters.put("first_name", actor.getFirstName());
    parameters.put("last_name", actor.getLastName());
    insertActor.execute(parameters);
  }

  // ... 其他方法
}
```

#### 使用 SimpleJdbcInsert 检索自动生成的键

此示例使用与前一个相同的插入，但不是传入 id，而是检索自动生成的键并将其设置在新的 Actor 对象上。 当您创建 SimpleJdbcInsert 时，除了指定表名外，您还可以使用 usingGeneratedKeyColumns 方法指定生成的键列的名称。 以下清单显示了其工作原理：

```java
public class JdbcActorDao implements ActorDao {

  private SimpleJdbcInsert insertActor;

  public void setDataSource(DataSource dataSource) {
    this.insertActor = new SimpleJdbcInsert(dataSource)
        .withTableName("t_actor")
        .usingGeneratedKeyColumns("id");
  }

  public void add(Actor actor) {
    Map<String, Object> parameters = new HashMap<>(2);
    parameters.put("first_name", actor.getFirstName());
    parameters.put("last_name", actor.getLastName());
    Number newId = insertActor.executeAndReturnKey(parameters);
    actor.setId(newId.longValue());
  }

  // ... 其他方法
}
```

#### 指定 SimpleJdbcInsert 的列

您可以通过使用 usingColumns 方法指定列名列表来限制插入的列，如下例所示：

#### 使用 SqlParameterSource 提供参数值

使用 Map 提供参数值工作得很好，但这不是最方便的类。 Infra 提供了几个 SqlParameterSource 接口的实现，您可以方便地使用它们。 第一个是 BeanPropertySqlParameterSource，如果你有一个遵循 JavaBean 约定的类，并且它具有与列名匹配的属性，这非常方便。 它使用相应的 getter 方法来提取参数值。以下示例展示了如何使用 BeanPropertySqlParameterSource：

#### 使用 SimpleJdbcCall 调用存储过程

SimpleJdbcCall 类利用数据库中的元数据来查找 in 和 out 参数的名称，这样您就不必显式声明它们。 如果愿意，您可以声明参数，或者如果除此之外您还有参数（如 ARRAY 或 STRUCT）没有自动映射到 Java 类，也可以声明参数。 第一个示例展示了一个简单的过程，它仅返回 VARCHAR 和 DATE 格式的标量值。 该过程示例读取指定的 actor 条目，并以 out 参数的形式返回 firstname、lastname 和 birth_date 列。 以下清单显示了该过程：

#### 为 SimpleJdbcCall 显式声明参数

在本章前面，我们描述了如何从元数据推导参数，但如果愿意，您可以显式声明它们。 为此，您可以使用 declareParameters 方法创建和配置 SimpleJdbcCall，该方法接受可变数量的 SqlParameter 对象作为输入。 有关如何定义 SqlParameter 的详细信息，请参阅 下一节。 NOTE: 如果您使用的数据库不是 Infra 支持的数据库，则必须进行显式声明。 目前，Infra 支持对以下数据库的存储过程调用进行元数据查找：DB2、MySQL、Microsoft SQL Server、Oracle 和 Sybase。 我们还支持 MySQL、Microsoft SQL Server 和 Oracle 的存储函数元数据查找。 您可以选择显式声明一个、部分或全部参数。在您未显式声明参数的地方，仍会使用参数元数据。 要绕过对潜在参数的所有元数据查找处理并仅使用声明

#### 如何定义 SqlParameter

要为 SimpleJdbc 类（以及 RDBMS 操作类，涵盖在 将 JDBC 操作建模为 Java 对象 中）定义参数，您可以使用 SqlParameter 或其子类之一。 为此，您通常在构造函数中指定参数名称和 SQL 类型。SQL 类型使用 java.sql.Types 常量指定。 在本章前面，我们看到了类似于以下的声明：

#### 使用 SimpleJdbcCall 调用存储函数

调用存储函数几乎与调用存储过程相同，只是您提供的是函数名称而不是过程名称。 您使用 withFunctionName 方法作为配置的一部分，以指示我们想要进行函数调用，并且生成相应的函数调用字符串。 专门用于运行函数的调用（executeFunction）返回指定类型的函数返回值，这意味着您不必从结果映射中检索返回值。 对于只有一个 out 参数的存储过程，也有一个类似的便捷方法（名为 executeObject）。 以下示例（针对 MySQL）基于名为 getactorname 的存储函数，该函数返回演员的全名：

#### 从 SimpleJdbcCall 返回 ResultSet 或 REF 游标

调用返回结果集的存储过程或函数有点棘手。某些数据库在 JDBC 结果处理期间返回结果集， 而另一些数据库则需要显式注册特定类型的 out 参数。这两种方法都需要额外的处理来循环遍历结果集并处理返回的行。 使用 SimpleJdbcCall，您可以使用 returningResultSet 方法并声明一个 RowMapper 实现用于特定参数。 如果结果集是在结果处理期间返回的，则没有定义的名称，因此返回的结果必须与您声明 RowMapper 实现的顺序相匹配。 指定的名称仍用于将处理后的结果列表存储在从 execute 语句返回的结果映射中。 下一个示例（针对 MySQL）使用一个不接受 IN 参数并返回 t_actor 表中所有行的存储过程：

## DAO 支持

> 原文：[`data-access/dao`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/dao.adoc)

### 概述

数据访问对象（DAO）支持在 Infra 中旨在以一种一致的方式简化与数据访问技术（如 JDBC、Hibernate 或 JPA）的工作。 这使您能够在这些持久化技术之间相对容易地切换，并且让您在编码时不必担心捕获每种技术特有的异常。

#### 用于配置 DAO 或存储库类的注解

确保您的数据访问对象（DAO）或存储库提供异常转换的最佳方法是使用 @Repository 注解。 此注解还允许组件扫描支持在不需要为它们提供 XML 配置条目的情况下找到并配置您的 DAO 和存储库。以下示例展示了如何使用 @Repository 注解：

```java
@Repository // <1>
public class SomeMovieFinder implements MovieFinder {
  // ...
}
```

## 使用 Object-XML 映射器编组 XML

> 原文：[`data-access/oxm`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/oxm.adoc)

### 概述

##### 理解 Marshaller

Infra 将所有编组操作抽象在 infra.oxm.Marshaller 接口之后，其主要方法如下：

```java
public interface Marshaller {

  /**
   * 将具有给定根的对象图编组到提供的 Result 中。
   */
  void marshal(Object graph, Result result) throws XmlMappingException, IOException;
}
```

##### 理解 Unmarshaller

与 Marshaller 类似，我们有 infra.oxm.Unmarshaller 接口，如下所示：

```java
public interface Unmarshaller {

  /**
   * 将给定的 Source 解组为对象图。
   */
  Object unmarshal(Source source) throws XmlMappingException, IOException;
}
```

#### 使用 Marshaller 和 Unmarshaller

您可以将 Infra OXM 用于各种情况。在以下示例中，我们使用它将 Infra 管理的应用程序的设置编组为 XML 文件。 在以下示例中，我们使用一个简单的 JavaBean 来表示设置：

#### XML 配置命名空间

您可以使用 OXM 命名空间中的标记更简洁地配置编组器。 要使这些标记可用，您必须首先在 XML 配置文件的序言中引用适当的模式。 以下示例展示了如何执行此操作：

##### 使用 Jaxb2Marshaller

Jaxb2Marshaller 类实现了 Infra 的 Marshaller 和 Unmarshaller 接口。 它需要一个上下文路径才能操作。您可以通过设置 contextPath 属性来设置上下文路径。 上下文路径是包含模式派生类的 Java 包名称的列表，以冒号分隔。 它还提供了一个 classesToBeBound 属性，允许您设置编组器支持的类数组。 通过向 bean 指定一个或多个模式资源来执行模式验证，如下例所示：

##### XML 配置命名空间

jaxb2-marshaller 元素配置一个 infra.oxm.jaxb.Jaxb2Marshaller， 如下例所示：

##### 使用 JibxMarshaller

JibxMarshaller 类实现了 Marshaller 和 Unmarshaller 接口。 要进行操作，它需要要编组的类的名称，您可以使用 targetClass 属性进行设置。 或者，您可以通过设置 bindingName 属性来设置绑定名称。 在以下示例中，我们绑定 Flights 类：

##### XML 配置命名空间

jibx-marshaller 标记配置一个 infra.oxm.jibx.JibxMarshaller， 如下例所示：

##### 使用 XStreamMarshaller

XStreamMarshaller 不需要任何配置，可以直接在应用程序上下文中进行配置。 为了进一步自定义 XML，您可以设置一个别名映射，该映射由映射到类的字符串别名组成，如下例所示：

## 附录

> 原文：[`data-access/appendix`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/data-access/appendix.adoc)

### 概述

##### tx 模式

tx 标签用于在 Infra 对事务的全面支持中配置所有那些 bean。 这些标签在名为 事务管理 的章节中有所介绍。 TIP: 我们强烈建议您查看 Infra 发行版中随附的 'spring-tx.xsd' 文件。 此文件包含 Infra 事务配置的 XML 模式，并涵盖了 tx 命名空间中的所有各种元素， 包括属性默认值和类似信息。此文件在内部有文档说明，因此，为了遵守 DRY（不要重复自己）原则， 此处不再重复这些信息。 为了完整起见，要使用 tx 模式中的元素，您需要在 Infra XML 配置文件的顶部包含以下序言。 以下代码段中的文本引用了正确的模式，以便 tx 命名空间中的标签可供您使用：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:tx="http://www.springframework.org/schema/tx" <1>
  xmlns:aop="http://www.springframework.org/schema/aop"
  xsi:schemaLocation="
    http://www.springframework.org/schema/beans
    https://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/tx
    https://www.springframework.org/schema/tx/spring-tx.xsd <2>
    http://www.springframework.org/schema/aop
    https://www.springframework.org/schema/aop/spring-aop.xsd">

  <!-- bean definitions here -->

</beans>
```

##### jdbc 模式

jdbc 元素让您可以快速配置嵌入式数据库或初始化现有的数据源。 这些元素分别记录在 嵌入式数据库支持 和 初始化数据源 中。 要使用 jdbc 模式中的元素，您需要在 Infra XML 配置文件的顶部包含以下序言。 以下代码段中的文本引用了正确的模式，以便 jdbc 命名空间中的元素可供您使用：

```xml
	<?xml version="1.0" encoding="UTF-8"?>
	<beans xmlns="http://www.springframework.org/schema/beans"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xmlns:jdbc="http://www.springframework.org/schema/jdbc" <1>
		xsi:schemaLocation="
			http://www.springframework.org/schema/beans
			https://www.springframework.org/schema/beans/spring-beans.xsd
			http://www.springframework.org/schema/jdbc
			https://www.springframework.org/schema/jdbc/spring-jdbc.xsd"> <2>

		<!-- bean definitions here -->

	</beans>
```

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
