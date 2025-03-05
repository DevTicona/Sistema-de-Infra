# 📦 Sistema de Inventariado de la UIT

El **Sistema de Inventariado de la UIT**, es una aplicación full-stack desarrollada con **RedwoodJS** que permite la gestión eficiente de activos tecnológicos de la Unidad de Infraestructura Tecnológica. La aplicación se compone de:

- **Frontend**: Desarrollado en **React** y estilizado con **Material UI** para ofrecer una interfaz moderna, intuitiva y responsiva.
- **Backend**: Implementado con **GraphQL** para la comunicación entre cliente y servidor, y **Prisma ORM** para la gestión de la base de datos PostgreSQL.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado y configurado lo siguiente:

- **Node.js** (versión 20.x)
- **Yarn** (version 4.x)
- **PostgreSQL**: Debes tenerlo instalado y configurado en tu entorno.
- **Git**: Para clonar el repositorio.

---

## 🔹 Instalación y Configuración

### 1. Clonar el Repositorio

Clona el repositorio en tu máquina local usando Git:

git clone https://github.com/DevTicona/Sistema-de-Infra.git

### 2. Instalar Dependencias
Accede al directorio del proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias:
```bash
yarn install
```
### 3. Configurar Variables de Entorno
Crea un archivo .env en la raíz del proyecto para configurar la conexión a la base de datos y otras variables de entorno. Por ejemplo:

```bash
DATABASE_URL="postgresql://usuario:tu_contraseña@localhost:5432/base_de_datos?schema=public"
SESSION_SECRET=2dJGLTrXkwh4wgaeW65oNwvlnCJNkaOJj5Kk4jPUJDU=
```

DATABASE_URL: Ajusta la URL de conexión según la configuración de tu servidor PostgreSQL

SESSION_SECRET: Clave secreta utilizada para gestionar sesiones de forma segura.

Debes generar una nueva clave con el siguiente comando:

```bash
openssl rand -base64 32
```

### 4. Base de Datos y Prisma

Modelo ER de la Base de Datos 

<img src="https://github.com/user-attachments/assets/921e6f0a-74d0-40a1-9f7e-58878faf4965" width="1000">


El sistema utiliza PostgreSQL como sistema de gestión de bases de datos y Prisma ORM para interactuar con ella. El modelo principal se encuentra definido en api/db/schema.prisma.

Ejecuta la migración para conectar con la base de datos:
```bash
yarn rw prisma migrate dev
```
Este comando creará y aplicará las migraciones necesarias para mantener la integridad del esquema de la base de datos.

Luego, genera el cliente de Prisma:
```bash
yarn prisma generate
```
### 5. Iniciar el Servidor de Desarrollo
Con las dependencias instaladas y el archivo .env configurado, inicia el entorno de desarrollo:
```bash
yarn redwood dev
```
El sistema estará disponible en http://localhost:8910

## Estructura del Proyecto
```bash
├── api
│   ├── db
│   │   └── schema.prisma    # Modelos de base de datos
│   └── src
│       ├── graphql          # Esquema GraphQL
│       └── services         # Lógica de negocio
│
├── web
│   ├── public               # Assets estáticos
│   └── src
│       ├── components       # Componentes React
│       ├── layouts          # Diseños principales
│       └── pages            # Vistas principales
│
└── scripts                  # Utilidades
│       
│
└── .env                     # Configuración de conexion a la base de datos
```
