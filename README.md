# ofrater-back

## Pour utiliser l'API

### Clôner le repo
``` bash
git clone git@github.com:O-clock-Iliade/projet-ofrater-back.git
```
### Installer les modules nécessaires

``` bash
npm i
```

Créer le fichier `.env` à la racine du projet et le compléter avec les variables d'environnement (un exemple est donné dans le fichier `.env.example`).

### Installer de Postgis

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
```

### Installer Sqitch pour le versioning de BDD

``` bash
sudo apt-get install sqitch libdbd-pg-perl postgresql-client
```

### Creation de la base de données
```
createdb ofrater
```

### Déployer les migrations
``` bash
sqitch deploy
```

### Importer le fichier contenant les fausses données dans la BDD
``` bash
psql -U votreUser -d ofrater(la bdd) -f chemin_du_fichier
```



