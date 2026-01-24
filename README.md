# Backend de la "Anti-Social Red" de UNAHUR.

Este Backend fue creado para un trabajo practico final de la materia Estrategias de Persistencias.
El mismo fue realizado para el Frontend de la "Anti-Social Red".

Frontend del proyecto:
🔗 https://github.com/araamaldonado/anti-social-front

## Descripción del proyecto:

Esta API REST fue desarrollada para un trabajo práctico grupal de la materia **Estrategias de Persistencia** de la Universidad Nacional de Hurlingham.
Funciona como Backend de la red social **Anti Social Red**, y fue construida con **Node.js y Express**, siguiendo una arquitectura basada en **rutas, controladores y middlewares**.

Incluye:
- Autenticación mediante **JWT**
- Manejo seguro de contraseñas con **bcrypt**
- Persistencia de datos en **MongoDB dockerizado**, utilizando **Mongoose**
- Sistema de **cache con Redis**
- Validación de datos con **Joi**
- Protección de rutas y manejo centralizado de errores
- Documentación de la API con **Swagger**

## Funcionalidades principales:

La API de la Red Social "Anti-Social Red" ofrece funcionalidades para el registro y autenticación del usuario de forma segura.
El usuario puede ver publicaciones propias, de otros usuarios y comentarlas, acceder a su perfil y consultar las publicaciones que ha creado.

La autenticación se realiza mediante JWT. El control de acceso a determinadas funcionalidades se gestiona desde el Frontend, validando la sesión del usuario antes de permitir acciones sensibles.

## Tecnologías y herramientas:

- Javascript
- Node.js
- Express
- Docker
- JWT
- bcrypt
- MongoDB
- Mongoose
- Redis
- CORS
- Joi
- Swagger

## 🛠️ Instalación y ejecución

1. Clonar el repositorio

```
git clone https://github.com/araamaldonado/antisocial_mongo_back.git
cd "nombre de la carpeta"
```

2. Instalar dependencias 

```
npm i
```

3. Correr el Backend

Levantar MongoDB con Docker y luego ejecutar el Backend.

```
docker-compose up -d
npm run dev
```

## Desarrolladores:

Desarrollado originalmente en equipo junto a: Fausto Romay, Lautaro Farias, Jeremias Markevich, Araceli Carina Maldonado
Backend refactorizado, extendido y mantenido por: Araceli Carina Maldonado
📌 Proyecto en proceso de mejora continua.
