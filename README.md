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

## 4. 全局模块和生命周期
模块可以通过 `@Global` 声明为全局的，这样它 `exports` 的 `provider` 就可以在各处使用了，不需要 `imports`。

`provider`、`controller`、`module` 都支持启动和销毁的生命周期函数，这些生命周期函数都支持 `async` 的方式。

可以在其中做一些初始化、销毁的逻辑，比如 `onApplicationShutwon` 里通过 `moduleRef.get` 取出一些 `provider`，执行关闭连接等销毁逻辑。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd793a59d8a24b3e86312746c25eeb32~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bb1ccd84fb14e638274df35198c3cff~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

## 5. AOP架构
Nest 基于 express 这种 http 平台做了一层封装，应用了 MVC、IOC、AOP 等架构思想。

`MVC` 就是 Model、View Controller 的划分，请求先经过 `Controller`，然后调用 Model 层的 `Service`、Repository 完成业务逻辑，最后返回对应的 `View`。

`IOC` 是指 Nest 会自动扫描带有 @Controller、@Injectable 装饰器的类，创建它们的对象，并根据依赖关系自动注入它依赖的对象，免去了手动创建和组装对象的麻烦。

`AOP（Aspect Oriented Programming）` 则是把通用逻辑抽离出来，通过切面的方式添加到某个地方，可以复用和动态增删切面逻辑。

Nest 的 `Middleware`、`Guard`、`Interceptor`、`Pipe`、`ExceptionFileter` 都是 `AOP` 思想的实现，只不过是不同位置的切面，它们都可以灵活的作用在某个路由或者全部路由，这就是 `AOP` 的优势。

我们通过源码来看了它们的调用顺序，`Middleware` 是 Express 的概念，在最外层，到了某个路由之后，会先调用 `Guard`，`Guard` 用于判断路由有没有权限访问，然后会调用 `Interceptor`，对 `Contoller` 前后扩展一些逻辑，在到达目标 `Controller` 之前，还会调用 `Pipe` 来对参数做检验和转换。所有的 **HttpException** 的异常都会被 `ExceptionFilter` 处理，返回不同的响应。

Nest 就是通过这种 `AOP` 的架构方式，实现了松耦合、易于维护和扩展的架构。

> Middleware(最外层) =>Guard(判断路由有没有权限访问) =>ExceptionFilter(异常都会被 ExceptionFilter 处理，返回不同的响应) =>Interceptor(Contoller 前后扩展一些逻辑) =>Pipe(对参数做检验和转换)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fc2dc8038a04200a631ef3643858279~tplv-k3u1fbpfcp-zoom-1.awebp?)

