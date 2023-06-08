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

## 6. 装饰器总览
1. @Module

Nest 提供了一套模块系统，通过 @Module声明模块：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/350bf6ae1f1d425aba1e30a2112c75f4~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

2. @Controller

通过 @Controller 声明其中的 controller:

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/835bb7e52eb24497bec4a6c97a682307~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

3. @Injectable

通过 @Injectable 声明其中的 provider：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63c2e0a4e2e04d638fd510e658429265~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

4. @Inject

通过 @Inject 指定注入的 token:

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/035c9f0ee8e540aaa5e1ceadb1ce9aa2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16e14a5849b64701b3f74162046c6f38~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

5. @Optional

这些注入的依赖如果没有的话，创建对象时会报错。但如果它是可选的，你可以用 @Optional 声明一下，这样没有对应的 provider 也能正常创建这个对象。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9742d2a930b47018c07a627b57cfdb3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

6. @Global

如果模块被很多地方都引用，为了方便，可以用 @Global 把它声明为全局的，这样它 exports 的 provider 就可以直接注入了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16ce92233e484b4e974c9af63f24a8bc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

7. @Catch

filter 是处理抛出的未捕获异常的，通过 @Catch 来指定处理的异常：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cd95a5fb6b44d17869c3ae45fda9467~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

8. @UseFilters

将上述抛出异常，通过 @UseFilters 应用到 handler 上：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f824522eee2d4c9f96b38b1784879280~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

9. @UseInterceptors
10. @UseGuards
11. @UsePipes

除了 filter 之外，interceptor、guard、pipe 也是这样用：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54b937a0d54a40a19b81624eb8e82a1b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

当然，pipe 更多还是单独在某个参数的位置应用：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fced92c2344495b86524871d8ed9cfa~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

12. @Param

上图中@Param 是取路径中的参数，比如 /xxx/111 种的 111

13. @Query

上图中@Query 是取 url 后的 ?bbb=true

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f61a443880944b1bb1aff47d2e77e769~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/493ea39f11f1488ba3bd53dc6f4ee405~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

14. @Get
15. @Post
16. @Body

如果是 @Post 请求，可以通过 @Body 取到 body 部分：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a10d3521580a486ca1348b3f9b7bdde8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

我们一般用 dto 的 class 来接受请求体里的参数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58338c7cc0634a388c58bde39f5bc8b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

17. @Put
18. @Delete
19. @Patch
20. @Head
21. @Options
22. @SetMetadata

handler 和 class 可以通过 @SetMetadata 指定 metadata：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/937ac8e44f2d4fedb9818a0b6c8e70c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

然后在 guard 或者 interceptor 里取出来：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27163078cd944d68b10c13068dc08145~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5971233494fb4a1bb6968501878dd66a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

23. @Headers

通过 @Headers 装饰器取某个请求头 或者全部请求头：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59578d6bc6a64764a276c3fb8abbb1e8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/583883749dc14df0b5d1ed7efbffee1c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)


24. @Ip

通过 @Ip 拿到请求的 ip：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dadc94181774a94aa3913d8d793909f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

25. @Session

通过 @Session 拿到 session 对象：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f8c71364e3849e3b6fd1b9b9dacaeea~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

但要使用 session 需要安装一个 express 中间件：

```bash
npm install express-session
```

在 main.ts 里引入并启用：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5971294374b641c7b099f95471b4f6e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

指定加密的密钥和 cookie 的存活时间。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d3b62447a4041e6b9f666da1d8e2705~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

会返回 set-cookie 的响应头，设置了 cookie，包含 sid 也就是 sesssionid。

之后每次请求都会自动带上这个 cookie。

26. @HostParam

用于取域名部分的参数

27. @Req 或 @Request

上面这些都是 request 里的属性，当然也可以直接注入 request 对象：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f2bd6c37caf46b6b1e4b96f29e78291~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

28.  @Res 或 @Response

可以使用 @Res 或者 @Response 注入 response 对象，只不过 response 对象有点特殊：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0069b293e87e44a8af1df6a6150ff511~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

29. @Next

当你有两个 handler 来处理同一个路由的时候，可以在第一个 handler 里注入 next，调用它来把请求转发到第二个 handler：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b696471d11644cc8dc4a07efd697546~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f74e4f19b09e434496a5dfe35caedc66~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

Nest 不会处理注入 @Next 的 handler 的返回值。

30. @HttpCode

handler 默认返回的是 200 的状态码，你可以通过 @HttpCode 修改它：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7148d5f586494f9891b1d4a43cebc103~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

