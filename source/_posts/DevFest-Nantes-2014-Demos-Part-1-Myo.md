title: DevFest Nantes 2014 - Demos Part 1 - Myo
tags:
  - myo
  - ev3
  - devfest
  - nodeJS
category:
  - Event
date: 2014-12-16 15:24:40
---

# Myo et EV3

Voici le résultat final

## Déplacement

<video width="80%" controls>
	<source src="/assets/2014-12-DevFestDemos/videos/video_deplacement.mp4" type="video/mp4">
</video>

## Tir d'élastiques

<video width="80%" controls>
	<source src="/assets/2014-12-DevFestDemos/videos/video_tir.mp4" type="video/mp4">
</video>

## Commandes

Pour résumer, j’utilise mon bras pour diriger le robot et si je serre le poing, alors ce dernier tir des élastiques. 

Certains m'ont dit avec humour que ceci était la prochaine étape : 

<iframe width="560" height="315" src="//www.youtube-nocookie.com/embed/Z3aVhpKaHIU" frameborder="0" allowfullscreen></iframe>

mais ...

# Je ne suis pas un jedi mais juste un développeur

Voici donc le schéma de communication des différents composants : 

![](/assets/2014-12-DevFestDemos/images/schema_myo_ev3.png)

Le fonctionnement est donc très simple. Un programme C++ tourne sur mon ordinateur récupérant tous les messages du Bracelet Myo via le SDK de Myo. Ce dernier envoie toutes les commandes à un serveur NodeJS qui s'occupe de communiquer en Bluetooth avec le Lego Mindstorm. 

## Myo

### C'est quoi ?

Avant de parler de Myo, revenons un peu sur ce que c'est et comment cela fonctionne. 

![](/assets/2014-12-DevFestDemos/images/myo-overview.png)

C'est donc un bracelet connecté qui possède un certain nombre de sensors : 

* Sensors Électriques
* Accéléromètre
* Gyroscope

Ce qui différencie le Myo des autres bracelets connectés, c'est les sensors électriques qui lui permettre de reconnaître des **"gestes"**. De cette façon, en plus d'envoyer des informations de types : orientation / vitesse, nous sommes capable de détecter si le porteur du bracelet a fait un geste précis. Les gestes aujourd'hui reconnus sont : 

![](/assets/2014-12-DevFestDemos/images/myo_gestures.png)

En fonction de la version du SDK, que vous avez un 5ème geste qui est disponible mais les gestes représentés ci-dessus sont ceux qui fonctionnent le mieux et qui sont les plus simple à déclencher.

### Que dois-je analyser ?

Avant d'attaquer le code, j'ai du me poser une question cruciale : **Comment vais-je contrôler mon robot ?** 

Je viens de présenter les sensors qui sont à notre disposition : Accéléromètre, Gyroscope, Sensors électriques. Je dois donc choisir le moyen le plus simple pour contrôler le robot. 

Quel va être le mouvement le plus "naturel" pour contrôler un robot ? A défaut d'avoir trouvé le plus naturel, j'en ai trouvé un qui était simple à exploiter et simple à faire comprendre car c'est aussi un des enjeux majeurs de ce genre de devices : Si l'on doit passer un temps considérable à expliquer le fonctionnement, c'est que l'on a raté quelque chose ! 

Voici un schéma qui traduit le vocabulaire utilisé par [Thalmic](https://www.thalmic.com) (la société derrière le bracelet) pour retranscrire les informations du bracelet

![](/assets/2014-12-DevFestDemos/images/Mark-blog-Diagrams-01.jpg)

Pour ma part, j'ai choisi d'exploiter le **"Pitch"** et le **"Yaw"**. Cela reste relativement intuitif et facile à expliquer : 

* Baissez votre bras et ça fera avancer le robot. Remontez-le et ça le fera reculer. Le bras à l'horizontal représente le point 0 (robot à l'arrêt).
* Bougez votre bras vers la gauche ou vers la droite pour le faire tourner.

J'aurais pu utiliser le **"Roll"** mais après quelques essais, je me suis rendu compte que le Roll était facile à faire pour l'utilisateur vers la partie extérieur de son corps mais pas vers l'intérieur... Cela avait le désavantage suivant : On peut facilement tourner dans un sens mais difficilement dans l'autre.... D'où mon choix de tourner avec le **"Yaw"**. 

