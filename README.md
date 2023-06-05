# nest_study学习笔记
## 1. 5种 HTTP数据传输方式
用 axios 发送请求，使用 Nest 起后端服务，实现了 5 种 http/https 的数据传输方式：

其中前两种是 url 中的：

- url param： url 中的参数，Nest 中使用 @Param 来取
- query：url 中 ? 后的字符串，Nest 中使用 @Query 来取

后三种是 body 中的：

- form urlencoded： 类似 query 字符串，只不过是放在 body 中。Nest 中使用 @Body 来取，axios 中需要指定 content type 为 `application/x-www-form-urlencoded`，并且对数据用 qs 或者 query-string 库做 url encode
- json： json 格式的数据。Nest 中使用 @Body 来取，axios 中不需要单独指定 content type，axios 内部会处理。
- form data：通过 ----- 作为 boundary 分隔的数据。主要用于传输文件，Nest 中要使用 FilesInterceptor 来处理其中的 binary 字段，用 @UseInterceptors 来启用，其余字段用 @Body 来取。axios 中需要指定 content type 为 `multipart/form-data`，并且用 FormData 对象来封装传输的内容。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3400df2fb1341b1ba384b1ba1baa19d~tplv-k3u1fbpfcp-zoom-1.awebp?)

## 2. IOC解决了什么问题？
后端系统有很多的对象，这些对象之间的关系错综复杂，如果手动创建并组装对象比较麻烦，所以后端框架一般都提供了 IOC 机制。

IOC（Inverse Of Control，控制反转） 机制是在 `class` 上标识哪些是可以被注入的，它的依赖是什么，然后从入口开始扫描这些对象和依赖，自动创建和组装对象。

Nest 里通过 `@Controller` 声明可以被注入的 `controller`，通过 `@Injectable` 声明可以被注入也可以注入别的对象的 `provider`，然后在 `@Module` 声明的模块里引入。

并且 Nest 还提供了 `Module` 和 `Module` 之间的 import，可以引入别的模块的 `provider` 来注入。

虽然 Nest 这套实现了 IOC 的模块机制看起来繁琐，但是却解决了后端系统的对象依赖关系错综复杂的痛点问题。

## 3. 使用多种provider，灵活注入对象

一般情况下，`provider` 是通过 `@Injectable` 声明，然后在 `@Module` 的 `providers` 数组里注册的 `class`。

默认的 `token` 就是 `class`，这样不用使用 `@Inject` 来指定注入的 `token`。

但也可以用字符串类型的 `token`，不过注入的时候要用 `@Inject` 单独指定。

除了可以用 `useClass` 指定注入的 `class`，还可以用 `useValue` 直接指定注入的对象。

如果想动态生成对象，可以使用 `useFactory`，它的参数也注入 IOC 容器中的对象，然后动态返回 `provider` 的对象。

如果想起别名，可以用 `usExisting` 给已有的 `token`，指定一个新 `token`。

灵活运用这些 `provider` 类型，就可以利用 Nest 的 IOC 容器中注入任何对象。
