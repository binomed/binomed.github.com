title: Un nouveau (?) blog 
category: 
- News
tags:
- hexo
- octopress
- nodeJS
---
## Pourquoi ? 

Ca y est je me suis décidé à reblogguer si on peut dire ainsi.

http://blog.binomed.fr renait donc de ses cendres et ce pour traiter de nouveaux sujets. L'objectif de se blog est simple : 

* Partager mes dernières trouvailles en terme de code / technologies
* Faire des retours sur les événements où je serais allé soit en tant que speaker, soit en tant que participant
* Partagé tout ce que je jugerais utile :) Mais attention, je m'engage à ne pas vous partager ma vie ;)

## Le moteur de blog Hexo

### L'ancien blog sous Octopress

En voulant reprendre mon blog, je me suis retrouvé face à un problème de taille. Comment ça marche [Octopress](http://octopress.org/) ? Il faut avouer aussi qu'en 2 ans, j'avais un peu perdu la configuration nécessaire et les prérequis en matière d'écriture de blog... 

J'ai donc essayé de réinstaller mon environnement de blog à savoir, Ruby, Rake, ... et je me suis dit que c'était assez compliqué que si je voulais blogguer pendant mes missions chez des clients, il me fallait un environnement plus "work friendly". En bon développeur, je me suis dit : **Quel est le cahier des Charges ?**


### Cahier des Charges


1. Je ne veux pas d'un site où j'aurais besoin d'un serveur php => je veux un site statique genre githubpages
2. Je veux un site que j'écrive en markdown car je ne suis pas un artiste, je suis geek et je veux me concentrer sur mon contenu et non sur la forme.
3. Je n'apporte pas particulièrement d'importance au fait que le site soit généré ou dynamique. Dans le cas d'un site généré, je pourrais toujours trouver une PIC (Plateforme d'Intégration Continue) qui me fasse le job
4. Je veux pouvoir installer relativement simplement la solution si je suis en mission chez un client et que ça soit simple quel que soit l'OS.

En partant de là, mon premier critère m'a amené à regarder du côté de Octopress / Jeckyll que j'avais déjà essayé mais je voulais essayer autre chose.... En discutant avec un collègue, j'ai découvert [Hexo](http://hexo.io/) un générateur de sites statiques à la Octopress. Regardons de plus prêt les fonctionnalités qui ont fait de Hexo ma solution favorite : 

* Il est basé sur NodeJS => facile à mettre en place même en mission chez un client
* Il est possible de déployer sur github => J'ai ce que je voulais : pas de serveur PHP ! 
* Il propose un système de plugins assez riches et les thèmes sont facilement customisable => Je peux le faire évoluer comme je veux
* Le contenu est  écrit en markdown
* Il affiche des performances de génération de site bien meilleur à Octo **[Why I Switch My Blog From Octopress To Hexo](http://www.techelex.org/why-switch-blog-from-octopress-to-hexo/)**

Le seul point noir est que c'est un moteur très présent en asie et donc, un grand nombre de ressources / thèmes sont en Japonais ou Chinois...  Mais sinon, je m'y retrouve plutôt pas mal en terme de fonctionnalités.

### Installation

Pour l'installer et démarrer c'est simple : 

``` bash
npm install hexo -g
hexo init blog
cd blog
npm install
hexo server
```

Après, il ne vous reste plus qu'à configurer votre serveur github :) [Configuration Hexo](http://hexo.io/docs/setup.html)