Faites l'essai : Si vous êtes droitier, vous vous rendrez vite compte que tourner sa main vers la droite est simple, mais la tourner vers la gauche nécessite une certaine contorsion du bras qui rend le mouvement non naturel. De plus la combinaison Roll + Pitch complexifiait beaucoup le code.



### On code comment avec ?

Aujourd'hui Thalmic a développé 3 SDKs permettant d'interagir avec des objets (programmation objets) que l'on peut manipuler :

* Un SDK en C++ exploitable pour les ordinateurs
* Un SDK en Java pour Android
* Un SDK en ObjectiveC pour Iphone

A partir de là, on peut commencer à jouer. Je ne rentrerais pas trop dans le détail car je compte rédiger plus tard un billet sur le développement avec Myo. Je vais donc m'attarder sur la solution retenue pour la démo.



### Partie C++

Pour la démo, j'ai donc choisi d'exploiter le SDK C++ car utiliser mon téléphone présentait un soucis en termes de batterie notamment au niveau de la communication bluetooth classique avec le Lego.

Je suis parti du code fournit avec le SDK pour exploiter les données que je voulais. Le principe du SDK est simple, nous posons un listener et nous récupérons des informations construites : 

```c++
// Class qui écoute les événements provenant du sdk
class DataCollector : public myo::DeviceListener {
public:
	...
	// Appelé pour donner les données sur l'orientation,
	void onOrientationData(myo::Myo* myo, uint64_t timestamp, const myo::Quaternion<float>& quat)
	{
		using std::atan2;
		using std::asin;
		using std::sqrt;

		// Calculate Euler angles (roll, pitch, and yaw) from the unit quaternion.
		roll = atan2(2.0f * (quat.w() * quat.x() + quat.y() * quat.z()),
			1.0f - 2.0f * (quat.x() * quat.x() + quat.y() * quat.y()));
		pitch = asin(2.0f * (quat.w() * quat.y() - quat.z() * quat.x()));
		yaw = atan2(2.0f * (quat.w() * quat.z() + quat.x() * quat.y()),
			1.0f - 2.0f * (quat.y() * quat.y() + quat.z() * quat.z()));

		// Convert the floating point angles in radians to a scale from 0 to 20.
		roll_w = static_cast<int>((roll + (float)M_PI) / (M_PI * 2.0f) * 18);
		pitch_w = static_cast<int>((pitch + (float)M_PI / 2.0f) / M_PI * 18);
		yaw_w = static_cast<int>((yaw + (float)M_PI) / (M_PI * 2.0f) * 18);
	}

	// Appelé à chaque fois qu'un geste est détecté
	void onPose(myo::Myo* myo, uint64_t timestamp, myo::Pose pose)
	{
		currentPose = pose;

		// Sur la pose Poing, on fait vibrer le bracelet
		if (pose == myo::Pose::fist) {
			myo->vibrate(myo::Myo::vibrationMedium);
		}
	}

	// Méthode appelée dans le main
	void print()
	{
		// On appelle notre serveur local avec un json formaté
		std::string url("?json=");
		url += toJson();
		Request(GET, "localhost", url.c_str(), NULL, NULL);

	}

	// Méthode qui envoie nos données au format JSON
	std::string toJson(){

		std::string result("{");
		result += "\"roll\":" + std::to_string(roll);
		result += ",\"pitch\":" + std::to_string(pitch);
		result += ",\"yaw\":" + std::to_string(yaw);
		result += ",\"pose\":\"" + currentPose.toString() + "\"";
		result += "}";
		return result;

	}

};

int main(int argc, char** argv)
{
	// We catch any exceptions that might occur below -- see the catch statement for more details.
	try {
		
		// On essaye de récupérer une instance de Myo
		myo::Hub hub;

		// On patiente 10 secondes pour voir si on peut récupérer une instance de Myo
		myo::Myo* myo = hub.waitForMyo(10000);

		// Si hub.waitForMyo retourne null, alors c'est qu'on en a pas trouvé et donc on quitte notre programme
		if (!myo) {
			throw std::runtime_error("Unable to find a Myo!");
		}

		// On va construire notre listener 
		DataCollector collector;

		// Hub::addListener() Attache notre listener au hub Myo
		hub.addListener(&collector);

		// On rentre dans une boucle infinie afin de lire régulièrement les données
		while (1) {
			// On récupère les informations 20 fois par secondes
			hub.run(1000 / 20);
			// On imprime les données collectées
			collector.print();
		}
		
	}
	catch (const std::exception& e) {
		std::cerr << "Error: " << e.what() << std::endl;
		std::cerr << "Press enter to continue.";
		std::cin.ignore();
		return 1;
	}
}

```

