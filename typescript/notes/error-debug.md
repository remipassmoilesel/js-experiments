# Debugger avec Typescript

Utiliser source-map-support:

    $ cd typescript-project
    $ nom install --save source-map-support
    
Puis intégrer dans les fichiers '.ts':
    
    import 'source-map-support/register';
    
Les piles d'erreurs sont affichées ensuite avec les correspondances de lignes 
Typescript.