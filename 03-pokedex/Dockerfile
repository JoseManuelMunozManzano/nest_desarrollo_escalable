# Usamos 3 imágenes para realizar todos los pasos de deploy en Docker
# 1. Dependencias
# 2. Build
# 3. Run

# Install dependencies only when needed
# To-do este bloque crea las dependencias (carpeta node_modules) de la aplicación.
# Solo si las dependencias cambian se instalarán las nuevas dependencias. Eso significa que siguientes builds
# serán más rápidas, porque todo está en cache.
# A todo esto lo llamamos deps
FROM node:18-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies
# Esta parte hace el build de la aplicación.
# Es una nueva imagen llamada builder que copiará de la imagen deps la carpeta node_modules,
# luego copia todo lo que está en el mismo directorio que Dockerfile (instrucción COPY . .) y hará el build.
FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


# Production image, copy all the files and run next
# Nueva imagen llamada runner, que es la que va a ejecutar la aplicación.
FROM node:18-alpine3.15 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod
# Del builder copiamos la carpeta dist
COPY --from=builder /app/dist ./dist

# Estos pasos son recomendados, pero no se añaden para que quede lo más sencillo posible.
# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# No hace falta porque lo manejamos desde fuera.
# EXPOSE 3000

CMD [ "node","dist/main" ]
