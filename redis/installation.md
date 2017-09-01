# Installation de Redis

Télécharger et installer:

    $ cd /opt
    $ wget http://download.redis.io/releases/redis-4.0.0.tar.gz 
    $ tar -xvf redis-4.0.0.tar.gz
    $ mv redis-4.0.0.tar.gz redis
    $ cd redis

Construire et tester:
    
    $ make
    $ make test