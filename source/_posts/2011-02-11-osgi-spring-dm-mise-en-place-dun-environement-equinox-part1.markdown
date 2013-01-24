--- 
layout: post
title: "OSGI & Spring DM, mise en place d'un environement equinox (partie 1)"
date: 2011-02-11 00:01:00 +01:00
comments: true
published: true
categories: [Java]
---

Voici mon premier post technologique, je vais tenter d'être bref concis et d'aller droit au but.

Pour ce premier post, je vais traiter d'un sujet que je suis en train d'essayer de mettre en oeuvre actuellement à savoir OSGI avec Spring DM. <!--more--> Si je créé un article, c'est par ce que tous les tutoriaux OSGI que l'on voient traitent de OSGI et Spring DM toujours dans environnement eclipse mais jamais de la mise en place d'une application OSGI en dehors d'un environnement eclipse.

Je vais partir du principe que si vous lisez ce post, vous savez déjà ce qu'est OSGI et spring DM. Si ce n'est pas le cas, je vous invite a aller voir les sites suivants : <a href="http://www.vogella.de/articles/OSGi/article.html">Tutorial OSGI</a> pour les anglophones et sinon ce site là pour les français : <a href="http://t-templier.developpez.com/tutoriel/java/osgi/osgi1/">Tutorial OSGI fr</a> ainsi que ce site : <a href="http://static.springsource.org/osgi/docs/1.2.x/reference/html/">Spring DM</a>. Pour ce tutoriel, je me suis appuyer sur un autre tutoriel très bien fait : <a href="http://sites.google.com/site/springosgi/">http://sites.google.com/site/springosgi/</a>.J'aurais encore plein de site à vous partager mais là n'est pas le sujet.

Commençons donc notre tutoriel.


## Objectifs
Quels sont les objectifs de ce tutoriel ? 

Mettre en oeuvre une application OSGI avec de l'instanciation automatique de services et la possibilité d'instancier des beans avec spring.
Pour ce tutoriel, j'ai choisi le conteneur OSGI equinox. Je verrais pour tester les autres conteneurs plus tard.

voici la liste des prérequis : 

 * Avoir <a href="http://maven.apache.org/download.html">Maven </a>d'installé</li>
 * Avoir la version <a href="http://download.eclipse.org/equinox/">3.6.1 d'OSGI equinox</a></li>
 * les fichiers disponible sur ce tutoriel de osgi. <a href="http://sites.google.com/site/springosgi/springdm-tutorial.zip">samples</a></li>
 * un <a href="http://www.eclipse.org/downloads/">eclipse helios</a></li>

## Préparation de l’environnement de développement 

Il faut suivre les étapes décrites <a href="http://sites.google.com/site/springosgi/ch01.html">ici</a>. Ceci vous permettra d'avoir tous les bundles nécessaires.
Les points 1.2, 1.3 et 1.4 sont ceux à suivre pour notre tutoriel

## Ecriture du bundle

Nous allons donc créer notre bundle, pour cela dans eclipse, 
{% img /images/2011-02-11/new_project.jpg %}

Nous allons lui donner un nom de package ainsi qu'un nom.

{% img /images/2011-02-11/new_project_1.jpg %}


{% img /images/2011-02-11/new_project_2.jpg %}


### Création des services

Nous allons maintenant créé 2 services OSGI très basiques, ces derniers n'ont en objectif que d'afficher une chaîne de caractères. L'idée est de pouvoir instancier un bean avec le scope prototype et l'autre pas.

Nous allons donc créer les packages et classes suivantes : 

{% img /images/2011-02-11/packages_services.jpg %}

Voici le code des classes utilisées : 

#### IClassIOC.java

```java
package com.binomed.osgi.spring.test.api;

public interface IClassIOC {

	void helloWorld();

}
```

#### IClassIOCPrototype.java

```java
package com.binomed.osgi.spring.test.api;

public interface IClassIOCPrototype {

	void helloWorld();

}
```


#### ClassIOC.java

```java
package com.binomed.osgi.spring.test.api.impl;

import com.binomed.osgi.spring.test.api.IClassIOC;

public class ClassIOC implements IClassIOC {

	public ClassIOC() {
		super();
		System.out.println("LOAD!!!!");
	}

	public void helloWorld() {
		System.out.println("Hello World Spring with OSGI");
	}

}
```

