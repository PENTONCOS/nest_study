# nest_study学习笔记

# nest
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

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24060e0f32204907887ede38c1aa018c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

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

### ParseFilePipe 实现文件校验

它内置了 `MaxFileSizeValidator`、`FileTypeValidator`，你也可以实现自己的 `FileValidator`。

## 16. 使用 multer 实现文件上传

### Express 如何使用 multer 实现文件上传

`express` 的 `multer` 包是用来处理 `multipart/form-data` 格式的文件上传请求的。

通过 `single` 方法处理单个字段的单个文件，`array` 方法处理单个字段的多个文件，`fields` 方法处理多个字段的文件，any 处理任意数量字段的文件，分别用 `req.file` 和 `req.files` 来取解析出的文件。

其余非文件字段不会处理，还是通过 `req.body` 来取。

类似文件数量过多等错误，会抛出对应的 `error` 对象，在错误处理中间件里处理并返回对应的响应就好了。

Nest 的文件上传就是通过 `multer` 包实现的。

### Nest 如何使用 multer 实现文件上传

Nest 的文件上传也是基于 `multer` 实现的，它对 `multer api` 封装了一层，提供了 `FileInterceptor`、`FilesInterceptor`、`FileFieldsInterceptor`、`AnyFilesInterceptor` 的拦截器，分别用到了 `multer` 包的 `single`、`array`、`fields`、`any` 方法。

它们把文件解析出来，放到 `request` 的某个属性上，然后再用 `@UploadedFile`、`@UploadedFiles` 的装饰器取出来传入 `handler`。

并且这个过程还可以使用 `ParseFilePipe` 来做文件的验证，它内置了 `MaxFileSizeValidator`、`FileTypeValidator`，你也可以实现自己的 `FileValidator`。

## 17. 日志打印

日志打印可以用 Nest 的 `Logger`，它支持在创建应用的时候指定 `logger` 是否开启，打印的日志级别，还可以`自定义 logger`。

`自定义 Logger` 需要实现 `LoggerService` 接口，或者继承 `ConsoleLogger` 然后重写部分方法。

如果想在 `Logger` 注入一些 `provider`，就需要创建应用时设置 `bufferLogs` 为 `true`，然后用 `app.useLogger(app.get(xxxLogger))` 来指定` Logger`。

你可以把这个`自定义 Logger` 封装到**全局模块**，或者**动态模块**里。

## 18. TypeORM

### 入门

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df762fa8ccb948f6ae3ca66a92640975~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

`DataSource` 里管理着数据库连接配置，数据库驱动包，调用它的 `intialize` 方法会创建和 `mysql` 的连接。

连接创建的时候，如果指定了 `synchronize`，会根据 `Entitiy` 生成建表 `sql`。

`Entity` 里通过 `@Entity` 指定和数据库表的映射，通过 `@PrimaryGeneratedColumn` 和 `@Column `指定和表的字段的映射。

对 `Entity` 做增删改查通过 `EntityManager` 的 `save`、`delete`、`find`、`createQueryBuilder` 等方法。

如果只是对单个 `Entity` 做 `CRUD`，那可以先 `getRepository` 拿到对具体 `Entity` 操作的工具类，再调用 `save`、`delete`、`find` 等方法。

具体的 `EntityManager` 和 `Repository` 的方法有这些：

- `save`：新增或者修改 Entity，如果传入了 id 会先 select 再决定修改还新增
- `update`：直接修改 Entity，不会先 select
- `insert`：直接插入 Entity
- `delete`：删除 Entity
- `find`：查找多条记录，可以指定 where、order by 等条件
- `findBy`：查找多条记录，第二个参数直接指定 where 条件，更简便一点
- `findAndCount`：查找多条记录，并返回总数量
- `findByAndCount`：根据条件查找多条记录，并返回总数量
- `findOne`：查找单条记录，可以指定 where、order by 等条件
- `findOneBy`：查找单条记录，第二个参数直接指定 where 条件，更简便一点
- `findOneOrFail`：查找失败会抛 EntityNotFoundError 的异常
- `query`：直接执行 sql 语句
- `createQueryBuilder`：创建复杂 sql 语句，比如 join 多个 Entity 的查询
- `transaction`：包裹一层事务的 sql
- `getRepository`：拿到对单个 Entity 操作的类，方法同 EntityManager

### TypeORM 一对一的映射和关联CRUD

