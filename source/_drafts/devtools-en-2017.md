title: Chrome Devtools - 5 fonctionnalités à suivre
tags:
    - devtools
category:
    - tips
---


**Avant propos**

Je lance une nouvelle série d'articles que je vais compléter régulièrement dont l'objectif principal est de présenter des fonctionnalités des Chrome Devtools. L'idée n'est donc pas de sortir un "Top 5" car il y a trop de fonctionnalités et la notion de "Top" est beaucoup trop subjective... Je vais donc me contenter de présenter des fonctionnalités.

Beaucoup des fonctionnalités que je vais présenter ne sont disponibles qu'à travers les "experiments" des devtools. Je tacherais de le préciser si c'est le cas.

Pour activer les devtools expérimentaux, il suffit de se rendre sur le lien suivant : [#enable-devtools-experiments](chrome://flags/#enable-devtools-experiments) et d'activer la fonctionnalité souhaitée dans le menu suivant (accessible dans les settings)

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/activate_experiment.png">
</div>

# Raccourcis claviers <div chrome='stable'></div>

Les devtools proposent tout un ensemble de raccourcis claviers qui vont vous permettre de contrôler l'intégralité des actions disponible dans les devtools

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/shortcut.png">
</div>

Cette liste est non exhaustive et vous pouvez retrouver la liste complète des raccourcis à cette url : [Devtools Shortcut List](https://developers.google.com/web/tools/chrome-devtools/iterate/inspect-styles/shortcuts)

Même si cette liste vous parraît grande, il y a un raccourcis à retenir plus que tous les autres : `CTRL + SHIFT + P` ou `CMD + SHIFT + P` ce dernier vous donner accès à l'ensemble des fonctionnalités des devtools ! 


<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/ultime_shortcut.png">
</div>


# Changer de thème <div chrome='stable'></div>

Ajourd'hui, de plus en plus d'IDE proposent des thèmes "dark" et bien les devtools ne dérogent pas à la règle et vous proposent un thème sombre. Pour l'activer, soit vous passer par le raccourcis ultime, soit vous passez par le menu de paramètres

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/theme_menu.png">
</div>

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/theme_shortcut.png">
</div>

Ce qui vous donnera ça : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/theme_dark.png">
</div>


# Workspace avec persistance 2.0 <i class="fa fa-flask"></i>  <div chrome='stable'></div>

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/persistance_activate.png">
</div>

Cette fonctionnalité permet de révolutionner le fonctionnement des **"workspaces"** qui pour rappel, lie un répertoire de votre ordinateur avec les fichiers de votre site (si un sourcemap est mis en place). Cette version 2.0 permet donc de glisser déposer un répertoire système vers les devtools et le mapping se fait **"automatiquement" !** 

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/workspace.gif">
</div>


Pour vérifier que le mapping a été effectué correctement, il suffit de de regarder s'il y a un petit point vert 

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/persistance_2.0.png">
</div>

Vous pourrez ensuite éditer vos fichiers directement dans les devtools


<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/workspace_2.gif">
</div>

# Smart Console <div chrome="stable"></div>

La smart console est une fonctionnalité intéressante qui vous permet de saisir du code dans votre console sans avoir à se préocuper d'écrire une fonction **"inline"**

On pourra donc se retrouver à écrire des des fonctions dans la console comme suit : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/smart_console.png">
</div>


<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/smart_console.gif">
</div>


# Quick Source <div chrome="stable"></div>

La fenêtre "Quick Source" est très pratique car elle permet de pointer dans le panel d'inspection l'emplacement dans le fichier source correspondant ! En pratique ça veut dire quoi ? Que quand je suis en train de finaliser / tester des styles, je sais exactement où éditer mon fichier et je peux le faire directement depuis les devtools, ce qui m'évites d'avoir à switcher entre mes fenêtres.

Pour accéder à la fenêtre quick source, il faut aller dans le bas des devtools

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/quick_source_activate.png">
</div>

un nouvel onglet appraît ensuite dans le bas de la page : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/panel_quick_source.png">
</div>

Si l'on clique sur une propriété css de l'élément inspecté, alors la fenêtre quick source se synchronise directement.

<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/quick_source_in_action.png">
</div>


<div style="text-align:center; width:100%;">
    <img src="/assets/2017-devtools/quicksource.gif">
</div>
## Pour conclure sur cet article

Je sais que j'ai oublié un grand nombre de fonctionnalités mais mon idée est de sortir plus régulièrement ce type d'articles pour compléter au fil de l'eau des fonctionnalités présentent dans les devtools.

<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2017-devtools/devtools.js"></script>