#### ClassIOCPrototype.java

```java
package com.binomed.osgi.spring.test.api.impl;

import com.binomed.osgi.spring.test.api.IClassIOCPrototype;

public class ClassIOCPrototype implements IClassIOCPrototype {

	public ClassIOCPrototype() {
		super();
		System.out.println("LOAD PROTO!!!!");
	}

	public void helloWorld() {
		System.out.println("Hello World Spring with OSGI From Proto");
	}

}
```

### Edition du manifest.mf

Nous allons maintenant configurer notre manifest.MF afin d'avoir les bonnes dépendances de bundle.

```properties
Manifest-Version: 1.0
Bundle-ManifestVersion: 2
Bundle-Name: OsgiSpringTest
Bundle-SymbolicName: com.binomed.osgi.spring.test
Bundle-Version: 1.0.0
Bundle-Activator: com.binomed.osgi.spring.test.Activator
Bundle-Vendor: binomed
Bundle-RequiredExecutionEnvironment: JavaSE-1.6
Import-Package: org.osgi.framework
Bundle-ActivationPolicy: lazy
Require-Bundle: org.springframework.context,
 org.springframework.beans,
 org.springframework.aop,
 org.springframework.core
```

de cette manière on peut distinguer qu'on sera dépendant de beans, context pour pouvoir instancier notre bean.

### Ecriture des fichiers springs
Nous allons maintenant créer 2 fichiers spring qui seront reconnus par un bundle et instanciés automatiquement dans notre conteneur OSGI : 

{% img /images/2011-02-11/xml_files.jpg %}


Ces deux fichiers vont contenir respectivement la description des beans et services osgi à utiliser.

Voici le contenu des 2 fichiers 

#### applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml version="1.0" encoding="UTF-8"?>
<beans 	xmlns="http://www.springframework.org/schema/beans"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xmlns:osgi="http://www.springframework.org/schema/osgi"
		xsi:schemaLocation="http://www.springframework.org/schema/beans 
							http://www.springframework.org/schema/beans/spring-beans.xsd
 							http://www.springframework.org/schema/osgi 
 							http://www.springframework.org/schema/osgi/spring-osgi.xsd">
	
	<bean name="ClassIOC"
		class="com.binomed.osgi.spring.test.api.impl.ClassIOC">
	</bean>
	<bean name="ClassIOCPrototype"
		scope="prototype"
		class="com.binomed.osgi.spring.test.api.impl.ClassIOCPrototype">
	</bean>
	
</beans>
```

#### applicationContext-osgi.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans 	xmlns="http://www.springframework.org/schema/beans"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xmlns:osgi="http://www.springframework.org/schema/osgi"
		xsi:schemaLocation="http://www.springframework.org/schema/beans 
							http://www.springframework.org/schema/beans/spring-beans.xsd
 							http://www.springframework.org/schema/osgi 
 							http://www.springframework.org/schema/osgi/spring-osgi.xsd">
	
	<osgi:service 	id="ClassIOCOsgi"
				ref="ClassIOC"
				interface="com.binomed.osgi.spring.test.api.IClassIOC"/>
	<osgi:service 	id="ClassIOCPrototypeOsgi"
				ref="ClassIOCPrototype"
				interface="com.binomed.osgi.spring.test.api.IClassIOCPrototype"/>

</beans>
```


On peut donc voir que notre bean ClassIOCPrototype est avec le scope prototype, il sera donc créé autant d'instance de ClassIOPrototype que l'on invoque le bean avec spring.

### Ecrtitue de l'Activator

Nous allons maintenant nous interessé au code notre activator dans lequel on va vérifier plusieurs choses sur le fonctionnement d'OSGI avec Spring.

