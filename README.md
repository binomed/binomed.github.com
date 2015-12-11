# Installation de l'environnement pour le blog binomed


## Environement mise en place

* Installer NodeJS (configurer éventuellement les proxys)
* Installer Git (configurer éventuellement les proxys)
* Installer hexo : ```npm install -g hexo-cli```

Si c'est la première qu'on récupère le site : 

* Installer les dépendances node : ```npm install```


## Ajout d'un article

exécuter ```hexo new "<title>"```

lien utile : http://hexo.io/docs/commands.html

## Ajout d'un draft

exécuter ```hexo new draf "<title>"```

et une fois l'article fini : ```hexo publish <filename>``` : si le draft name était "un super titre" alors le fichier dans draft se nomme un-super-titre.md et donc la commande à taper pour la publication est ```hexo publish un-super-titre```