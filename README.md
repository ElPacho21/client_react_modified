### Si queres sabes mas sobre mi:
[Nestor Marsollier](https://github.com/nmarsollier/profile)

# Es un cliente simple para probar la plataforma

Con este cliente se pueden probar los diferentes microservicios [ecommerce](https://github.com/nmarsollier/ecommerce).

## Ejecución

Para poder usarlo es necesario haber ejecutado todos los microservicios a probar.

Abrir ventana de comandos en la carpeta del proyecto y ejecutar :

```bash
npm install
npm start
```

Se abre la app en el puerto 4200

## Configuración del servidor

Se configura con variables de entorno

PORT: Puerto (4200)
AUTH_SERVICE_URL : Url de auth service (http://host.docker.internal:3000/v1/)
IMAGE_SERVICE_URL : Url de image service (http://host.docker.internal:3001/v1/)
CATALOG_SERVICE_URL : Url de catalog service (http://host.docker.internal:3002/v1/)
CART_SERVICE_URL : Url de cart service (http://host.docker.internal:3003/v1/)
ORDER_SERVICE_URL : Url de order service (http://host.docker.internal:3004/v1/)

## Docker

También podemos usar docker en este repositorio, ejecutamos :

```bash
docker build --no-cache -t dev-cli .

# Mac || Windows
docker run -it -d --name dev-cli -p 4200:4200 dev-cli

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name dev-cli -p 4200:4200 dev-cli
```

El contenedor se puede parar usando :

```bash
docker stop dev-cli
```

Se vuelve a levantar usando

```bash
docker start dev-cli
```