Une fois ce code exécuté, nous récupérons 20 fois par seconde un JSON nous donnant l'état du bracelet. Et ce JSON est envoyé à un serveur tournant en local sur notre machine.


## Partie NodeJS

La partie NodeJS est un peu plus compliquée car c'est elle qui possède l'intelligence du programme et l'aspect conversion. Le code est donc réparti en 3 composantes principales : 

1. La partie Serveur : Dans cette partie, le programme reçoit les informations provenant du bracelet
2. La partie Analyse : Dans cette partie, le programme décide quoi faire des données. Le robot doit-il avancer ? Reculer ? ...
3. La partie communication : Dans cette partie, le programme communique en bluetooth avec le Lego. Il y a donc un protocole à respecter et à implémenter.

Voici mon package.json 

```javascript
{
  "author": "jefBinomed",
  "name": "MyoEV3",
  "version": "1.0.0",
  "dependencies": {},
  "devDependencies": {
  	"bluetooth-serial-port": "1.1.4", // Utilisé pour la communication bluetooth
    "express" : "3.x" // Utilisé pour la partie serveur
  }
}
```

###  Le Serveur NodeJS

Pour la partie serveur, je suis parti sur un simple serveur à base d'express. 

```javascript
var app = express()
  .use(express.static('public'))
  .use(function(req, res){
     ...
  });

http.createServer(app).listen(8090);
console.log('-------------------------------');
console.log('Start Http server on port : '+8090);
```

### L'analyse des trames

Plutôt que de rentrer dans le détail du code, je vais vous expliquer la démarche adoptée pour répondre au besoin. 

Le programme est bombardé de messages (20 / secondes) et donc nous devons les filtrer en entrée. Il est important de noter que tout geste détecté par le bracelet remplira le champ "pose" de mon json avec une valeur qui est différente de **"rest"**. Nous devons donc traiter 2 cas : 

1. Mon utilisateur a fait un geste et cela peut potentiellement signifier quelque chose à interpréter : pose != "rest"
2. Mon utilisateur bouge son bras : pose === "rest"

Le cas 1 me permet de détecter plusieurs choses : 

* L'utilisateur veut effectuer un tir d'élastiques (pose === 'fist')
* L'utilisateur veut prendre la main sur le robot (enchaînement de gestes). Étant donné que le bracelet émet en continue des informations, il était primordial de définir une cinématique de départ ainsi qu'une cinématique de fin permettant d'indiquer au programme que l'on prend volontairement la main sur le robot. En effet, il serait désagréable de voir le robot se balader alors que l'on n'a pas décidé qu'on voulait le contrôler. De plus, afin d'éviter un déclenchement accidentel suite à un geste, j'ai pris le parti de demander la prise de contrôle suite à l’exécution de 3 gestes en moins de 2 secondes. Si l'utilisateur, exécute les gestes "waveOut" -> "waveIn" -> "FingerSpread", il prend la main sur le robot.

Le cas 2 me permet de contrôler le déplacement du robot : 

Pour mettre en place cette partie, j'ai dû faire beaucoup d'essais et analyser précisément les métriques renvoyées par le Myo en fonction du positionnement de mon bras. 

![](/assets/2014-12-DevFestDemos/images/Myo_gestes_metrics.jpg)

* Le Pitch varie donc de -1.5 sur on lève le bras vers 1.5 si on baisse le bras.
 * 0.3 < Pitch < 1.5 => On baisse le bras et donc on doit faire avancer le robot
 * -0.3 < Pitch < 0.3 => On est à l'horizontale et donc on doit arrêter le robot
 * -1.5 < Pitch < -0.3 => On lève le bras et donc on doit faire reculer le robot
