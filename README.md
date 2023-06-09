# NEST: DESARROLLO BACKEND ESCALABLE CON NODE

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

Del curso Udemy https://www.udemy.com/course/nest-framework/

### 01-TypeScript-intro

Proyecto creado con:

```
yarn create vite
```

Para descargar las dependencias informar:

```
yarn
```

Para levantar la aplicación:

```
yarn dev
```

- Tipos básicos
- Interfaces
- Implementaciones
- Clases
- Patrón adaptador
- Principio de sustitución de Liskov
- Inyección de dependencias
- Getters
- Métodos asíncronos
- Decoradores de clases y métodos

### 02-car-dealership

Proyecto creado con:

```
nest new 02-car-dealership
```

Para levantar el proyecto:

```
yarn start:dev
```

Y para probarlo en Postman coger el fuente: Pruebas Postman.json

Se ha visto:

- Core Nest building blocks
- Módulos
- Controladores (Post, Patch, Get, Delete)
- Primeros decoradores
- Servicios
- Inyección de dependencias
- Pipes
- Exception Filters
- DTO (Data Transfer Object)
- Patch, Post, Delete
- Validaciones automáticas
- Class Validator
- Class Transformer
- Seguir el principio DRY (Don't repeat yourself)
- Algunos decoradores del Class Validator útiles
- Entities
- Comunicar módulo seed, con los otros módulos de nuestra aplicación
- Problemas con inyección de dependencias de módulos externos

Generar build de producción muy básico:

```
yarn build
yarn start:prod
```

### 03-pokedex

Proyecto creado con:

```
nest new 03-pokedex
```

Se sirve un contenido estático anecdótico, para aprender como se hace en la ruta:

```
http://localhost:3000
```

Se ha visto:

- Servir contenido estático
- Global Prefix para los endpoints
- CRUD contra base de datos
- Docker y Docker Compose
- Conectar contenedor con filesystem (para mantener la data de la base de datos)
- Schemas
- Modelos
- Custom Pipes
- DTOs y sus extensiones
- Respaldar a Github
- Uso de modelos en diferentes módulos
- SEED para llenar la base de datos
- Paginación de resultados
- DTOs para Query parameters
- Transformaciones de DTOs
- Dockerizacion
- Mongo Atlas
- Env file
- joi
- Validation Schemas
- Configuration Module
- Recomendaciones para un Readme útil
- Despliegues
- Dockerfile

Para probarlo en Postman coger el fuente: Pruebas Postman.json

Para ejecutar en desarrollo:

1. Clonar el repositorio
2. Ejecutar

```
yarn install
```

3. Tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de datos

```
docker-compose up -d
```

5. Clonar el archivo `.env.template` y renombrar la copia a `.env`

6. Llenar las variables de entorno definidas en el `.env`

7. Ejecutar la aplicación en dev:

```
yarn start:dev
```

8. Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/v2/seed
```

## Stack usado

- MongoDB
- Nest

# Build de Producción

1. Crear el archivo `.env.prod`
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# Notas

Heroku redeploy sin cambios:

```
git commit --allow-empty -m "Trigger Heroku deploy"
git push heroku <master|main>
```

### 04-teslo-shop

Proyecto creado con:

```
nest new 04-teslo-shop
```

Se ha visto:

- TypeORM
- Postgres
- CRUD
- Constrains
- Validaciones
- Búsquedas
- Paginaciones
- DTOs
- Entities
- Decoradores de TypeORM para entidades
- Métodos BeforeInsert, BeforeUpdate
- Relaciones
  - De uno a muchos
  - Muchos a uno
- Query Runner
- Query Builder
- Transacciones
- Commits y Rollbacks
- Renombrar tablas
- Creación de un SEED
- Aplanar resultados
- Carga de archivos a nuestro backend
- Autenticación
- Autorización
- Json Web Tokens
- Hash de contraseñas
- Nest Passport
- Módulos asíncronos
- Protección de rutas
- Custom Method Decorators
- Custom Class Decorators
- Custom Property Decorators
- Enlazar usuarios con productos
- Bearer Tokens
- Postman documentation
- Nest Swagger
- Nest Gateways
- Conexiones
- Desconexiones
- Emitir y escuchar mensajes desde el servidor y cliente
- Cliente con Vite y TS
- Autenticar conexión mediante JWTs
- Usar mismos mecanismos de autenticación previamente creado
- Desconectar sockets manualmente
- Prevenir doble conexión de usuarios autenticados

### 05-ws-client

Es la parte cliente de teslo-shop para el WebSocket que tenemos implementado.
Hecho en Vanilla JavaScript con TypeScript.

Proyecto creado con:

```
yarn create vite
```

Luego accedemos a la carpeta e instalamos las dependencias de vite:

```
yarn
```

Para ejecutar:

```
yarn dev
```

Para que funcione esta parte, el proyecto 04-teslo-shop debe estar ejecutándose. Ver sus instrucciones.
