title: Retour Google I/O 2017
tags:
  - assistant
  - pwa
  - polymer
category:
  - Event
toc: false
date: 2017-05-26 13:59:35
---


<div style="text-align:center; width:100%;">
    <img src="/assets/2017-05-IO/io_shoreline.jpg">
</div>


Cette année encore, j'ai eu la chance d'aller au [Google I/O](https://events.google.com/io/) : la grand-messe de Google pendant laquelle sont annoncées toutes les nouveautés sur les produits Google. Plutôt que de revenir sur les annonces publiques qui ont été reprises à de multiples endroits ([101 announcements](https://blog.google/topics/developers/all-io17-announcements/)) , je vais m'attarder sur les conférences que je suis allé voir et ce qu'il fallait en retenir.

## L'assistant

Une des nouveautés cette année, c'était les avancées dans l'application assistant et sur les nouvelles possibilitées qui s'offrent à nous pour développer des actions "Google Assistant". Non seulement "assistant" va être disponible en dehors de l'application [Google Allo](https://play.google.com/store/apps/details?id=com.google.android.apps.fireball&hl=fr) mais en plus, elle arrive sur iOS. Du coup, on va pouvoir coder sur assistant un peu partout !

### Building Apps for the Google Assistant

Cette session permet de mieux comprendre le processus de développement pour écrire des applications pour l'assistant. On retiendra entre autres l'apparition d'une "console" de déclaration des "actions" Google. Ils ont aussi présenté comment fonctionnait la nouvelle API de transaction du Google Assistant.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Y26vvxCb3zE" frameborder="0" allowfullscreen></iframe>

### Building Rich Cross-Platform Conversational UX with API.AI

Cette session très intéressante avait pour objectif de revenir sur les possibilités offertes par le site [API.ai](https://api.ai). Voici en vrac les choses à retenir de cette session :
* API.ai propose pas loin de 18 langages pour offrir une interface de bot.
* De nouvelles fonctionnalités ont fait leur apparition comme :
 * L'apprentissage via l'affichage des réponses non reconnues. Ceci peut être très pratique car il permettra au développeur d'ajuster ses phrases de détection et ainsi de les ajouter à la volée dans son modèle pour compléter une action.
 * Analytics for action. Ceci permet d'avoir un mécanisme type Google Analytics basé sur ses actions. On pourra donc voir quelles sont les actions les plus populaires et quel chemin l'utilisateur suit à travers notre bot.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/K4v_QnngRdg" frameborder="0" allowfullscreen></iframe>


## Le web continue de progresser


### Future, faster: Unlock the power of Web Components with Polymer

Cette session permettait de faire un état des lieux des avancés faites dans le monde des webcomponents et avec Polymer depuis l'année dernière. Première chose à retenir :  Le support de plus en plus large des navigateurs vis-à-vis des spécifications enfin figées !

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-05-IO/webcomponent_support.jpg">
</div>

La taille du polyfill a aussi énormément baissé et sa réécriture a permis d'avoir une cohabitation dans les frameworks Javascript améliorée. En effet, il n'est plus nécessaire de faire des hacks pour faire marcher les webcomponents dans vos frameworks !

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/cuoZenpQveQ" frameborder="0" allowfullscreen></iframe>

### The Mobile Web: State of the Union

Cette session est toujours très intéressante car elle permet de mettre en avant des retours d'expériences de grandes sociétés qui ont appliqué les concepts et bonnes pratiques du moment en matière de web. Par exemple, cette année, c'est Twitter qui nous faisait un retour sur leur application PWA **"Twitter Lite"**.

Ce que j'ai pu retenir de cette session c'était entre autres l'annonce de l'arrivée de "lightHouse" (l'outil de benchmark d'une PWA) directement dans les devtools de chrome et l'apparition d'un nouveau "cli" pour faciliter l'écriture d'application web moderne : [Workbox](https://developers.google.com/web/tools/workbox/).

L'autre aspect qui m'a plu et surtout conforté dans mon discours c'est le retour de **"OLA"**, une société indienne qui propose un service de partage de trajets en voiture. Ils ont écrit la version PWA de leur application et grace à ça, ils ont pu réengager des utilisateurs qu'ils avaient perdus avec l'application native ! Ceci va exactement dans le même sens que ce que je dis en conférences à savoir : les applications natives ne sont pas mortes et l'objectif des PWA n'est pas de les détruire ! Les PWA vont juste offrir une alternative pour un public spécifique et donc permettre aux sociétés de toucher un plus grand nombre d'utilisateurs !

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/_ssDaecATCM" frameborder="0" allowfullscreen></iframe>


### Compiling for the Web with WebAssembly

Je suis allé avant tout dans cette session pour mieux comprendre ce qu'il se cache derrière cette spécification. Après un rapide retour sur l'historique de WebAssembly (NativeClient, Asm.js, ...), le speaker est revenu sur le moment où le code WebAssembly est exécuté par rapport au code Javascript du reste de la page. Ceci nous a permis de comprendre le bénéfice de cette spécification reposant uniquement sur quelques instructions. Nous avons eu droit ensuite une démo de webassembly qui tournait sur tous les navigateurs modernes !

Ce que j'ai retenu de son utilisation et de son intérêt, c'est que WebAssembly est très très proche du fonctionnement du JNI d'Android. Je n'ai pas encore de uses cases pour lesquels j'aurais besoin d'utiliser webAssembly mais c'est bien de savoir que ça existe et que ça fonctionne !

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/6v4E6oksar0" frameborder="0" allowfullscreen></iframe>

### Great Progressive Web App Experiences with Angular

Cette session faisait un tour d'horizon des outils présents dans le "cli" d'Angular pour aider les développeurs à écrire des PWA avec Angular.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/C8KcW1Nj3Mw" frameborder="0" allowfullscreen></iframe>


### Web Performance: Leveraging the Metrics that Most Affect User Experience

Cette session fait partie des plus intéressantes que j'ai pu voir cette année. L'idée de ce talk était de s'intéresser ce que veut dire "mon site s'affiche lentement". Annoncer un "load time" de 1.3s ne veut rien dire en fait !  Qu'est-ce qui est pris en compte avec ce chiffre ? Le premier pixel affiché ? Le moment où l'utilisateur peut interagir avec la page ? De la même façon avec une population ne disposant pas des mêmes conditions réseaux, d'un utilisateur à l'autre le temps de réponse va évoluer !

Bref, les conférenciers proposaient 2 choses :

1. S'attarder à étudier des graphes de temps de réponse plutôt qu'un temps absolu. Ils disaient qu'il était aussi pertinent de séparer les résultats obtenus sur mobile et sur ordinateurs !
2. Savoir ce que l'on mesure. Ils ont proposé plusieurs unités de temps que l'on peut mesurer en fonction du besoin :
 * First Paint : affichage des premiers pixels.
 * First Contentful Paint : affichage du premier contenu de mise en forme.
 * First Meaningful Paint : affiche du premier contenu pertinent.
 * Time to Interactive : temps à partir duquel l'utilisateur peut interagir avec la page.

Afin d'aider les développeurs à mesurer celà, ils ont présenté un ensemble de nouvelles api qui arrivent dans le web et qui permettront de mesurer efficacement les temps de réponse associés.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/6Ljq-Jn-EgU" frameborder="0" allowfullscreen></iframe>

### Developer Tooling for Web Components

Cette session présentait les dernières nouveautés de la ligne de commande "Polymer cli" qui est enfin sortie en version 1.0. Ils ont aussi annoncé la sortie d'un plugin vscode pour écrire plus facilement des composants polymer avec entre autres du linting intégré.

Pour finir, ils ont annoncé la sortie du projet [PRPL-Server-Node](https://github.com/Polymer/prpl-server-node) qui permet de fournir un serveur PRPL ready avec tout ce qui faut pour fournir correctement des ressources en http2 etc.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/tKvNeNGmOtU" frameborder="0" allowfullscreen></iframe>

### Building for Your Next Billion Users

Cette session permettait de revenir sur les enjeux à prendre en compte quand on conçoit des applications qui doivent fonctionner partout et notamment pour les marchés émergents ! En Inde, il y a actuellement 100 millions de nouveaux utilisateurs tous les ans et Google estime qu'en 2020, il y aura 1 milliard d'utilisateurs indiens ! Ce marché n'est donc pas à sous-estimer et voici en gros les normes à prendre en compte en Inde :

* Offline est l'état par défaut, sinon il faut compter sur de la 2G. Les utilisateurs ont donc tendance à "charger" leur contenu le matin avec leur wifi et ils consultent le contenu offline le reste du temps.
* Ils payent le moindre Méga téléchargé, ils hésitent donc énormément à consulter du contenu s'ils ne sont pas derrière un Wifi.
* Il y a beaucoup de langues différentes en Inde et il est important de leur servire leur contenu dans le dialecte attendu.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/wD3rpdiLMyY" frameborder="0" allowfullscreen></iframe>

### Production Progressive Web Apps With JavaScript Frameworks

Cette session était avant tout une revue des différentes possibilités pour faire des PWA avec les frameworks Javascript modernes. Et la chose la plus importante à retenir était que **TOUS** les frameworks proposent maintenant dans leurs outils de ligne de commande, de quoi générer des PWA ! Il a donc été annoncé la sortie pour React / Preact / Vue.js de ligne de commandes spécifiques pour créer des PWA.

La norme des prochains projets web est donc bien la PWA :)

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/aCMbSyngXB4" frameborder="0" allowfullscreen></iframe>


### Using Web Components with Angular

Cette session revenait sur les outils et les bonnes pratiques à mettre en place pour faire cohabiter des webComponents dans une application Angular2. Ce que j'ai retenu c'est qu'utiliser un composant en tant que noeud feuille dans son arbre dom marche très bien. Par contre si l'on veut commencer à l'utiliser au milieu de son arbre ou que l'on veut pouvoir manipuler des objets complexes avec son composant le tout en utilisant des mécanismes type ngModel, alors il faudra prévoir des wrappers angular pour faire fonctionner le tout.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ucq9F-7Xp8I" frameborder="0" allowfullscreen></iframe>


## Et pour aller encore plus loin

Voici la liste des sessions que je n'ai pas eu le temps d'aller voir mais je vais regarder à coup sur :
* [Polymer: Billions Served; Lessons Learned](https://www.youtube.com/watch?v=assSM3rlvZ8)
* [Progressive Web Apps: Great Experiences Everywhere](https://www.youtube.com/watch?v=m-sCdS0sQO8)
* [The Future of Web Payments](https://www.youtube.com/watch?v=hU89pPBmhds)
* [Defining Multimodal Interactions: One Size Does Not Fit All](https://www.youtube.com/watch?v=fw27RFHP2tc)
* [Finding the Right Voice Interactions for Your App](https://www.youtube.com/watch?v=0PmWruLLUoE)
* [DevTools: State of the Union 2017](https://www.youtube.com/watch?v=PjjlwAvV8Jg)