* La Yaw quand à lui varie sur 360° entre -3.13 et 3.13 (sachant que -3.13 va devenir 3.13 dans un sens et inversement). Les valeurs du Yaw dépendent de l'axe des points cardinaux. Cependant, ce qui m'intéresse, ce n'est pas tant une valeur entre -3.13 et 3.13 mais un delta par rapport à un point que je considérerais comme mon point 0. 
 * -0.3 < ΔYaw => On dirige notre bras vers gauche et donc demande à notre robot d'aller à gauche
 * -0.3 < ΔYaw < 0.3  => Notre bras est au point 0 et donc demande à notre robot de s’arrêter
 * 0.3 < ΔYaw => On dirige notre bras vers droite et donc demande à notre robot d'aller à droite
 * La cinématique de prise de contrôle me sert donc à initialiser un point "zéro" pour le Yaw et toutes les données provenant après correspondront au delta de ce point de référence avec l'orientation de mon bras.


###  L'envoi des données


La communication avec le Mindstorm s'est faite par bluetooth en suivant un système de messages : 

* "fire" : Demande au robot de tirer un élastique
* "start" : Demande au robot de joueur un son de démarrage (utilisé quand l'utilisateur prend le contrôle)
* "stop" : Demande au robot de s’arrêter 
* "quit" : Demande au robot de jouer un son d’arrêt (utilisé quand l'utilisateur arrête de contrôler le robot)
* "down" : Demande au robot d'avancer
* "up" : Demande au robot de reculer
* "right" : Demande au robot d'aller à droite
* "left" : Demande au robot d'aller à gauche

L'envoie des données à du respecter un protocole bluetooth fixé par Lego : [Bluetooth Protocol for EV3](http://www.mindstorms.rwth-aachen.de/trac/wiki/EV3).

Un projet NodeJS existait pour la communication avec un EV3 mais ce dernier ne fonctionnait pas avec la version de Mindstorm que j'avais et son utilisation était trop compliquée. J'ai donc du tout recoder.


## Partie EV3

Cette partie est relativement simple car je me suis contenté de recevoir les messages envoyés par le programme Node et en fonction du message, j'ai simplement  activé les bons moteurs.

Pour ceux qui n'ont jamais vu à quoi ressemblait du code Mindstorm, mon code ressemble à quelque chose comme ça : 

![](/assets/2014-12-DevFestDemos/images/ev3_ide.png)


# Conclusion

Mon retour d'expérience sur cette démo est le suivant : Beaucoup de personnes on put essayer le bracelet pendant le devfest mais seulement un petit nombre ont réussi à faire fonctionner correctement la démo. Voici donc les points positifs et négatifs de ce retour : 

* (-) Le bracelet ne s'adapte clairement pas à tous les bras. Certaines femmes avaient par exemple un bras trop fin et les gestes ne pouvaient pas être reconnus
* (-) Les gestes que je considérais comme facile à faire ne l'étaient pas pour tous et même certains des gestes basiques n'arrivaient pas à être joué rendant impossible la prise de contrôle du robot. Le WaveOut était par exemple un geste impossible pour certains.
* (-) La prise de contrôle à partir de 3 gestes est trop longue. 3 gestes c'est trop ! J'aurais dû réduire cela à 2 gestes. Un grand nombre de personnes n'arrivaient pas à jouer correctement les 3 gestes et l'on perdait beaucoup de temps à configurer cela ! 
* (+) Le fait d'avoir mis un log des gestes effectués dans une ligne de commande était après coup, une très bonne idée car cela m'a permis d'expliquer plus facilement aux personnes ce qu'elles devaient faire et cela me permettait aussi de vérifier avec eux les gestes effectués. 
* (+) Le fait d'avoir mis en places des vibrations à des moments clés s'est révélé utile pour l'utilisateur car cela lui donne une impression plus forte de feedback.
* (+) Le fait d'avoir joué des sons sur le mindstorm pour signifier le démarrage du contrôle ou au contraire l’arrêt du contrôle s'est révélé aussi fort utile pour ce même feedback
* Si je devais rejouer cette démo, je réduirais donc la phase de contrôle et je mettrais en place une interface graphique affichant à l'utilisateur la donnée interprétée par le programme pour qu'il ait un feedback plus fort sur ce qu'il fait.

En conclusion, Myo est un outil	 très utile et relativement facile à intégrer dans des solutions logicielles mais il faut complètement repenser la façon que l'on a de donner du feedback à l'utilisateur ! Dans le cadre de ma démo, une ihm aurait été un bon moyen de donner de l'information à l'utilisateur. L'utilisation de la vibration du bracelet est aussi importante car elle permet à l'utilisateur de comprendre que ce qu'il fait est interprété.

# Code source

Tout le code des 3 projets est disponible ici : [MyoEV3](https://github.com/binomed/MyoEV3)