`TypeORM` 里一对一关系的映射通过 `@OneToOne` 装饰器来声明，维持外键列的 `Entity` 添加 `@JoinColumn` 装饰器。

如果是非外键列的 `Entity`，想要关联查询另一个 `Entity`，则需要通过第二个参数指定外键列是另一个 `Entity` 的哪个属性。

可以通过 `@OneToOne` 装饰器的 `onDelete`、`onUpdate `参数设置级联删除和更新的方式，比如 `CASCADE`、`SET NULL` 等。

还可以设置 `cascade`，也就是 `save` 的时候会自动级联相关 `Entity` 的 `save`。

增删改分别通过 `save` 和 `delete` 方法，查询可以通过 `find` 也可以通过 `queryBuilder`，不过要 `find` 的时候要指定 `relations` 才会关联查询。

### TypeORM 一对多的映射和关联CRUD

通过 `@ManyToOne` 或者 `@OneToMany` 装饰器在申明一对多关系的映射。

`TypeORM` 会自动在多的那一方添加外键，不需要通过 `@JoinColumn` 指定，不过你可以通过 `@JoinColumn` 来修改外键列的名字。

双方只能有一方 `cascade`，不然会无限循环。设置了 `cascade` 之后，只要一方保存，关联的另一方就会自动保存。

删除的话，如果设置了外键的 `onDelete` 为 `CASCADE` 或者 `SET NULL`，那只删除主表（一的那一方）对应的 `Entity` 就好了，`mysql` 会做后续的关联删除或者 `id` 置空。

否则就要先删除所有的从表（多的那一方）对应的 `Entity` 再删除主表对应的 `Entity`。

### TypeORM 多对多的映射和关联CRUD

是通过 `@ManyToMany` 和 `@JoinTable` 来声明多对多关系的映射。

但如果双方都保留了对方的引用，需要第二个参数来指定关联的外键列在哪，也就是如何查找当前 `entity`。

多对多关系的修改只要查出来之后修改下属性，然后 `save`，`TypeORM` 会自动去更新中间表。

### 在 Nest 里集成 TypeORM

使用方式是在根模块 `TypeOrmModule.forRoot` 传入数据源配置。

然后就可以在各处注入 `DataSource`、`EntityManager` 来做增删改查了。

如果想用 `Repository` 来简化操作，还可以在用到的模块引入 `TypeOrmModule.forFeature` 的动态模块，传入 `Entity`，会返回对应的 `Repository`。这样就可以在模块内注入该 `Repository` 来用了。

它的原理是 `TypeOrmModule.forRoot` 对应的动态模块是全局的，导出了 `dataSource`、`entityManager`，所以才可以到处注入。

而 `TypeOrmModule.forFeature` 则会根据把传入 `Entity` 对应的 `Repository` 导出，这样就可以在模块内注入了。



## 19. 两种登录状态保存方式：JWT 和 Session

`http` 是无状态的，也就是请求和请求之间没有关联，但我们很多功能的实现是需要保存状态的。

给 `http` 添加状态有两种方式：

1. `session + cookie`：把状态数据保存到服务端，`session id` 放到 `cookie` 里返回，这样每次请求会带上 `cookie` ，通过 `id` 来查找到对应的 `session`。这种方案有 `CSRF`、`分布式 session`、`跨域`的问题。

2. `jwt`：把状态保存在 `json` 格式的 `token` 里，放到 `header` 中，需要手动带上，没有 `cookie + session` 的那些问题，但是也有安全性、性能、没法手动控制失效的问题。

常用的方案基本是 `session + redis`、`jwt + redis` 这种。

## 20. Nest 里实现 JWT 和 Session

`session` 使用的是 `express` 的 `express-session` 中间件，通过 `@Session` 装饰器取出来传入 `controller` 里。

`jwt` 需要引入 `@nestjs/jwt` 包的 `JwtModule`，注入其中的 `JwtService`，然后通过 `jwtService.sign` 生成 `token`，通过 `jwtService.verify` 验证 `token`。

`token` 放在 `authorization` 的 `header` 里。

## 21. MySQL + TypeORM + JWT 实现登录注册

