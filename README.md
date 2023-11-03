## Project setup

### Install Nest CLI globally

```
sudo npm install -g @nest/cli
```

### Create new Nest project

```
nest new {project name}
```

### Generate Module

```
nest g module {module name}
```

### Generate Controller

```
nest g controller {controller name}
```

### Generate Service

```
nest g service {service name}
```

## Body Validation

Body: `@Body()`
Param: `@Param('{param name}')`
Query: `@Query()`

### Install validation packages

```
npm install class-validator class-transformer
```

### Add global validation pipe

```
providers: [
    ...,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
```

### Add validation rules (DTOs)

## Fastify (use express instead)

Link to [docs](https://docs.nestjs.com/techniques/performance)

# Important!

When using fastify, cookies will be in

```
req.headers.cookies
```

and attached user will be in

```
req.raw.currentUser
```

## Mongo Errors

For Catching Mongo Errors, use
```
import { MongoError } from 'mongoose/node_modules/mongodb';
```
