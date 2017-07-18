# Installer et utiliser MongoDB

Télécharger et décompresser:

    $ cd opt
    $ wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian81-3.4.6.tgz
    $ tar -xvf mongodb-linux-x86_64-debian81-3.4.6.tgz
    
Créer un fichier de configuration:

    $ vim /opt/mongodb/config.yml

    ---
    systemLog:
       destination: file
       path: "/opt/mongodb/log.txt"
       logAppend: true
    storage:
       journal:
          enabled: true
       dbPath: "/opt/mongodb/db/"
    processManagement:
       fork: true
    net:
       bindIp: 127.0.0.1
       port: 27017
    setParameter:
       enableLocalhostAuthBypass: false
    
    $ yamllint config.yml
    
    
Démarrer mongodb:

    $ /opt/mongodb/bin/mongod -f /opt/mongodb/config.yml 
