ofrater-back

## Pour utiliser l'API

1. Clôner le repo
``` bash
git clone git@github.com:O-clock-Iliade/projet-ofrater-back.git
```
2. Installer les modules nécessaires
``` bash
npm i
```
3. Créer le fichier _.env_ à la racine du projet et le compléter avec les variables d'environnement (un exemple est donné dans le fichier _.env.example_).
4. Installer _Sqitch_ pour le versioning de BDD (si pas déjà installé)
``` bash
sudo apt-get install sqitch postgresql-client libdbd-pg-perl
sudo apt-get install build-essential cpanminus perl
sudo cpanm --quiet --notest App::Sqitch
```
5. Déployer les migrations
``` bash
sqitch deploy
```
6. Importer le fichier contenant les fausses données dans la BDD
``` bash
psql -U barbeapapa -d ofrater -f chemin_du_fichier
```


## Installation de Postgis

```
## You can do APT package list update and system upgrade before you get started.
sudo apt update
sudo apt -y upgrade
## A reboot is required
sudo reboot

Add PostgreSQL repository
sudo apt -y install gnupg2
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list

## For Postgres 12
sudo apt install postgis postgresql-12-postgis-3
```

## Creation de BDD

1. `createdb ofrater`
2. `sqitch deploy`

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO someuser;