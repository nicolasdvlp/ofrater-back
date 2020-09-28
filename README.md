# projet-ofrater-back

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
4. Installer _Sqitch_ éventuellement pour le versioning de BDD


## Creation de BDD

`createdb ofrat`



```
tudiant@teleporteur:~/Oclock/apotheose/ofrater$ psql -U barbeapapa -d ofrat -f data/data.sql 
BEGIN
psql:data/data.sql:7: ERREUR:  droit refusé pour la table service
psql:data/data.sql:12: ERREUR:  la transaction est annulée, les commandes sont ignorées jusqu'à la fin du bloc
de la transaction
psql:data/data.sql:16: ERREUR:  la transaction est annulée, les commandes sont ignorées jusqu'à la fin du bloc
de la transaction
psql:data/data.sql:20: ERREUR:  la transaction est annulée, les commandes sont ignorées jusqu'à la fin du bloc
de la transaction
psql:data/data.sql:27: ERREUR:  la transaction est annulée, les commandes sont ignorées jusqu'à la fin du bloc
de la transaction
ROLLBACK
```

TODO LIST

Voir si utilisation de joy avec active record ou si verification dans les setter et getter