```java
package com.binomed.osgi.spring.test;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.springframework.context.ApplicationContext;

import com.binomed.osgi.spring.test.api.IClassIOC;
import com.binomed.osgi.spring.test.api.IClassIOCPrototype;

public class Activator implements BundleActivator {

	private static BundleContext context;

	static BundleContext getContext() {
		return context;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.osgi.framework.BundleActivator#start(org.osgi.framework.BundleContext
	 * )
	 */
	public void start(BundleContext bundleContext) throws Exception {
		Activator.context = bundleContext;
		Thread thread = new Thread(new Runnable() {

			@Override
			public void run() {
				try {
					Thread.sleep(5000);
					inject();
				} catch (Exception e) {
					e.printStackTrace();
				}

			}
		});
		thread.start();
	}

	private void inject() throws Exception {

		String beanIdProt = "ClassIOCPrototype";

		IClassIOC classIOC = (IClassIOC) getContext().getService(getContext().getServiceReference(IClassIOC.class.getName()));
		IClassIOCPrototype classIOCPrototype = (IClassIOCPrototype) getContext().getService(context.getServiceReference(IClassIOCPrototype.class.getName()));

		classIOC.helloWorld();
		classIOCPrototype.helloWorld();
		classIOCPrototype = (IClassIOCPrototype) getContext().getService(context.getServiceReference(IClassIOCPrototype.class.getName()));
		classIOCPrototype.helloWorld();

		ServiceReference webContext = context.getAllServiceReferences("org.springframework.context.ApplicationContext", "(org.springframework.context.service.name=com.binomed.osgi.spring.test)")[0];

		ApplicationContext ac = (ApplicationContext) context.getService(webContext);
		ac.getBean(beanIdProt);
		ac.getBean(beanIdProt);

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.osgi.framework.BundleActivator#stop(org.osgi.framework.BundleContext)
	 */
	public void stop(BundleContext bundleContext) throws Exception {
		Activator.context = null;
	}

}
```

On peut voir que j'invoque plusieurs instruction dans le but de tester les instanciations faites sur mes beans. 

Nous allons maintenant lancer notre bundle dans eclipse et analyser les résultats.

## Lancement du bundle dans eclipse

Nous allons créer une nouvelle configuration osgi : 

{% img /images/2011-02-11/new_configuration.jpg %}


Nous allons cocher tous les plugins visible sur l'écran suivant. Pour des besoins de lisibilités, j'ai affiché uniquement les bundles à prendre : 

{% img /images/2011-02-11/bundles.jpg %}

Il est très important que le bundle **org.springframework.osgi.extender** soit coché !  c'est lui qui s'occupe de charger les applications context dans notre conteneur OSGI au moment de l'installation du bundle.

Penser aussi à ajouter dans l'onglet Arguments dans VM Arguments l'option *** -Dosgi.clean=true** de façon à bien penser à nettoyer le cache OSGI à chaque lancement.

Vous pouvez maintenant valider et lancer le bundle. Vous devrez avoir une sortie console similaire à celle ci : 

```sh
osgi> log4j:WARN No appenders could be found for logger (org.springframework.osgi.extender.internal.activator.ContextLoaderListener).
log4j:WARN Please initialize the log4j system properly.
LOAD!!!!
LOAD PROTO!!!!
Hello World Spring with OSGI
Hello World Spring with OSGI From Proto
Hello World Spring with OSGI From Proto
LOAD PROTO!!!!
LOAD PROTO!!!!
```

Qu'est ce qu'on peut en conclure en fonction de nos instructions et notre configuration.

 * Le permier LOAD!!!! nous indique que notre premier service c'est loader tout seul au moment où le bundle est installé.
 * Le LOAD PROTO !!! apparaît avec un décalage indiquant qu'un service OSGI pointant vers un bean en scope prototype n'est pas pas chargé automatiquement avec le bundle extender
 * Le premier Hello World montre bien que l'on a réussi très simplement à invoquer un service de notre conteneur
 * idem pour les 2 autres appels sauf que l'on constate que un service OSGI utilisant un bean en scope prototype restera en mémoire, il ne sera pas réinstancié à chaque appel du service.
 * Enfin mes 2 derniers LOAD PROTO !!! montre que l'on peut quand même appeler l'application context de notre bundle en vue d'instancier des bean. Attention toute fois, cette pratique n'est pas recommendée, il est préférable en OSGI de gérer soit même dans ce cas l'instanciation plutot que de passer par l'application Context.


Bon tout marche dans eclipse. Ok c'est bien mais c'est comme dans tout tutoriel OSGI ! Nous allons maintenant voir comment faire marcher cet exemple en dehors d'eclipse.

## Lancement du bundle en dehors d'eclipse

Nous allons commencer par générer un  jar de notre bundle. Pour cela cliquer sur votre projet et faites exporter et choississez de l'exporter en tant que plugin

{% img /images/2011-02-11/export.jpg %}

Nous allons choisir un répertoire d'export : 

{% img /images/2011-02-11/export_2.jpg %}