31. @Header

通过 @Header 装饰器修改 response header：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ce211852e9e4d5c9d9f954355f5c60b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00ef498cad0d4670821b46eb64a12731~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

32. @Redirect

通过 @Redirect 装饰器来指定路由重定向的 url：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ee4edf4a78b4fb683fb4f48d91270a5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

33. @Redirect

指定渲染用的模版引擎


## 7. 如何自定义装饰器

内置装饰器不够用的时候，或者想把多个装饰器合并成一个的时候，都可以自定义装饰器。

**方法的装饰器**就是传入参数，调用下别的装饰器就好了，比如对 `@SetMetadata` 的封装。

如果组合多个方法装饰器，可以使用 `applyDecorators` api。

**class 装饰器**和**方法装饰器**一样。

还可以通过 `createParamDecorator` 来创建**参数装饰器**，它能拿到 `ExecutionContext`，进而拿到 reqeust、response，可以实现很多内置装饰器的功能，比如 `@Query`、`@Headers` 等装饰器。

通过自定义方法和参数的装饰器，可以让 Nest 代码更加的灵活。

## 8. ExecutionContext 切换不同上下文

为了让 `Filter`、`Guard`、`Exception`、`Filter` 支持 http、ws、rpc 等场景下复用，Nest 设计了 `ArgumentHost` 和 `ExecutionContext` 类。

`ArgumentHost` 可以通过 `getArgs` 或者 `getArgByIndex` 拿到上下文参数，比如 request、response、next 等。

更推荐的方式是根据 `getType` 的结果分别 `switchToHttp`、`switchToWs`、`swtichToRpc`，然后再取对应的 argument。

而 `ExecutionContext` 还提供 `getClass`、`getHandler` 方法，可以结合 `reflector` 来取出其中的 `metadata`。


guard、interceptor、middleware、pipe、filter 都是 Nest 的特殊 class，当你通过 @UseXxx 使用它们的时候，Nest 就会扫描到它们，创建对象它们的对象加到容器里，就已经可以注入依赖了。

## 9. Nest的实现的核心： Metadata 和 Reflector

Nest 的装饰器的实现原理就是 `Reflect.getMetadata`、`Reflect.defineMetadata` 这些 api。通过在 class、method 上添加 `metadata`，然后扫描到它的时候取出 `metadata` 来做相应的处理来完成各种功能。

Nest 的 `Controller`、`Module`、`Service` 等等所有的装饰器都是通过 `Reflect.meatdata` 给**类**或**对象**添加元数据的，然后初始化的时候取出来做依赖的扫描，实例化后放到 IOC 容器里。

**实例化对象**还需要构造器参数的类型，这个开启 ts 的 `emitDecoratorMetadata` 的编译选项之后， ts 就会自动添加一些元数据，也就是 `design:type`、`design:paramtypes`、`design:returntype` 这三个，分别代表**被装饰的目标的类型**、**参数的类型**、**返回值的类型**。

当然，`reflect metadata` 的 api 还在**草案**阶段，需要引入 `refelect-metadata` 的包做 `polyfill`。

Nest 还提供了 `@SetMetadata` 的装饰器，可以在 `controller` 的 `class` 和 `method` 上添加 `metadata`，然后在 `interceptor` 和 `guard` 里通过 `reflector` 的 api 取出来。

## 10. Module 和 Provider的循环依赖如何解决？

Module 之间可以相互 `imports`，`Provider` 之间可以相互注入，这两者都会形成循环依赖。

解决方式就是两边都用 `forwardRef` 来包裹下。

它的原理就是 nest 会先创建 `Module`、`Provider`，之后再把**引用**转发到对方，也就是 `forward ref`。

## 11. 创建动态模块

`Module` 可以传入 `options` 动态产生，这叫做动态 `Module`，你还可以把传入的 `options` 作为 `provider` 注入到别的对象里。

建议的动态产生 Module 的方法名有 `register`、`forRoot`、`forFeature` 3种。

- `register`：用一次注册一次

- `forRoot`：只注册一次，用多次

- `forFeature`：用了 `forRoot` 之后，用 `forFeature` 传入局部配置

并且这些方法都可以写 `xxxAsync` 版本，也就是传入 `useFactory` 等 `option`，内部注册异步 `provider`。

这个过程也可以用 `ConfigurableModuleBuilder` 来生成。通过 `setClassMethodName` 设置方法名，通过 `setExtras` 设置额外的 `options` 处理逻辑。

并且返回的 `class` 都有 `xxxAsync` 的版本。

