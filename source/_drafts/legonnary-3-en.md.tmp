title: >-
  J'ai fait un jeux multijoueur en temps réel server-less et offline (Partie 3 -
  Partie graphique)
tags:
  - HTML5
  - CSS
  - DevFest
category:
  - Tech
toc: false
date: 2018-11-23 17:05:46
---


![](/assets/2016-12-legonnary/devfest_photo.jpg)

Troisième partie d'une série de 3 articles :
* [Article 1 - PWA](/2016/12/23/2016-12-23-legonnary/)
* [Article 2 - Firebase](/2016/12/23/2016-12-23-legonnary-2/)


## Chalenges graphiques

Pour ce projet, j'ai dû faire face à 2 chalenges techniques :

1. Reproduire une grille Lego ©.
2. Afficher les dessins à l'écran principal avec une animation simulant un flash suivit d'une image type polaroid.

### Grille Lego ©

Finalement, faire la grille Lego © a été quelque chose de plutôt simple. Grâce à la libraire [FrabricJS](http://fabricjs.com/), j'ai pu reproduire un pion vu de haut. Une brique est donc l’addition d'un carré avec une ombre sur lequel, j'ai posé 2 cercles avec un jeu de couleurs et d'ombres. Enfin, je rajoute le mot "GDG" à la Place de Lego © et le tour est joué !

**Étape 1 : le carré avec l'ombre**

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/brique_1.png">
</div>

```javascript
this.rectBasic = new fabric.Rect({
    width: cellSize * size.col,
    height: cellSize * size.row,
    fill: color,
    originX: 'center',
    originY: 'center',
    centeredRotation: true,
    hasControls: false,
    shadow : "5px 5px 10px rgba(0,0,0,0.2)"
});
```

**Étape 2 : le premier cercle (cercle extérieur)**


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/brique_2.png">
</div>

```javascript
new fabric.Circle({
    radius: (cellSize / 2) - 4,
    fill: ColorLuminance(color, 0.1),
    originX: 'center',
    originY: 'center'
});
```

**Étape 3 : le second cercle avec une ombre**


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/brique_3.png">
</div>

```javascript
new fabric.Circle({
    radius: (cellSize / 2) - 5,
    fill: ColorLuminance(color, -0.1),
    originX: 'center',
    originY: 'center',
    shadow : "0px 2px 10px rgba(0,0,0,0.2)"
});
```

**Étape 4 : L'ajout du texte GDG**


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/brique_4.png">
</div>

```javascript
new fabric.Text('GDG', {
    fontSize: cellSize / 5,
    fill: ColorLuminance(color, -0.15),
    originX: 'center',
    originY: 'center',
    stroke: ColorLuminance(color, -0.20),
    strokeWidth: 1
});
```

Même si cela n'est pas parfait, à une plus petite échelle, cela permet d'avoir un effet plutôt bon !

Le code correspondant est au niveau des fichiers [peg.js](https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/lego_shape/peg.js) et [circle.js](https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/lego_shape/circle.js)

### Animations CSS

L'animation CSS est décomposée en plusieurs animations :

1. Un flash.
2. L'affichage de mon image sous forme de photo polaroid.
3. Le déplacement de mon image dans un coin de mon écran.

**Le Flash**

<div id="parent-flash">
  <div id="flash-effect" class="flash"></div>
</div>

Pour réussir cette partie, c'est très simple, il suffit de jouer avec une div blanche avec un dégradé vers de la transparence et il suffit d'afficher cette div pour la faire disparaitre très rapidement.

```css
#flash-effect{
    position:absolute;
    width:500px;
    height:500px;
    background:radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 80%);
    opacity:0;
}

#flash-effect.flash{
    animation: flash;
    animation-duration: 1s;
}

@keyframes flash {
    from {opacity:1;}
    to {opacity: 0}
}
```

Ainsi le fait d'appliquer la classe `flash` créera automatiquement cet effet de flash photo.

**L'effet Polaroid**

<div id="parent-negatif">
  <div class="img-ori-parent big" data-author="jefBinomed">
    <img class="img-ori" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
  </div>
</div>

Pour faire cet effet avec un nombre minimum d'éléments, j'ai simplement joué avec les before / after et sur les attributs HTML exploitables en CSS.

Ainsi voici le code HTML :

```html
<div class="img-ori-parent" data-author="jefBinomed">
    <img class="img-ori" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
</div>
```

et voici le code CSS correspondant :

```css
.img-ori-parent{
    position:absolute;
    width:calc(200px + 40px);
    height: calc(200px + 100px);
    background:white;
    z-index: 10;
    box-shadow       : 0px 0px 5px 0px rgba(50, 50, 50, 0.75);
}

.img-ori{

    position:absolute;
    top:20px;
    left:20px;
    width:200px;
    height:200px;
    background-size: contain;
    background-repeat: no-repeat;
    box-shadow       : 0px 0px 5px 0px rgba(0, 0, 0, 1.5) inset;
}

.img-ori-parent::after{
    content:attr(data-author);
    position: absolute;
    width:100%;
    text-align:center;
    bottom: 15pt;
    left: 0;
    font-size:20pt;
    line-height:20pt;
    font-family:"Roboto","Helvetica","Arial",sans-serif;
}
```

De cette manière, on peut voir qu'avec simplement un jeu d'ombres, de after, before, on peut donner un effet Polaroid à une image !

**L'animation de rétrécissement**

<div id="parent-negatif">
  <div class="img-ori-parent big anim" data-author="jefBinomed">
    <img class="img-ori" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
  </div>
</div>

Cette animation est assurée par la propriété transition. On écoute ainsi toutes les évolutions de tailles, positions, ... et on déclenche une transition de façon à rendre ça plus fluide.

La raison pour laquelle je ne passe pas par la propriété `animation` de CSS, est que la position d'arrivée sera complètement aléatoire !  En effet, une fois l'image apparue, on va la positionner dans l'écran de façon aléatoire. Une fois à gauche et une fois à droite. Sa position horizontale et verticale sera certes bornée, mais le résultat sera issu d'un `Math.random()`. Donc en utilisant la propriété `transition` plutôt que `animation`, je peux m'assurer qu'il y aura une animation fluide et prenant en compte tous les cas.

Dans mon animation, j'ai géré 2 états :

1. Le parent a la classe `.big` : Dans cet état, l'image est grande et positionnée au centre de l'écran
2. Le parent n'a plus la classe `.big` : Dans cet état, l'image va prendre une taille plus réduite. Les top & left seront fixés directement par le Javascript

Voici le code CSS à produire pour gérer simplement l'animation :

```scss screen.scss https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/sass/screen.scss#L53
$size-photo: 200px;
$size-photo-big: 500px;

.img-ori-parent.big{
    width:$size-photo-big+90px;
    height: $size-photo-big+200px;
    background:white;
    box-shadow       : 0px 0px 5px 0px rgba(50, 50, 50, 0.75);

    .img-ori{
        top:45px;
        left:45px;
        width:$size-photo-big;
        height:$size-photo-big;
    }
}
.img-ori-parent.big::after{
    bottom: 15pt;
    left: 0;
    font-size:50pt;
    line-height:50pt;
    transition-property: all;
    transition-duration: 2s;
    transition-timing-fonction: ease;
}


.img-ori-parent{
    position:absolute;
    width:$size-photo+40px;
    height: $size-photo+100px;
    background:white;
    z-index: 10;
    box-shadow       : 0px 0px 5px 0px rgba(50, 50, 50, 0.75);
    transition-property: all;
    transition-duration: 2s;
    transition-timing-fonction: ease;
}

.img-ori{

    position:absolute;
    top:20px;
    left:20px;

    width:$size-photo;
    height:$size-photo;
    background-size: contain;
    background-repeat: no-repeat;
    box-shadow       : 0px 0px 5px 0px rgba(0, 0, 0, 1.5) inset;
    transition-property: all;
    transition-duration: 2s;
    transition-timing-fonction: ease;
}

.img-ori-parent::after{
    content:attr(data-author);
    position: absolute;
    width:100%;
    text-align:center;
    bottom: 15pt;
    left: 0;
    font-size:20pt;
    line-height:20pt;
    font-family:"Roboto","Helvetica","Arial",sans-serif;
    transition-property: all;
    transition-duration: 2s;
    transition-timing-fonction: linear;
}
```


Voici ensuite comment avec le Javascript j'anime le tout :

1. Je déclenche le "flash".
2. Après un léger timeout (le temps du flash), je créé une nouvelle DIV avec la classe `.big`.
3. Après un deuxième timeout (le temps de laisser le dessin à l'écran pour les participants), je supprime la classe `.big` et je donne des valeurs aléatoires au `top` & `left` de la DIV parente.

```javascript app_screen.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/app_screen.js#L35
function generateSnapshot(user, dataUrl) {
    // We start our flash effect
    let rectCanvas = document.querySelector('.canvas-container').getBoundingClientRect();
    let flashDiv = document.getElementById('flash-effect')
    flashDiv.style.top = (rectCanvas.top - 250) + "px";
    flashDiv.style.left = (rectCanvas.left - 250) + "px";
    flashDiv.classList.add('flash');
    //When the animation is done (1s of opacity .7 -> 0 => ~500ms to wait)
    setTimeout(() => {
        // We create the final image
        // We create a div that we will be animate
        flashDiv.classList.remove('flash');
        let imgParent = document.createElement('div');
        let img = document.createElement('img');
        img.src = dataUrl;
        img.classList.add('img-ori');
        imgParent.classList.add('img-ori-parent');
        imgParent.setAttribute('data-author', user);
        imgParent.appendChild(img);
        imgParent.classList.add('big');
        // Initial Position
        imgParent.style.top = (rectCanvas.top - 45) + "px";
        imgParent.style.left = (rectCanvas.left - 45) + "px";

        document.body.appendChild(imgParent);

        // we wait a litle to set new position to the new div. The css animation will do the rest of the job
        setTimeout(function () {

            let horizontalDist = Math.floor(Math.random() * 300) + 1;
            let heightScreen = document.body.getBoundingClientRect().height;
            let verticalDist = Math.floor(Math.random() * (heightScreen - 100 - 300)) + 1;
            let angleChoice = Math.floor(Math.random() * 3) + 1;

            imgParent.classList.remove('big');
            imgParent.style.top = `calc(100px + ${verticalDist}px)`;
            imgParent.style.left = `${horizontalDist}px`;
            if (!lastLeft) { // True if the last photo was placed at the left of the countDown
                imgParent.style.left = `calc(100vw - ${horizontalDist}px - 300px)`;           // The timeout date
            }
            lastLeft = !lastLeft; // True if the last photo was placed at the left of the countDown
            let angle = angleChoice === 1 ? -9 : angleChoice === 2 ? 14 : 0; // The timeout date
            imgParent.style.transform = `rotate(${angle}deg)`;
            getNextDraw();
        }, 100);

        // When the element is create, we clean the board
        legoCanvas.resetBoard();
        document.getElementById('proposition-text').innerHTML = "En attente de proposition";

    }, 500);
}

```

**Le résultat final**

<div id="parent-final">
  <img class="img-ori empty" src="/assets/2016-12-legonnary/empty_legonnary.png">
  <img class="img-ori temp" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
  <div class="img-ori-parent big final-anim" data-author="jefBinomed">
    <img class="img-ori" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
  </div>
  <div class="flash-final flash"></div>
</div>

## Tout ce dont je n'ai pas parlé

Il reste encore beaucoup de points non abordés et je veux bien répondre aux questions si vous en avez :

* La gestion du compte à rebours.
* La gestion de l'audio & vidéo.

En conclusion, j'ai encore appris pas mal de choses avec ce projet et si je devais revoir certaines parties, je pense que je ferais les choix suivants :

*  J'essayerais d'utiliser une autre librairie JS de canvas, D3 ? Car même, si FabricJS est facile d'accès et fait bien le job, j'ai constaté quelques soucis avec le touch et quelques problèmes de performances liés à la librairie sur certains téléphones.
*  Je tâcherais d'alléger un peu plus mon arbre firebase, notamment sur le stockage des images. Aujourd'hui mes images sont stockées directement dans l'arbre en base64, ce qui ralentit énormément l'affichage de l'écran de restitution. J'essayerais de stocker ça avec le storage de firebase plutôt qu'en tant que nœud firebase...

Si vous êtes curieux, je vous invite à consulter le code source :  [Legonnary-Github](https://github.com/GDG-Nantes/CountDownDevFest2016)

Le résultat final :
 * [App de base](https://legonnary.firebaseapp.com/)
 * [App Modérateur](https://legonnary.firebaseapp.com/moderator.html) : Nécessite d'être admin
 * [App Comptes à rebours](https://legonnary.firebaseapp.com/screen.html) : Nécessite d'être admin
 * [App Restit](https://legonnary.firebaseapp.com/summary.html)



<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2016-12-legonnary/legonnary.js"></script>
