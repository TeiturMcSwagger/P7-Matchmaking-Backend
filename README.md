# Readme
[![Build Status](https://travis-ci.com/TeiturMcSwagger/P7-Matchmaking-Backend.svg?branch=master)](https://travis-ci.com/TeiturMcSwagger/P7-Matchmaking-Backend)
## For running the application
**Build:**

```
npm run build
```

**Start:**

```
npm run start
```


## For running in development
**For development:**

```
npm run dev
```

## Swagger, IoC and Dependency injection
The project is using inversify and tsoa as the main tools to simplify the dependency injection and overall abstracts away the nitty gritty details of routing and implementation details of serving requests. 

We use services to increase the testability of our components (think testing one mega class vs. multiple classes with separation of concerns in mind), and to avoid code duplication.

The fundamental thing behind the approach is decorators:

Decorators are simple annotations attached to components (classes/functions). If we consider asp.net core controllers are required to be called SomethingController, in order for their Inversion of Control (IoC) to correctly serve requests. Express and newer frameworks tend to not offer this directly, and require a setup like express: app.use(route, requestHandler). 

Instead we are decorating our requesthandlers (methods in our controllers) with their routes, and the framework will then generate the express code.
```
npm run build:routes
```

Will produce ./build/routes.ts which is the mapping from our code to something express actually understands.
Tsoa also allows us to abstract away request and response parameters, and instead work with method arguments (body/parameters) and returns (response).

See the existing controllers for usage of the decorators, and how to inject dependencies. 
In order to make new dependencies available for DI, follow the same pattern in /lib/common/inversify.config.ts.

IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT

In order to register a new controller you should export it through /lib/controllers/index.ts 
    - Every controller should be imported once in /lib/common/app.ts.

USE TYPES it makes the code more readable + it comes with nice benefit of actually generating better swagger docs. 

## Errors as responses
Most of the potential errors which might occur are handled automatically. If an error is not caught by the checks, throw an error instead:

```
throw new ApiException({statusCode: 404,
        name: ...,
        message: ...,
        fields: ...})
```