这就是**动态模块**的定义方式，后面用到 `typeorm`、`mongoose` 等模块会大量见到这种模块。

## 12. Nest 和 Express 的关系，如何切到fastify

`express` 是基于中间件的洋葱模型处理请求、响应的库，它并没有提供组织代码的架构特性，代码可以写的很随意。

而为了更好的可维护性，我们都会用 `Nest` 这种一站式企业级开发框架。就像 `java` 里会用 `Spring` 框架一样。

`Nest` 底层是 `express` 但也不完全是，它内部实现是基于 `interface` 的，而且提供了 `@nestjs/platform-express`、`@nestjs/platform-fastify` 这两个 `adapter` 包。

这样就可以轻松的切换 `express`、`fastify` 或者其他的 `http` 请求处理的库。

## 13. Nest 的 Middleware

Nest 也有 `middleware`，但是它不是 Express 的 middleware，虽然都有 request、response、next 参数，但是它可以从 Nest 的 IOC 容器注入依赖，还可以指定作用于哪些路由。

用法是 Module 实现 `NestModule` 的 `configure` 方法，调用 `apply` 和 `forRoutes` 指定什么中间件作用于什么路由。

`app.use` 也可以应用中间件，但更建议在 `AppModule` 里的 `configure` 方法里指定。

Nest 还有个 `@Next` 装饰器，这个是用于调用下个 `handler` 处理的，当用了这个装饰器之后，Nest 就不会把 `handler` 返回值作为响应了。

### middleware 和 interceptor 的不同
- `interceptor` 是能从 `ExecutionContext` 里拿到目标 `class` 和 `handler`，进而通过 `reflector` 拿到它的 `metadata` 等信息的，这些 `middleware` 就不可以。
- `interceptor` 里是可以用 `rxjs` 的操作符来组织响应处理流程的。
  
`interceptor` 更适合处理具体的业务逻辑。 `middleware` 更适合处理通用的逻辑。


## 14. Rxjs 和 Interceptor

`rxjs` 是一个处理异步逻辑的库，它的特点就是 `operator` 多，你可以通过组合 `operator` 来完成逻辑，不需要自己写。

nest 的 `interceptor` 就用了 `rxjs` 来处理响应，但常用的 `operator` 也就这么几个：

- `tap:` 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等。
- `map：`对响应数据做修改，一般都是改成 `{code, data, message}` 的格式。
- `catchError：`在 `exception filter` 之前处理抛出的异常，可以记录或者抛出别的异常。
- `timeout：`处理响应超时的情况，抛出一个 `TimeoutError`，配合 `catchErrror` 可以返回超时的响应。

`rxjs` 的 `operator` 多，但是适合在 nest interceptor 里用的也不多。

此外，`interceptor `也是可以注入依赖的，你可以通过注入模块内的各种 `provider`。

全局 `interceptor` 可以通过 `APP_INTERCEPTOR` 的 `token` 声明，这种能注入依赖，比 `app.useGlobalInterceptors` 更好。

## 15. 内置 Pipe 和自定义 Pipe

`Pipe` 是在参数传给 `handler` 之前做一些验证和转换的，有 `9` 个内置的 `Pipe` 可以直接用: `ParseIntPipe`、`ParseBoolPipe`、`ParseArrayPipe`、`ParseUUIDPipe`、`ParseEnumPipe`、`ParseFloatPipe`、`DefaultValuePipe`、`ValidationPipe` 、`ParseFilePipe`。

自己写一个 `pipe` 也很简单，就是实现 `PipeTransform` 接口的 `transform` 方法，它的返回值就是传给 `handler` 的值。

在 `pipe` 里可以拿到装饰器和 `handler` 参数的各种信息，基于这些来实现校验和转换就是很简单的事情了。

### 如何使用 ValidationPipe 验证 post 请求参数

接收 `post` 请求的方式是声明一个 `dto class`，然后通过 `@Body` 来取请求体来注入值。

对它做验证要使用 `ValidationPipe`。

它的实现原理是基于 `class-tranformer` 把参数对象转换为 `dto class` 的对象，然后通过 `class-validator` 基于装饰器对这个对象做验证。

我们可以自己实现这样的 `pipe`，`pipe` 里可以注入依赖。

如果是全局 `pipe` 想注入依赖，需要通过 `APP_PIPE` 的 `token` 在 `AppModule` 里声明 `provider`。

`class-validator` 支持很多种验证规则，比如邮箱、域名、长度、值的范围等，而且错误消息也可以自定义。




