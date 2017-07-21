# Utiliser npm-link pour utiliser un package en développement dans une app

Dans le dossier du projet qui sera distribué en tant que paquet:

    $ npm link
    
Dans le dossier node_modules du projet qui utilisera le paquet en développement:

    $ npm link packageName
    
Ensuite les dossiers sont liés, et les modifications sont prises en comptes.
Pour l'autocomplétion dans WebStrom, utiliser Clic droit + Synchronize.