详见：[login-and-register](https://github.com/PENTONCOS/login-and-register/tree/main)

## 22. 基于 ACL 实现的权限控制

有的接口除了需要登录外，还需要权限。

只有登录用户有调用该接口的权限才能正常访问。

这节我们通过 `ACL （Access Control List）`的方式实现了权限控制，它的特点是用户直接和权限关联。

用户和权限是多对多关系，在数据库中会存在用户表、权限表、用户权限中间表。

登录的时候，把用户信息查出来，放到 `session` 或者 `jwt` 返回。

然后访问接口的时候，在 `Guard` 里判断是否登录，是否有权限，没有就返回 401，有的话才会继续处理请求。

我们采用的是访问接口的时候查询权限的方案，通过 `handler` 上用 `SetMetadata` 声明的所需权限的信息，和从数据库中查出来的当前用户的权限做对比，有相应权限才会放行。

但是这种方案查询数据库太频繁，需要用 `redis` 来做缓存。

当然，你选择登录的时候把权限一并查出来放到 `session` 或者 `jwt` 里也是可以的。

## 23. 如何动态读取不同环境的配置

基于 `dotenv`、`js-yaml` 可以读取 `.env` 和 `yaml` 的配置文件。

我们可以通过 `NODE_ENVIRONMENT` 来切换不同路径的配置文件，实现开发、生产环境的配置切换。

`Nest` 提供了 `@nestjs/config` 包来封装，使用 `ConfigModule.forRoot` 可以读取 `.env` 配置文件，然后注入 `ConfigService` 来取配置。

还可以通过 `ConfigModule.forFeature` 来注册局部配置。

它的原理也很简单，就是通过 `useFactory` 动态产生 `provider`，然后在 `forRoot`、`forFeature` 里动态返回模块定义。

## 24. 基于 RBAC 实现权限控制

`RBAC（role based access control）` 权限控制，它相比于 `ACL （access control list）`的方式，多了一层角色，给用户分配角色而不是直接分配权限。

当然，检查权限的时候还是要把角色的权限合并之后再检查是否有需要的权限的。

通过 `jwt` 实现了登录，把用户和角色信息放到 `token` 里返回。

添加了 `LoginGuard` 来做登录状态的检查。

然后添加了 `PermissionGuard` 来做权限的检查。

`LoginGuard` 里从 `jwt` 取出 `user` 信息放入 `request`，`PermissionGuard` 从数据库取出角色对应的权限，检查目标 `handler` 和 `controller` 上声明的所需权限是否满足。

`LoginGuard` 和 `PermissionGuard` 需要注入一些 `provider`，所以通过在 `AppModule` 里声明 `APP_GUARD` 为 token 的 `provider` 来注册的全局 `Gard`。

然后在 `controller` 和 `handler` 上添加 `metadata` 来声明是否需要登录，需要什么权限，之后在 `Guard` 里取出来做检查。

这种方案查询数据库也比较频繁，也应该加一层 `redis` 来做缓存。

这就是基于 `RBAC` 的权限控制，是用的最多的一种权限控制方案。

当然，这是 `RBAC0` 的方案，更复杂一点的权限模型，可能会用 `RBAC1`、`RBAC2` 等，那个就是多角色继承、用户组、角色之间互斥之类的概念，会了 `RBAC0`，那些也就是做一些变形的事情。

绝大多数系统，用 `RBAC0` 就足够了。


# Docker

## 1. Dockerfile

```dockerfile
FROM node:latest

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com

RUN npm install -g http-server

EXPOSE 8080

CMD ["http-server", "-p", "8080"]
```

这些指令的含义如下：

- FROM：基于一个基础镜像来修改
- WORKDIR：指定当前工作目录
- COPY：把容器外的内容复制到容器内
- EXPOSE：声明当前容器要访问的网络端口，比如这里起服务会用到 8080
- RUN：在容器内执行命令
- CMD：容器启动的时候执行的命令

我们先通过 `FROM` 继承了 node 基础镜像，里面就有 npm、node 这些命令了。

通过 `WORKDIR` 指定当前目录。

然后通过 `COPY` 把 Dockerfile 同级目录下的内容复制到容器内，这里的 . 也就是 /app 目录

之后通过 `RUN` 执行 npm install，全局安装 http-server

通过 `EXPOSE` 指定要暴露的端口

`CMD` 指定容器跑起来之后执行的命令，这里就是执行 http-server 把服务跑起来。

### Nest 项目如何编写 Dockerfile

`docker build` 的时候会把构建上下文的所有文件打包发送给 `docker daemon` 来构建镜像。

可以通过 `.dockerignore` 指定哪些文件不发送，这样能加快构建时间，减小镜像体积。

此外，`多阶段构建`也能减小镜像体积，也就是 `build` 一个镜像、`production` 一个镜像，最终保留下 `production` 的镜像。

## 2. Docker 的实现

Docker 的实现原理依赖 linux 的 `Namespace`、`Control Group`、`UnionFS` 这三种机制。

- `Namespace`：做资源隔离。
- `Control Group`：做容器的资源限制。
- `UnionFS`：做文件系统的镜像存储、镜像合并。

我们通过 `dockerfile` 描述镜像构建的过程，每一条指令都是一个镜像层。

镜像通过 `docker run` 就可以跑起来，对外提供服务，这时会添加一个`可写层（容器层）`。

挂载一个 `volume` 数据卷到 `Docker` 容器，就可以实现数据的持久化。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aecb63016ab45c0bc2603071b65a420~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

## 3. Docker 的技巧
- 使用 alpine 的镜像，而不是默认的 linux 镜像，可以极大减小镜像体积，比如 node:18-alpine3.14 这种
- 使用多阶段构建，比如一个阶段来执行 build，一个阶段把文件复制过去，跑起服务来，最后只保留最后一个阶段的镜像。这样使镜像内只保留运行需要的文件以及 dependencies。
- 使用 ARG 增加构建灵活性，ARG 可以在 docker build 时通过 --build-arg xxx=yyy 传入，在 dockerfile 中生效，可以使构建过程更灵活。如果是想定义运行时可以访问的变量，可以通过 ENV 定义环境变量，值使用 ARG 传入。
- CMD 和 ENTRYPOINT 都可以指定容器跑起来之后运行的命令，CMD 可以被覆盖，而 ENTRYPOINT 不可以，两者结合使用可以实现参数默认值的功能。
- ADD 和 COPY 都可以复制文件到容器内，但是 ADD 处理 tar.gz 的时候，还会做一下解压。

## 4. 为什么还需要 pm2 来跑 node 应用

`pm2` 是一个进程管理工具，用于在生产环境中管理和监控 `Node.js` 应用程序。它可以帮助你启动、停止、重启和监视多个 `Node.js` 进程，并提供了日志记录、负载均衡、故障自动恢复等功能。`pm2` 可以确保应用程序的高可用性和稳定性，并方便地进行日志管理和监控。

一些常见的 `pm2` 命令包括：

- `pm2 start app.js` - 启动应用程序
- `pm2 stop app.js` - 停止应用程序
- `pm2 restart app.js` - 重启应用程序
- `pm2 list` - 显示当前运行的所有应用程序
- `pm2 logs` - 显示应用程序的日志

服务器上的 `node` 应用需要用 `pm2` 的**日志管理**、**进程管理**、**负载均衡**、**性能监控**等功能。

分别对应 **pm2 logs**、**pm2 start/restart/stop/delete**、**pm2 start -i**、**pm2 monit** 等命令。

多个应用或者想把启动选项保存下来的时候，可以通过 `ecosystem.config.js` 配置文件，批量启动一系列应用。

把 `docker` 和 `pm2` 结合起来，在进程崩溃的时候让 `pm2` 来自动重启。

只要写 `dockerfile` 的时候多安装一个 `pm2` 的依赖，然后把 `node` 换成 `p2-runtime` 就好了。

不管是出于稳定性、性能还是可观测性等目的，`pm2` 都是必不可少的。

### Docker 支持重启策略，是否还需要 PM2？

`Docker` 是支持自动重启的，可以在 `docker run` 的时候通过 `--restart` 指定重启策略，或者 `Docker Compose` 配置文件里配置 `restart`。

有 `4` 种重启策略：

- `no`: 容器退出不自动重启（默认值）
- `always`：容器退出总是自动重启，除非 `docker stop`。
- `on-failure`：容器非正常退出才自动重启，还可以指定重启次数，如 `on-failure:5`
- `unless-stopped`：容器退出总是自动重启，除非 `docker stop`
  
重启策略为 `always` 的容器在 `Docker Deamon` 重启的时候容器也会重启，而 `unless-stopped` 的不会。

其实我们用 `PM2` 也是主要用它进程崩溃的时候重启的功能，而在有了 `Docker` 之后，用它的必要性就不大了。

当然，进程重启的速度肯定是比容器重启的速度快一些的，如果只是 `Docker` 部署，可以结合 `pm2-runtime` 来做进程的重启。

绝大多数情况下，直接用 `Docker` 跑 `node` 脚本就行，不需要 `PM2`。

## 5. 为什么要使用 Docker Compose

`docker-compose` 是一个用于定义和运行多个容器化应用程序的工具。它使用 `YAML` 文件来定义应用程序的配置，包括服务、网络、存储卷等。通过 `docker-compose`，可以轻松地将多个相关的容器组合在一起，并实现它们之间的通信和协作。

使用 `docker-compose` 可以更方便地管理复杂的应用程序栈，而不必手动管理每个容器。它可以自动创建、启动、停止和删除容器，并提供了一致的环境配置和依赖管理。

一些常见的 `docker-compose` 命令包括：

- `docker-compose up` - 启动应用程序
- `docker-compose down` - 停止应用程序并删除容器
- `docker-compose restart` - 重启应用程序
- `docker-compose ps` - 显示当前运行的所有容器
- `docker-compose logs` - 显示应用程序的日志

通过 `docker`、`docker-compose` 两种方式来部署了 `nest` 项目。

`docker` 的方式需要手动 `docker build` 来构建 `nest` 应用的镜像。

然后按顺序使用 `docker run` 来跑 `mysql`、`redis`、`nest` 容器。

（要注意 `nest` 容器里需要使用宿主机 `ip` 来访问 `mysql`、`redis` 服务）

而 `docker compose` 就只需要写一个 `docker-compose.yml` 文件，配置多个 `service` 的启动方式和 `depends_on` 依赖顺序。

然后 `docker-compose up` 就可以批量按顺序启动一批容器。

基本上，我们跑 `Nest` 项目都会依赖别的服务，所以在单台机器跑的时候都是需要用 `Docker Compose` 的。

## 6. Docker 容器通信的最简单方式：桥接网络

一般把 `mysql`、`redis` 的端口映射到宿主机，然后 `nest` 的容器里通过宿主机 `ip` 访问这两个服务的。

但其实有更方便的方式，就是桥接网络。

通过 `docker network create` 创建一个桥接网络，然后 `docker run` 的时候指定 `--network`，这样 3 个容器就可以通过容器名互相访问了。

在 `docker-compose.yml` 配置下 `networks` 创建桥接网络，然后添加到不同的 `service` 上即可。

或者不配置 `networkds`，`docker-compose` 会生成一个默认的。

实现原理就是对 `Network Namespace` 的处理，本来是 `3` 个独立的 `Namespace`，当指定了 `network` 桥接网络，就可以在 `Namespace` 下访问别的 `Namespace` 了。

多个容器之间的通信方式，用桥接网络是最简便的。




# MySQL

## 1. 快速入门 MySQL

mysql 分为 `server` 和 `client`，我们通过 docker 跑了一个 `mysql server`，指定了端口、数据卷，并通过 `MYSQL_ROOT_PASSWORD` 环境变量指定了 `root` 的密码。

然后下载了 `mysql workbench` 这个官方的 `GUI 客户端`。

可视化创建了一个 `database` 或者叫 `schema`。

之后创建了一个表，指定了主键和其他列的约束、默认值等。

之后学习了增删改查数据的可视化操作和对应的 `INSERT`、`DELETE`、`UPDATE`、`SELECT` 的 `sql` 语句。

还有 `CREATE TABLE`、`TRUNCATE TABLE`、`DROP TABLE` 等语句，这些修改结构的 `sql` 叫做 `DDL`。

增删改数据的 `sql` 叫做 `DML`，而查询数据的 `sql` 叫做 `DQL`。

## 2. SQL 查询语句的所有语法和函数

- where：查询条件，比如 where id=1
- as：别名，比如 select xxx as 'yyy'
- and: 连接多个条件
- in/not in：集合查找，比如 where a in (1,2)
- between and：区间查找，比如 where a between 1 and 10
- limit：分页，比如 limit 0,5
- order by：排序，可以指定先根据什么升序、如果相等再根据什么降序，比如 order by a desc,b asc
- group by：分组，比如 group by aaa
- having：分组之后再过滤，比如 group by aaa having xxx > 5
- distinct：去重

sql 还可以用很多内置函数：

- 聚合函数：avg、count、sum、min、max
- 字符串函数：concat、substr、length、upper、lower
- 数值函数：round、ceil、floor、abs、mod
- 日期函数：year、month、day、date、time
- 条件函数：if、case
- 系统函数：version、datebase、user
- 类型转换函数：convert、cast、date_format、str_to_date
- 其他函数：nullif、coalesce、greatest、least

## 3. 一对一，join查询，联级方式

从表里通过外键来关联主表的主键。

查询的时候需要使用 `join on`，默认是 `inner join` 也就是只返回有关联的记录，也可以用 `left join`、`right join` 来额外返回没有关联记录的左表或右表的记录。

`from` 后的是左表，`join` 后的是右表。

此外，外键还可以设置级联方式，也就是主表修改 `id` 或者删除的时候，从表怎么做。

有 `3` 种级联方式：
- `CASCADE`（关联删除或更新）
- `SET NULL`（关联外键设置为 null）
- `RESTRICT` 或者 `NO ACTION`（没有从表的关联记录才可以删除或更新）

## 4. 一对多、多对多关系的表设计

我们创建了部门、员工表，并在员工表添加了引用部门 `id` 的外键 `department_id` 来保存这种一堆多关系。

并且设置了级联方式为 `set null`。

创建了文章表、标签表、文章标签表来保存多堆多关系，多对多不需要在双方保存彼此的外键，只要在中间表里维护这种关系即可。

中间表的外键级联方式一定为 `CASCADE`，因为数据没了关系就没必要还留着了。

此外，多对多的 `join` 需要连接 `3` 个表来查询。

## 5. 子查询和EXISTS

`sql` 和 `sql` 可以组合来完成更复杂的功能，这种语法叫做`子查询`。

它还有个特有的关键字 `EXISTS`（和 `NOT EXISTS`），当子查询有返回结果的时候成立，没有返回结果的时候不成立。

子查询不止 `select` 可用，在 `update`、`insert`、`delete `里也可以用。

## 6. 事务和隔离级别

事务内的几条 `sql` 要么全部成功，要么全部不成功，这样能保证数据的一致性。

它的使用方式是 `START` `TRANSACTION`; `COMMIT`; 或者 `ROLLBACK`;

还可以设置 `SAVEPOINT`，然后 `ROLLBACK TO SAVEPOINT`;

事务还没提交的数据，别的事务能不能读取到，这就涉及到隔离级别的概念了。

一般就用默认的隔离级别就行，也就是 `REPEATABLE READ`。

## 7. MySQL 里的视图、存储过程和函数

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97557d444a2446769c21b93976c58121~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

`视图`就是把查询结果保存下来，可以对这个`视图`做查询，简化了查询语句并且也能隐藏一些字段。它增删改的限制比较多，一般只是来做查询。

`存储`过程就是把一段 sql 封装起来，传参数调用。

`函数`也是把一段 sql 或者其他逻辑封装起来，传参数调用，但是它还有返回值。

一般不建议在正式环境使用视图，存储过程和函数；使用数据库来解决问题，就有可能把业务逻辑写到了数据库层，后续维护及其麻烦；

## 8. Node 里操作 MySQL 的两种方式

一种是直接用 `mysql2` 连接数据库，发送 `sql` 来执行。

一种是用 `ORM` 库，比如 `typeorm`，它是基于 `class` 和 `class` 上的装饰器来声明和表的映射关系的，然后对表的增删改查就变成了对象的操作以及 `save`、`find` 等方法的调用。它会自动生成对应的 `sql`。

主流的方案还是 `ORM` 的方案。

# Redis

## 1. 快速入门

因为 `mysql` 存在硬盘，并且会执行 `sql` 的解析，会成为系统的性能瓶颈，所以我们要做一些优化。

常见的就是在内存中缓存数据，使用 `redis` 这种内存数据库。

它是 `key`、`value` 的格式存储的，`value` 有很多种类型，比如 `string`、`list`、`set`、`sorted` `set(zset)`、`hash`、`geo` 等。

灵活运用这些数据结构，可以完成各种需求，比如排行榜用 `zset`、阅读数点赞数用 `string`、附近的人用 `geo` 等。

而且这些 `key` 都可以设置过期时间，可以完成一些时效性相关的业务。

用官方 GUI 工具 `RedisInsight` 可以可视化的操作它，很方便。

`redis` 几乎和 `mysql` 一样是后端系统的必用中间件了，它除了用来做数据库的缓存外，还可以直接作为数据存储的地方。

## 2. 在 Nest 里操作 Redis

通过 `redis` 的 `npm` 包（`redis`、`ioredis` 等）可以连接 `redis server` 并执行命令。

如果在 `nest` 里，可以通过 `useFactory` 动态创建一个 `provider`，在里面使用 `redis` 的 `npm` 包创建连接。