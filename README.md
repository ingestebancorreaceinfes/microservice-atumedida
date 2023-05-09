<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


  
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descripción

Módulo de login basado en nestjs.  Se realiza login con google y microsoft

## Requerimientos de software previos
- Si es la primera vez que se instala un sistema en base a nodejs se deben realizar las siguientes instalaciones
 -  Instalar nodejs a través del gestor de paquetes. 
 Referencia https://github.com/nodesource/distributions
 - Instalar siempre LTS latest
 ```bash
$ curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
$ sudo apt-get update
$ sudo apt-get install -y nodejs
```
 - Instalar el gestor de paquetes de nodejs npm
```bash
$ sudo apt-get install -y nodejs
# Si se muestra un mensaje que el npm está desactualizado digitar el siguiente comando
$ sudo npm install -g npm@9.6.2
```
 - Instalar el paquete pm2 de manera global en el sistema (gestor de procesos de producción)
 ```bash
$ sudo npm install pm2@latest -g
```
# Instalación
- Situarse en la carpeta cd /var/www, si no existe la carpeta www crearla dentro de la carpeta var  - $sudo mkdir www
```bash
$ cd /var
```
- Otorgar permisos de usuario
```bash
$ sudo chmod -R o+rw www
```
- Clonar la rama deploy del proyecto
```bash
$ git clone https://devceinfes@dev.azure.com/devceinfes/atumedida-backend/_git/atumedida-backend
```
- Dar permisos a la carpeta general
```bash
$ sudo chmod -R o+rw atumedida-backend
```
- Entrar a la carpeta authentication-microservice
```bash
$ cd atumedida-backend
```
- Instalar las dependencias
```bash
$ npm run install
```
- Si se visualizan vulnerabilidades digitar la siguiente línea
```bash
$ npm audit fix
```
- Hacer el build del proyecto
```bash
$ npm run build
```
- Crear un archivo .env en la carpeta raíz del proyecto y luego copier el siguiente contenido.  Se deben reemplazar los **** por los valores correspondientes
```bash
	DB_PASSWORD= *******
	DB_NAME= *********
	DB_HOST= ********
	DB_PORT= *********
	DB_USERNAME= **********
  DB_TLS_SSL = **** #true o false de acuerdo si la base de datos se configura mediante ssl asignar a esta variable a true



	PORT=80 o 443 #Se puede seleccionar cualquier puerto tcp para web por ejemplo 8080 80 3001 El puerto 80 y 443 se ejecuta con sudo ejecutando el pm2

	JWT_SECRET= *****************
	
	#A continuación se especifica la ruta de los certificados en caso de hacer uso del puerto 443 
	
	CERT = ********#ruta donde se localiza el certificado
	KEY =********* #ruta donde se localiza la llave la llave pública 
```
- tanto CLIENT_ID y CLIENT_SECRET son dos datos que se obtienen de configurar una aplicación en google para estos fines.
- JWT_SECRET es una variable secreta y única que solo podrá saber el personal de infraestructura y devops. Esta se compone de 63 carácteres puede tener carácteres especiales.
En esta página se puede generar este reandom https://pinetools.com/random-string-generator


# Ejecución de la aplicación
- Para ejectuar el backend se debe digitar lo siguiente (se debe estar siguado en la carpeta raíz del proyecto /var/www/authentication-microservice)
```bash
$ sudo pm2 start dist/main.js --name atumedida-backend  # enlazaabackend es un identificador de aplicación
```
Nota: si ya se ha lanzado el proyecto con anterioridad se pude digitar este comando 
```bash
$ sudo pm2 reload atumedida-backend
```
- Para hacer que el backen se inicie automáticamente cuando se reinicie el sistema operativo se debe digitar el siguiente comando
```bash
$ pm2 startup systemd
$ pm2 save
```
- para detener la aplicación se digita el siguiente comando
```bash
$ pm2 stop atumedida-backend
```
- para eliminar la aplicación de los procesos del sistema se digita
```bash
$ pm2 delete atumedida-backend
```

# Despliegue en docker
- El despliegue con Docker se realiza ubicando dos archivos en la raíz del proyecto, estos archivos son: Dockerfile y docker_compose.yml

Una vez copiado los archivos a la raíz, se debe ejecutar el siguinete comando en la raíz del proyecto
Nota: se debe tener previamente instalado docker en el servidor

```bash
$docker-compose up -d prod
```

- El archivo Dockerfile tiene el siguiente contenido
```bash
FROM node:18.15.0-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./
#COPY cert.pem ./
#COPY key.pem ./

RUN npm install --only=production

COPY . .

#RUN npm run build

CMD ["node", "dist/main","--host"]
```

- El archivo docker_compose.yml tiene el siguiente contenido
```bash
version: '3.4'

services:
  prod:
    container_name: nestjs_api_prod
    image: loginproduction:1.0.0
    build:
      context: .
      target: production
      dockerfile: ./Dockerfile
    command: npm run start:prod
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - xxxx:xxxx
    env_file:
      - .env
    networks:
      - webnet
networks:
  webnet:
```