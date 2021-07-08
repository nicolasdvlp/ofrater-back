# 💈🧔 o'frater back-end 🧔💈

[![Generic badge](https://img.shields.io/badge/node-15.6.1-<COLOR>.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/pg-8.6.0-<COLOR>.svg)](https://shields.io/)
## Pour utiliser l'API
### Clonage le repo
``` bash
git clone git@github.com:nicolasdvlp/ofrater-back.git
```
### Installation des modules nécessaires

``` bash
npm install
```

### Installation de [PostgreSQL](https://postgresql.org/) et de [Postgis](https://postgis.net/)
```
## You can do APT package list update and system upgrade before you get started.
sudo apt update
sudo apt -y upgrade
## A reboot is required
sudo reboot

## Add PostgreSQL repository
sudo apt -y install gnupg2
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list

## For Postgres 13
sudo apt install postgis postgresql-13-postgis-3

## Launch Postgres Service
sudo service postgresql start
```

Postgresql fonctionne au travers de l'utilisateur `postgres`. Il faut lui attribuer un mot de passe pour pouvoir se connecter à la base de données.
```
sudo passwd postgres
```
Fermez et ouvrer à nouveau le terminal puis lancez le service PostgreSQL
```
sudo service postgresql start
```
Il devrait vous demander votre mot de passe.

### Créér un utilisateur et une base de données
Création d'un utilisateur pour PostgreSQL
```
sudo -u postgres createuser <username>
```

Création du mot de passe pour le nouvel utilisateur
```
sudo -u postgres psql
postgres=# alter user <username> with encrypted password '<password>';
postgres=# \q
```

Création de la base de données
```
sudo -u postgres createdb <dbname>
```

Attribution de privilèges de l'utilisateur sur la base de données créée. Toujours dans `psql` :
```
sudo -u postgres psql

## SuperUser Role is necessary for the postgis deployement
postgres=# ALTER ROLE <username> SUPERUSER ;

postgres=# GRANT ALL PRIVILEGES ON DATABASE <dbname> TO <username> ; 
postgres=# \q
```


Créer le fichier `.env` à la racine du projet et le compléter avec les variables d'environnement nouvellement créées (un exemple est donné dans le fichier `.env.example`).

### Installation Sqitch pour le versioning de BDD

``` bash
sudo apt-get install sqitch libdbd-pg-perl postgresql-client
```

### Déploiement des migrations
``` bash
sqitch deploy db:pg://<username>:<password>@localhost/<dbname>
```
Attribution de privilèges à l'utilisateur sur les tables créées.
```
sudo -u postgres psql
postgres=# GRANT ALL ON ALL TABLES IN SCHEMA "public" TO <username> ;
postgres=# \q
```

### Import le fichier contenant les fausses données dans la BDD

``` bash
psql -U <username> -d <dbname> -f data/data.sql 
```

Si le message d'erreur suivant apparait : 
```
psql: error: FATAL:  Peer authentication failed for user "ofrater"
```
...   éditez votre fichier `pg_hba.conf` selon la procédure.
<details>

  <summary>Procédure : 🍕🍕🍕</summary>
  
  Editez le fichier avec votre éditeur :

  ```
  ## Replace XX by your version of PostgreSQL
  sudo nano /etc/postgresql/XX/main/pg_hba.conf



# DO NOT DISABLE!
# If you change this first entry you will need to make sure that the
# database superuser can access the database using some other method.
# Noninteractive access to all databases is required during automatic
# maintenance (custom daily cronjobs, replication, and similar tasks).
#
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            md5
host    replication     all             ::1/128                 md5

  ```

puis relancez le service PostgreSQL
```
sudo service postgresql restart 
```
et refaites l'import précédent.

a détailler

</details>