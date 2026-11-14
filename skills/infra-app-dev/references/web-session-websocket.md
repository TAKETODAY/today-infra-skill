# 会话与 WebSocket

> 由 `scripts/build-refs.mjs` 从 `infra-docs` 生成，请勿手工编辑；改归类请改 `data/topics.json`。

HTTP Session 管理、WebSocket 服务端与降级。

覆盖文档：4 页（含示例 2 页）。原文位于仓库 `infra-docs/`，下方每个页面标注了路径。

## 页面索引

- **Web 会话** —— `web/session/index`
- WebSockets —— `web/websocket`
- 回退 —— `web/websocket/fallback`
- **WebSocket API** —— `web/websocket/server`

## Web 会话

> 原文：[`web/session/index`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/session/index.adoc)

### 概述

#### 介绍

提供了一套类似 Servlet 的 Session API接口，在 infra.session 下。 提供了 Session 没有的 SessionManager API 接口用来管理会话，也支持会话事件如下：

```java
public interface SessionListener extends EventListener {

  default void sessionCreated(Session se) {
    // default do nothing
  }

  default void sessionDestroyed(Session se) {
    // default do nothing
  }

}

public interface AttributeBindingListener extends EventListener {

  default void valueBound(Session session, String attributeName) {

  }

  default void valueUnbound(Session session, String attributeName) {

  }

}

public interface SessionAttributeListener extends EventListener {

  default void attributeAdded(Session session, String attributeName, Object value) {

  }

  default void attributeRemoved(Session session, String attributeName, @Nullable Object value) {

  }

  default void attributeReplaced(Session session, String attributeName, Object oldValue, Object newValue) {

  }

}
```

## WebSockets

> 原文：[`web/websocket`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/websocket.adoc)

### 概述

这部分的文档包含了基于 Netty 的 Websocket

## 回退

> 原文：[`web/websocket/fallback`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/websocket/fallback.adoc)

### 概述

在公共互联网上，限制性代理可能会阻止 WebSocket 交互，要么是因为它们未配置为传递 Upgrade 标头，要么是因为它们关闭看起来处于空闲状态的长连接。 解决此问题的方法是 WebSocket 模拟 -- 即首先尝试使用 WebSocket，然后退回到模拟 WebSocket 交互并公开相同应用级别 API 的基于 HTTP 的技术。

## WebSocket API

> 原文：[`web/websocket/server`](https://github.com/TAKETODAY/today-infrastructure/blob/master/infra-docs/modules/ROOT/pages/web/websocket/server.adoc)

### 概述

框架提供了一个 WebSocket API，您可以使用它来编写处理 WebSocket 消息的客户端和服务器端应用程序。

#### WebSocketHandler

创建一个 WebSocket 服务器就像实现 WebSocketHandler 一样简单，或者更可能是扩展 TextWebSocketHandler 或 BinaryWebSocketHandler 中的一个。 以下示例使用了 TextWebSocketHandler：

```java
public class MyHandler extends TextWebSocketHandler {

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    // ...
  }
}
```

#### WebSocket 握手

通过 HandshakeInterceptor 是定制初始 HTTP WebSocket 握手请求的最简单方法，它公开了 "before" 和 "after" 握手的方法。 您可以使用此类拦截器来阻止握手或使任何属性可用于 WebSocketSession。 以下示例使用内置拦截器将 HTTP 会话属性传递到 WebSocket 会话：

```java
@Configuration
public class WebSocketConfiguration implements WebSocketConfigurer {

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(new MyHandler(), "/myHandler");
    //.addInterceptors(new SessionHandshakeInterceptor());
  }

}
```

#### 允许的来源

WebSocket 和 SockJS 的默认行为是仅接受同源请求。 也可以允许所有或指定的一组来源。 此检查主要设计用于浏览器客户端。 没有任何阻止其他类型的客户端修改 Origin 标头值（有关详细信息，请参见 RFC 6454: The Web Origin Concept）。 三种可能的行为是： 并且禁用了 JSONP 传输，因为它不允许检查请求的来源。因此，当启用此模式时，不支持 IE6 和 IE7。 在此模式下，所有传输都可用。 您可以配置 WebSocket 和 SockJS 允许的来源，如下例所示：

---

> 本文件已达到 60 个示例的上限，其余内容请在 `infra-docs/` 原文查阅。
