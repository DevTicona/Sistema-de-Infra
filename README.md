# 📦 Sistema de Inventariado de la UIT  

Bienvenido al **Sistema de Inventariado de la UIT**, una aplicación desarrollada con **RedwoodJS** para la gestión eficiente de activos tecnológicos dentro de la Unidad de Infraestructura Tecnológica.  

> **Requisitos previos**  
>  
> - Node.js (=20.x) y [Yarn](https://yarnpkg.com/)  
> - PostgreSQL instalado y configurado  
> - Git instalado  

## 🔹 Instalación  

Primero, instala las dependencias:  

yarn install

yaml
Copiar
Editar

Luego, inicia el servidor de desarrollo:  

yarn redwood dev

El sistema estará disponible en [http://localhost:8910](http://localhost:8910).  

> **CLI de RedwoodJS**  
>  
> Redwood proporciona una CLI potente que te ayudará durante todo el desarrollo. Para ver todos los comandos disponibles, usa:  
>  
> ```
> yarn redwood --help
> ```
>  
> Para más detalles, consulta la [documentación de la CLI](https://redwoodjs.com/docs/cli-commands).  

---

## 🗄 Base de Datos y Prisma  

El sistema utiliza **PostgreSQL** como base de datos y **Prisma ORM** para su gestión. A continuación, revisa el modelo principal del esquema:  

```prisma
model Activo {
  id          Int      @id @default(autoincrement())
  nombre      String
  descripcion String
  categoria   String
  fechaIngreso DateTime @default(now())
}
Ejecuta la migración de la base de datos:
yarn rw prisma migrate dev
