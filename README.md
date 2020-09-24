# projet-ofrater-back

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