### Préparation du conteneur equinox

Nous allons donc maintenant préparer notre conteneur equinox. Nous avons besoin de plusieurs choses :  

 * extraire le zip de notre sdk equinox
 * Préparer un répertoire de la façon suivante


```
MonTestSpringOSGI
    |
    `->org.eclipse.equinox.common_3.6.0.v20100503.jar
    `->org.eclipse.osgi_3.6.1.jar
    `->org.eclipse.update.configurator_3.3.100.v20100512.jar
    +-- configuration
            |
            `->config.ini
    +-- plugins
            |
            `->com.springsource.javax.activation-1.1.1.jar
            `->com.springsource.javax.annotation-1.0.0.jar
            `->com.springsource.javax.el-2.1.0.jar
            `->com.springsource.javax.mail-1.4.0.jar
            `->com.springsource.javax.persistence-1.0.0.jar
            `->com.springsource.javax.xml.bind-2.0.0.jar
            `->com.springsource.javax.xml.soap-1.3.0.jar
            `->com.springsource.javax.xml.stream-1.0.1.jar
            `->com.springsource.javax.xml.ws-2.1.1.jar
            `->com.springsource.org.aopalliance-1.0.0.jar
            `->com.springsource.org.apache.commons.collections-3.2.0.jar
            `->com.springsource.org.apache.commons.logging-1.1.1.jar
            `->com.springsource.org.apache.log4j-1.2.15.jar
            `->com.springsource.slf4j.api-1.5.0.jar
            `->com.springsource.slf4j.jcl-1.5.0.jar
            `->com.springsource.slf4j.log4j-1.5.0.jar
            `->org.springframework.aop-2.5.6.A.jar
            `->org.springframework.beans-2.5.6.A.jar
            `->org.springframework.context-2.5.6.A.jar
            `->org.springframework.core-2.5.6.A.jar
            `->org.springframework.osgi.core-1.1.3.RELEASE.jar
            `->org.springframework.osgi.extender-1.1.3.RELEASE.jar
            `->org.springframework.osgi.io-1.1.3.RELEASE.jar
            `->com.binomed.osgi.spring.test_1.0.0.jar
```

les jars org.eclipse.equinox.common_3.6.0.v20100503.jar et org.eclipse.osgi_3.6.1.jar (je l'ai renommé de façon à simplifier son invocation)  sont à récupérer dans le répertoire plugins du sdk equinox, le jar org.eclipse.update.configurator_3.3.100.v20100512.jar est à récupérer dans le répertoire plugins de votre eclipse. Ce dernier sert à installer automatiquement tous les bundles présents dans le répertoire plugins
Les autres jars sont à récupérer dans la target platform générée au début du tutoriel.
Vous constaterez que j'ai mis notre bundle com.binomed.osgi.spring.test_1.0.0.jar

Nous allons maintenant éditer le fichier config.ini afin de définir le démarrage de notre application

```ini
osgi.bundles=org.eclipse.equinox.common@2:start\
, org.eclipse.update.configurator@3:start\
,reference\:file\:plugins/org.springframework.osgi.extender-1.1.3.RELEASE.jar@start\
,reference\:file\:plugins/com.springsource.javax.activation-1.1.1.jar@start\
,reference\:file\:plugins/com.binomed.osgi.spring.test_1.0.0.jar@start
osgi.bundles.defaultStartLevel=4
eclipse.ignoreApp=true
osgi.noShutdown=true 
osgi.clean=true
```


Cette configuration permet de spécifier l'installation auto des bundles, l'auto instanciation des services contenus dans nos bundles démarrés et enfin le démarrage de notre bundle.

Nous allons donc maintenant lancer notre application, ouvrons donc une console  et lançons l'instruction suivante : 

```sh
java -jar org.eclipse.osgi_3.6.1.jar -consoleLog -console
```

nous avons donc bien la sortie suivante : 

```sh
osgi> log4j:WARN No appenders could be found for logger (org.springframework.osgi.extender.internal.activator.ContextLoaderListener).
log4j:WARN Please initialize the log4j system properly.
LOAD!!!!
LOAD PROTO!!!!
Hello World Spring with OSGI
Hello World Spring with OSGI From Proto
Hello World Spring with OSGI From Proto
LOAD PROTO!!!!
LOAD PROTO!!!!
```

C'est tout pour le moment. :)

