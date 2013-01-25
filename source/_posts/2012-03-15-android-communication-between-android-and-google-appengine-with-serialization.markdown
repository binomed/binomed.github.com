---
layout: post
title: "[Android] Communication between Android and Google AppEngine with serialization"
date: 2012-03-15 23:06
comments: true
published: true
categories: [Android, AppEngine, Json, Rest]
---
The purpose of this article is to make a benchmark of 3 frameworks that we could use as developers to make an Android application communicate with a Google AppEngine Server. {% img right /images/2012-03-15/gae_android.jpg %}

<h1>What is compared and how ?</h1>
I study 4 axes in this benchmark :
<ol>
	<li>Is it simple to implement ? it’s purely subjective but it could give a little idea about how is it complicated to integrate it in your projects.</li>
	<li>Could I manage complex objects ? it’s to evaluate the complexity of POJO we could send or retrieve to / from the server.</li>
	<li>What is the impact on final apk size ? it’s use to determine the impact of the framework on the apk final size. This is very important because the available place on Android phone is very limited sometimes.</li>
	<li>Is it effective ? we will look at the time between the call of server and the response. It is i think the most important criteria for the final choice.</li>
</ol>
&nbsp;
For the benchmark, we will use those POJO :

This object show that we could have complex objects ownig other objects

```java IObjectA
package com.binomed.client;

import java.io.Serializable;
import java.util.List;

public interface IObjectA extends Serializable {

	T getObjectB();

	void setObjectB(T objectB);

	List getListObjectB();

	void setListObjectB(List listObjectB);

	String getName();

	void setName(String name);

}
```
This object show a very simple POJO

```java IObjectB
package com.binomed.client;

import java.io.Serializable;

public interface IObjectB extends Serializable {

	String getName();

	void setName(String name);

	int getNum();

	void setNum(int num);

}
```

This object show a simple POJO with an HashMap in order to test the serialization

```java IObjectBMap
package com.binomed.client;

import java.io.Serializable;
import java.util.HashMap;

public interface IObjectBMap extends IObjectB, Serializable {

	HashMap getMap();

	void setMap(HashMap map);

}
```
&nbsp;

For this we are going to implements this application

&nbsp;
{% img /images/2012-03-15/app_tuto.jpg %}

This is a very simple application with 3 tabs. On each tab, there is 2 buttons. 
<ul>
<li>The first button make a basic request which returns from server an instance of IObjectA.</li>
<li>The second button takes care of the field to the right by asking “n” IObjectB in the list of IObjectA (“n” is the number in the field)</li>
</ul>
<h1>What are the compare elements ?</h1>
I have selected 3 frameworks  :
<ol>
	<li><a href="http://java-json-rpc.sourceforge.net/">java-json-rpc</a>. I choose this framework because I want a neutral framework so I search somes java json rpc librairies and this one look pretty good and simple. The project is based on JSON-PRC 2.0 specifications. It is still in Alpha version and hasn't evolved since may 2011.</li>
	<li><a href="http://code.google.com/webtoolkit/doc/latest/DevGuideRequestFactory.html">google request-factory</a>. I choose this framework because it is the referenced framework use while you are using the plugin Appengine with android. Request Factory is a recent framework and is pretty popular in GWT projects.</li>
	<li><a href="http://www.restlet.org/">restlet</a>. I choose this framework because it is one of the best implementation of REST  which is a very popular framework used on severals servers.</li>
</ol>
I choose those 3 frameworks because the both of three are solutions to do serialization between java server and java client. They are all using json messages.

<h1>Architecture</h1>
This tutorial is composed by 2 projects :
<ol>
	<li>An android application</li>
	<li>An Google AppEngine application</li>
</ol>
The android application will comunicate with the AppEngine application in local.  In order to minimize duplicate code, the AppEngine project will have a "<strong>shared</strong>" folder with the Android project.
<h1>Implementation</h1>
This tutorial will be done with <a href="http://www.eclipse.org/downloads/packages/eclipse-ide-java-ee-developers/indigosr1">eclipse 3.7</a>, <a href="http://code.google.com/intl/fr/eclipse/docs/getting_started.html">Google Plugin for indigo</a> and <a href="http://developer.android.com/sdk/eclipse-adt.html">android ADT plugin</a>. All used jar are available on the <a href="https://github.com/binomed/android_sandbox/tree/master/RpcTests" target="_blank">github project</a> of this tutorial (see at the end of article).  First we have to create the android project : **File -> New -> Android Project**

{% img /images/2012-03-15/androidProject.jpg %}

Select as minimal sdk : <em>donuts</em>. I didn’t test this tutorial with previous versions of sdk but I think it will work to.

Create the AppEngine project : **File -> New -> Web Application Project**

{% img /images/2012-03-15/AppEngineProject.jpg %}

Create the shared folder. This folder will contain all shared interfaces and all POJOs that will be exchange between projects.

<em><strong>Right Click on AppEngineRpcProject -&gt; New -&gt;Source Folder</strong></em>. Call it "<strong>shared</strong>".

Now we have to add it on android project :

<strong><em>Right Click on AndroidRpcProject -&gt; Build Path -&gt; Configure Build Path</em></strong>. Click on button "Link Source" and select the folder shared in your file system.

{% img /images/2012-03-15/shared-folder.jpg %}

&nbsp;
Normaly, you should have the same image for yours projects  
&nbsp;
{% img /images/2012-03-15/projects.jpg %}

First we have to create the IObjectA, IObjectB previously seen. Go on the AppEngineRpcProject in the shared folder and create a package with the name "<strong>com.binomed.client</strong>".   In this package create the previous interface IObjectA, IObjectB and IObjectBMap.

Now we can create the squeleton of our android project :

Now we have to create  the main Android activity : <em><strong>AndroidRpcProjectActivity</strong></em>. Put the folowing code in the class :
```java AndroidRpcProjectActivity
package com.binomed.rpc;

public class AndroidRpcProjectActivity extends TabActivity implements OnClickListener {

	// In android when we call localhost, we have to set the adress 10.0.2.2
	public static final String LOCALHOST = "http://10.0.2.2:8888"; //$NON-NLS-1$
	private static final String TAG = "TestAndroidActivity";

	// the editTexts area where results will be puts
	private EditText requestFactory, jsonRpc, restlet;
	// the editText to define the number of objects to return
	private EditText nbParamRequestFactory, nbParamJsonRpc, nbParamRestlet;
	// Each button do a rpc call
	private Button btnRequestFactory, btnJsonRpc, btnRestlet, btnRequestFactoryParams, btnJsonRpcParams, btnRestletParams;
	private Context mContext;

	// Constants used for the abstract task define in this class
	private static final int JSON_RPC = 1;
	private static final int REQUEST_FACTORY = 2;
	private static final int REST = 3;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

	}

	@Override
	protected void onResume() {
		super.onResume();

		setContentView(R.layout.tabs);
		mContext = this;

		TabHost tabHost = getTabHost();

		// Tab for Json Rpc
		TabSpec jsonRpcTab = tabHost.newTabSpec("JsonRpc");
		jsonRpcTab.setIndicator("Json Rpc");
		jsonRpcTab.setContent(R.id.jsonRpcLayout);

		// Tab for Request Factory
		TabSpec requestFactoryTab = tabHost.newTabSpec("RequestFactory");
		requestFactoryTab.setIndicator("Request Factory");
		requestFactoryTab.setContent(R.id.requestFactoryLayout);

		// Tab for Rest
		TabSpec restTab = tabHost.newTabSpec("Rest");
		restTab.setIndicator("Rest");
		restTab.setContent(R.id.restLayout);

		// Adding all TabSpec to TabHost
		tabHost.addTab(jsonRpcTab); // Adding json rpc tab
		tabHost.addTab(requestFactoryTab); // Adding request factory tab
		tabHost.addTab(restTab); // Adding rest tab

		// We get map all widgets
		requestFactory = (EditText) findViewById(R.id.requestFactory);
		nbParamRequestFactory = (EditText) findViewById(R.id.nbParamRequestFactory);
		btnRequestFactory = (Button) findViewById(R.id.btnRequestFactory);
		btnRequestFactoryParams = (Button) findViewById(R.id.btnRequestFactoryParams);
		jsonRpc = (EditText) findViewById(R.id.jsonRpc);
		nbParamJsonRpc = (EditText) findViewById(R.id.nbParamJsonRpc);
		btnJsonRpc = (Button) findViewById(R.id.btnJsonRpc);
		btnJsonRpcParams = (Button) findViewById(R.id.btnJsonParams);
		restlet = (EditText) findViewById(R.id.rest);
		nbParamRestlet = (EditText) findViewById(R.id.nbParamRest);
		btnRestlet = (Button) findViewById(R.id.btnRest);
		btnRestletParams = (Button) findViewById(R.id.btnRestParams);

		// We add the listener on buttons
		btnRequestFactory.setOnClickListener(this);
		btnRequestFactoryParams.setOnClickListener(this);
		btnJsonRpc.setOnClickListener(this);
		btnJsonRpcParams.setOnClickListener(this);
		btnRestlet.setOnClickListener(this);
		btnRestletParams.setOnClickListener(this);

	}

	@Override
	public void onClick(View v) {
                // generic method wich just call an AsyncTasj with correct parameters (the type of service, if parameters are passed or not)
		switch (v.getId()) {
		case R.id.btnJsonRpc: {
			new TaskTest(jsonRpc, btnJsonRpc, JSON_RPC, -1).execute();
			break;
		}
		case R.id.btnJsonParams: {
			new TaskTest(jsonRpc, btnJsonRpcParams, JSON_RPC, Integer.valueOf(nbParamJsonRpc.getText().toString())).execute();
			break;
		}
		case R.id.btnRequestFactory: {
			new TaskTest(requestFactory, btnRequestFactory, REQUEST_FACTORY, -1).execute();
			break;
		}
		case R.id.btnRequestFactoryParams: {
			new TaskTest(requestFactory, btnRequestFactoryParams, REQUEST_FACTORY, Integer.valueOf(nbParamRequestFactory.getText().toString())).execute();
			break;
		}
		case R.id.btnRest: {
			new TaskTest(restlet, btnRestlet, REST, -1).execute();
			break;
		}
		case R.id.btnRestParams: {
			new TaskTest(restlet, btnRestletParams, REST, Integer.valueOf(nbParamRestlet.getText().toString())).execute();
			break;
		}
		default:
			break;
		}

	}

	class TaskTest extends AsyncTask {

		private EditText text;
		private Button btn;
		private int type;
		private int nbParams;
		private IObjectA<? extends IObjectB> message;
		private long time;

		public TaskTest(EditText text, Button btn, int type, int nbParams) {
			this.text = text;
			this.btn = btn;
			this.type = type;
			this.nbParams = nbParams;
			btn.setEnabled(false);
			text.setText("contacting server");
		}

		@Override
		protected IObjectA<? extends IObjectB> doInBackground(Void... params) {
			// According to the type we do the correct call with appropriates methods and classes
                        time = System.currentTimeMillis();
			try {
				IObjectA<? extends IObjectB> result = null;
				switch (type) {
				case JSON_RPC: {
					// TODO
					break;
				}
				case REQUEST_FACTORY: {
					// TODO
					break;
				}
				case REST: {
					// TODO
					break;
				}
				default:
					break;
				}

				return result;
			} catch (Exception e) {
				Log.e(TAG, "Error during contacting server", e);
				return null;
			}
		}

		@Override
		protected void onPostExecute(IObjectA<? extends IObjectB> result) {
                        // Each time we manage the results with the same way.
			String typeName = null;
			switch (type) {
			case JSON_RPC:
				typeName = "Json Rpc";
				break;
			case REQUEST_FACTORY:
				typeName = "Request Fatory";
				break;
			case REST:
				typeName = "Restlet";
				break;

			default:
				break;
			}
			if (result != null) {
				StringBuilder str = new StringBuilder();
				str.append("Type : ").append(typeName).append("\n");
				str.append("Time : ").append(String.valueOf(System.currentTimeMillis() - time)).append("ms \n");
				str.append("Object A : ").append(result.getName()).append("\n");
				IObjectB objB = result.getObjectB();
				if (objB != null) {
					if (objB instanceof IObjectBMap) {
						str.append("Object B Map : ").append(objB.getName()).append("\n");
						if (((IObjectBMap) objB).getMap() != null) {
							for (Entry entry : ((IObjectBMap) objB).getMap().entrySet()) {
								str.append("-&gt; : Key").append(entry.getKey()).append(" : ").append(entry.getValue()).append("\n");
							}
						}
					} else {
						str.append("Object B: ").append(objB.getName()).append("\n");
					}
				}
				if ((result.getListObjectB() == null) || (result.getListObjectB().size() == 0)) {
					str.append("Nb objects B: ").append(0).append("\n");
				} else {
					str.append("Nb objects B: ").append(result.getListObjectB().size()).append("\n");
					for (IObjectB objBTmp : result.getListObjectB()) {
						str.append("--&gt; ").append(objBTmp.getName()).append("\n");
					}
				}

				text.setText(str.toString());
			} else {
				text.setText("Failure during getting result");

			}
			btn.setEnabled(true);
		}

	}

}
```
We have to create the <strong>tabs.xml</strong></a> in the layouts of our android app. Have a look at the <a href="https://github.com/binomed/android_sandbox/blob/master/RpcTests/TestRpcAndroid/res/layout/tabs.xml" target="_blank">source code</a>

And we have to configure the AndroidManifest.xml with the activity and correct authorizations :

```xml AndroidManifest.xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.binomed.rpc"
    android:versionCode="1"
    android:versionName="1.0" >

    <uses-sdk android:minSdkVersion="4" />
    <uses-permission android:name="android.permission.INTERNET"/>

    <application
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name" >
        <activity
            android:name=".AndroidRpcProjectActivity" label="@string/app_name" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

We have to add the authorization <strong>"android.permission.INTERNET"</strong> in order to do the http calls with our server.  Let's now start to implement each solution


<h2>JSON  RPC</h2>
<h3>Required libraries</h3>
For Json RPC we need thoses libraries :
<ul>
	<li><a href="http://sourceforge.net/projects/java-json-rpc/files/" target="_blank">java-json-rpc.jar</a></li>
	<li><a href="http://logging.apache.org/log4j/1.2/download.html" target="_blank">log4j.jar</a></li>
	<li><a href="http://wiki.fasterxml.com/JacksonDownload" target="_blank">jackson-core and jackson-mapper</a></li>
</ul>
&nbsp;

We have to add thoses libraries in the both projects. <em><strong>Right Click -&gt; BuildPath -&gt; Configure Build Path -&gt; tab Libraries, button "add JARs..."</strong></em>

{% img /images/2012-03-15/libJsonRpc.jpg %}


&nbsp;
<h3>Server Side</h3>
Now let's create all classes used for the data transfer.

The communication between the two entities for this framework is based on proxy class generated by the framework. So we have to define an interface to offer services to client.  In order to the client could reuse this interface we have to create it in the shared folder on the server project.
```java
package com.binomed.client.rpc.javajsonrpc;

public interface IJavaJsonRpcService {

	JavaJsonRpcObjectA getMessage() throws JsonParseException, JsonMappingException, IOException;

	JavaJsonRpcObjectA getMessageWithParameter(JavaJsonRpcObjectB parameter) throws JsonParseException, JsonMappingException, IOException;

}
```
This interface use 2 classes  JavaJsonRpcObjectA and JavaJsonRpcObjectB which are classes that implement the previously seen interfaces. Those classes are serializable and are created on the shared folder on server side. The interface is<strong> mandatory</strong>. It is used also on the client side for the proxy.

```java
package com.binomed.client.rpc.javajsonrpc.dto;

public class JavaJsonRpcObjectA implements IObjectA {

	public JavaJsonRpcObjectA() {
		super();
	}

	private JavaJsonRpcObjectB objectB;

	private List listObjectB;

	private String name;

	@Override
	public JavaJsonRpcObjectB getObjectB() {
		return objectB;
	}

	@Override
	public void setObjectB(JavaJsonRpcObjectB objectB) {
		this.objectB = objectB;
	}

	@Override
	public List getListObjectB() {
		return listObjectB;
	}

	@Override
	public void setListObjectB(List listObjectB) {
		this.listObjectB = listObjectB;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

}
```
and

```java
package com.binomed.client.rpc.javajsonrpc.dto;

public class JavaJsonRpcObjectB implements IObjectBMap {

	public JavaJsonRpcObjectB() {
		super();
	}

	private String name;
	private int num;

	private HashMap map;

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public HashMap getMap() {
		return map;
	}

	@Override
	public void setMap(HashMap map) {
		this.map = map;
	}

	@Override
	public int getNum() {
		return num;
	}

	@Override
	public void setNum(int num) {
		this.num = num;

	}

}
```
Normally at this moment you should have this package herachy :

&nbsp;

{% img /images/2012-03-15/jsonClientServerShared.jpg %}


&nbsp;

&nbsp;

We now have to create the service on server side and configure it :

We create an implementation of our service on the main src folder of server :

&nbsp;

{% img /images/2012-03-15/jsonClientServerSrc.jpg %}


&nbsp;
```java
package com.binomed.server.rpc.javajsonrpc;

public class JavaJsonRpcService implements IJavaJsonRpcService {

	@Override
	public JavaJsonRpcObjectA getMessage() throws JsonParseException, JsonMappingException, IOException {
		JavaJsonRpcObjectB objB = new JavaJsonRpcObjectB();
		objB.setName("ObjectB");
		objB.setMap(new HashMap());
		objB.getMap().put("key", "value");

		JavaJsonRpcObjectA result = new JavaJsonRpcObjectA();
		result.setName("ObjectA");
		result.setListObjectB(new ArrayList());
		result.getListObjectB().add(objB);
		result.setObjectB(objB);

		return result;
	}

	@Override
	public JavaJsonRpcObjectA getMessageWithParameter(JavaJsonRpcObjectB parameter) throws JsonParseException, JsonMappingException, IOException {
		JavaJsonRpcObjectA result = new JavaJsonRpcObjectA();
		result.setName("WithParameter");
		result.setObjectB(parameter);

		if ((parameter != null) &amp;&amp; (parameter.getNum() &gt; 0)) {
			result.setListObjectB(new ArrayList());
			for (int i = 0; i &lt; parameter.getNum(); i++) {
				result.getListObjectB().add(parameter);
			}
		}

		return result;
	}

}
```
As you can see, the class isn’t a servlet, it is just a simple bean which implements the interface of our service. All the mapping is done in <strong>web.xml</strong>. Add this code in your web.xml :

&nbsp;
```xml
<!-- Java-Json-RPC -->
	
	<servlet>
	<servlet-name>JsonRpcServlet</servlet-name>
		<servlet-class>cz.eman.jsonrpc.server.JsonRpcServlet</servlet-class>
		<init-param>
			<param-name>javajsonrpc</param-name>
			<param-value>com.binomed.server.rpc.javajsonrpc.JavaJsonRpcService</param-value>
		</init-param>
	</servlet>
	<servlet-mapping>
		<servlet-name>JsonRpcServlet</servlet-name>
		<url-pattern>/jsonrpc/*</url-pattern>
	</servlet-mapping>
```
As you can see, the framework has it’s own servlet which manage all redirections. We have only to declare all services that we expose.

That’s all for the server ! pretty easy isn’t it ? Let’s have a look at the client side now.

<h3>Client Side</h3>
As said previously, the framework Java JSON RPC use a proxy system. The Proxy class have to inherit from <em><strong>cz.eman.jsonrpc.client.AbstractClientProxy</strong></em>

{% img /images/2012-03-15/jsonClientClientSrc.jpg %}


&nbsp;
```java
package com.binomed.rpc.javajsonrpc;

public class JavaJsonRpcServiceProxy extends AbstractClientProxy implements IJavaJsonRpcService {

	public JavaJsonRpcServiceProxy(ClientProvider clientProvider) {
		super(IJavaJsonRpcService.class, clientProvider);
	}

	@Override
	public JavaJsonRpcObjectA getMessage() throws JsonParseException, JsonMappingException, IOException {
		return (JavaJsonRpcObjectA) super.callMethod("getMessage", new Object[] {});
	}

	@Override
	public JavaJsonRpcObjectA getMessageWithParameter(JavaJsonRpcObjectB parameter) throws JsonParseException, JsonMappingException, IOException {
		return (JavaJsonRpcObjectA) super.callMethod("getMessageWithParameter", new Object[] { parameter });
	}

}
```
You have to specify the name of server method to call and manage parameters like in java introspection. For example : for a method without parameters you have to passed an empty array.

To call the server, you just have to instanciate the proxy with an instance of <strong>cz.eman.jsonrpc.client.HttpJsonClient</strong> and called it. You have to integrate this code in AsyncTask code

&nbsp;
```java
case JSON_RPC: {
	JavaJsonRpcServiceProxy proxy = new JavaJsonRpcServiceProxy(new HttpJsonClient(new URL(LOCALHOST + "/jsonrpc/javajsonrpc")));
	if (nbParams == -1) {
		result = proxy.getMessage();
	} else {
		JavaJsonRpcObjectB paramB = new JavaJsonRpcObjectB();
		paramB.setName("Name From Json RPC");
		paramB.setMap(new HashMap());
		paramB.getMap().put("key", "value");
		paramB.setNum(nbParams);
		result = proxy.getMessageWithParameter(paramB);

	}
	break;
}
```
As you can see the implementation is pretty simple.
<h2>Request Factory</h2>
All this part will be done by creating a project with <a href="http://code.google.com/intl/fr-FR/eclipse/docs/appengine_connected_android.html" target="_blank">appengine-android plugin</a> and removing all unnecessary code and libraries.
<h3>Required libraries and configurations</h3>
For Request Factory we need the
<ul>
	<li><a href="https://github.com/binomed/android_sandbox/blob/master/RpcTests/TestRpcAndroid/lib/requestfactory-client.jar?raw=true" target="_blank">requestfactory-client.jar</a> and <a href="https://github.com/binomed/android_sandbox/blob/master/RpcTests/TestRpcAndroid/lib/validation-api-1.0.0.GA.jar?raw=true" target="_blank">validation-api-1.0.0.GA.jar</a> for client part.</li>
	<li><a href="https://github.com/binomed/android_sandbox/blob/master/RpcTests/TestRpcAndroid/lib/validation-api-1.0.0.GA.jar?raw=true" target="_blank">validation-api-1.0.0.GA.jar</a> for server part.</li>
</ul>
The server have to be configure for GWT and AppEngine  : <em><strong>Rick Click -&gt;Properties -&gt;  Google -&gt; AppEngine (Use SDK 1.6.1)</strong></em> and <em><strong>Rick Click -&gt;Properties -&gt;  Google -&gt; Web Toolkit (Use 2.4)</strong></em>

If you want to use request factory you have to enable the gwt <a href="http://code.google.com/p/google-web-toolkit/wiki/RequestFactoryInterfaceValidation#ValidationTool" target="_blank">validation tools</a>. This is <span style="color: #ff0000;"><strong>mandatory for compilation and error resolution</strong></span>. Here is what you have to do for enabled this.
<h4>Validation Tools</h4>
On the both project you have to do this.

<em><strong>Rick Click -&gt; Properties -&gt; Java Compiler -&gt; Annotation Processing</strong></em>

You have to have the same screen as this :

&nbsp;

{% img /images/2012-03-15/validation-Tools.jpg %}


&nbsp;

Don't forget the <strong><span style="color: #ff0000;">key verbose, it is mandatory !</span></strong>

Now you have to referenced the factory path (path to jar that do the validation). On the same screen, click on "<strong>Factory Path</strong>" and choose the path to the jar "<strong>requestfactory-apt.jar</strong>" which is <em><strong>$YOUR_ECLIPSE_PATH/plugins/com.google.gwt.eclipse.sdkbundle_2.4.0.$NUMBER_OF_REVISION/gwt-2.4.0/requestfactory-apt.jar</strong></em>
<h3>Gwt configuration</h3>
As we are using the gwt plugin we have to delcare an <strong>entry point</strong> and an application :  Thoses classes are declared on the server side in the main <strong>src folder</strong> under <strong>com.binomed.server.requestfactory</strong>. See <a href="https://github.com/binomed/android_sandbox/blob/master/RpcTests/TestRpcAppEngine/src/com/binomed/server/requestfactory" target="_blank">the source</a> 
&nbsp;
<h3>Server Side</h3>
The request factory framework is based on interfaces.  Those interfaces are the exposed part of server to the client. So all this code is in the <strong>shared folder</strong>. All the implentations are only on the server side (src part)

The main interface inherits from<em><strong> RequestFactory</strong></em> and list all services (other interfaces) offered by the server. Each service is an interface. Each manipulated bean is exposed as an interface.
```java
package com.binomed.client.requestfactory;

public interface MyRequestFactory extends RequestFactory {

	@ServiceName("com.binomed.server.requestfactory.RequestFactoryObjectB")
	public interface HelloWorldRequest extends RequestContext {
		/**
		 * Retrieve a "Hello, World" message from the server.
		 */
		Request getMessage();

		InstanceRequest getMessageWithParameter();

	}

	HelloWorldRequest helloWorldRequest();

}
```
For this tutorial, our request factory only exposes one service HelloWorlRequest which has 2 methods.

As you can see there are annotations for specifying the implementation class of our service. The path describes the package and class name that implements the service.

```java
package com.binomed.client.requestfactory.shared;

@ProxyForName("com.binomed.server.requestfactory.RequestFactoryObjectA")
public interface RequestFactoryObjectAProxy extends ValueProxy {

	RequestFactoryObjectBProxy getObjectB();

	void setObjectB(RequestFactoryObjectBProxy objectB);

	List getListObjectB();

	void setListObjectB(List listObjectB);

	String getName();

	void setName(String name);

}
```
and

```java
package com.binomed.client.requestfactory.shared;

@ProxyForName("com.binomed.server.requestfactory.RequestFactoryObjectB")
public interface RequestFactoryObjectBProxy extends ValueProxy {

	String getName();

	void setName(String name);

	int getNum();

	void setNum(int num);

}
```
Those interfaces inherits from <a href="http://code.google.com/intl/fr/webtoolkit/doc/latest/DevGuideRequestFactory.html#valueProxies" target="_blank">ValueProxy</a> in order to the frameworks understand that it is a transportable bean. Those beans have some restrictions concerning their types : for example, you could not have the Map type. For more information, please have a look at this <a href="http://code.google.com/intl/fr-FR/webtoolkit/doc/latest/DevGuideRequestFactory.html#transportable" target="_blank">page</a>. As for the service, we have to specify the implementation class of our beans.

Normally you should have this structure :

&nbsp;

{% img /images/2012-03-15/requestFacotryClientServerShared.jpg %}
</a>

&nbsp;

&nbsp;

Now let's have a look to the implementations of thoses interfaces.

First we will look at the beans :
```java
package com.binomed.server.requestfactory;

public class RequestFactoryObjectA {

	public RequestFactoryObjectA() {
		super();
	}

	private RequestFactoryObjectB objectB;

	private List listObjectB;

	private String name;

	public RequestFactoryObjectB getObjectB() {
		return objectB;
	}

	public void setObjectB(RequestFactoryObjectB objectB) {
		this.objectB = objectB;
	}

	public List getListObjectB() {
		return listObjectB;
	}

	public void setListObjectB(List listObjectB) {
		this.listObjectB = listObjectB;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
```
and
```java
package com.binomed.server.requestfactory;

public class RequestFactoryObjectB {

	public RequestFactoryObjectB() {
		super();
	}

	private String name;
	private int num;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	/*
	 * 
	 * Service Part
	 */

	public static RequestFactoryObjectA getMessage() {

		RequestFactoryObjectB objB = new RequestFactoryObjectB();
		objB.setName("ObjectB");

		RequestFactoryObjectA result = new RequestFactoryObjectA();
		result.setName("ObjectA");
		result.setListObjectB(new ArrayList<RequestFactoryObjectB>());
		result.getListObjectB().add(objB);
		result.setObjectB(objB);

		return result;
	}

	public RequestFactoryObjectA getMessageWithParameter() {

		RequestFactoryObjectA result = new RequestFactoryObjectA();
		result.setName("WithParameter");

		RequestFactoryObjectB objB = new RequestFactoryObjectB();
		objB.setName(name);
		result.setObjectB(objB);

		if (num > 0) {
			result.setListObjectB(new ArrayList<RequestFactoryObjectB>());
			for (int i = 0; i < num; i++) {
				result.getListObjectB().add(objB);
			}
		}

		return result;
	}

}
```
You have noticed that the implementation of service is included in the bean.

The implementation of interface is not mandatory because you have specified on interfaces what are the implementation classes. Nothing else is needed. But you have not

&nbsp;

{% img /images/2012-03-15/requestFacotryClientServerSrc.jpg %}


&nbsp;

Finally we have to declare the servlet in <strong>web.xml</strong> :
```xml
<!-- Request Factory-->
	<servlet>
    <servlet-name>requestFactoryServlet</servlet-name>
	    <servlet-class>com.google.web.bindery.requestfactory.server.RequestFactoryServlet</servlet-class>
	    <init-param>
	      <param-name>symbolMapsDirectory</param-name>
	      <param-value>WEB-INF/classes/symbolMaps/</param-value>
	    </init-param>
	  </servlet>
	
	  <servlet-mapping>
	    <servlet-name>requestFactoryServlet</servlet-name>
	    <url-pattern>/gwtRequest</url-pattern>
	  </servlet-mapping>
```
If you’re code is not compiling, you maybe have to clean all your projects in order to refresh and be sure that the validation tools is well executed.
<h3>Client Side</h3>
The client side is pretty complex because you have to define utility classes for the communication.
<ul>
	<li>Utils :  Communication configuration and preparing generic service.</li>
	<li>AndroidRequestTransport : Class used for communication in requestFactory process</li>
</ul>

```java
package com.binomed.rpc.requestFactory;

/**
 * Utility methods for getting the base URL for client-server communication and retrieving shared preferences.
 */
public class Util {

	/**
	 * Tag for logging.
	 */
	private static final String TAG = "Util";

	// Shared constants

	/**
	 * Value for {@link #CONNECTION_STATUS} key.
	 */
	public static final String CONNECTING = "connecting";

	/*
	 * URL suffix for the RequestFactory servlet.
	 */
	public static final String RF_METHOD = "/gwtRequest";

	public static final String LOCALHOST = "http://10.0.2.2:8888"; //$NON-NLS-1$

	/**
	 * Creates and returns an initialized {@link RequestFactory} of the given type.
	 */
	public static  T getRequestFactory(Context context, Class factoryClass) {
		T requestFactory = RequestFactorySource.create(factoryClass);

		String authCookie = null;

		String uriString = LOCALHOST + RF_METHOD;
		URI uri;
		try {
			uri = new URI(uriString);
		} catch (URISyntaxException e) {
			Log.w(TAG, "Bad URI: " + uriString, e);
			return null;
		}
		requestFactory.initialize(new SimpleEventBus(), new AndroidRequestTransport(uri, authCookie));

		return requestFactory;
	}

}
```
and

```java
package com.binomed.rpc.requestFactory;

/**
 * An implementation of RequestTransport for use between an Android client and a
 * Google AppEngine server.
 */
public class AndroidRequestTransport implements RequestTransport {

    private final URI uri;

    private final String cookie;

    /**
     * Constructs an AndroidRequestTransport instance.
     *
     * @param uri the URI for the RequestFactory service
     * @param cookie the ACSID or SACSID cookie used for authentication
     */
    public AndroidRequestTransport(URI uri, String cookie) {
        this.uri = uri;
        this.cookie = cookie;
    }

    public void send(String payload, TransportReceiver receiver) {
        HttpClient client = new DefaultHttpClient();
        HttpPost post = new HttpPost();
        post.setHeader("Content-Type", "application/json;charset=UTF-8");
        post.setHeader("Cookie", cookie);

        post.setURI(uri);
        Throwable ex;
        try {
            post.setEntity(new StringEntity(payload, "UTF-8"));
            HttpResponse response = client.execute(post);
            if (200 == response.getStatusLine().getStatusCode()) {
                String contents = readStreamAsString(response.getEntity().getContent());
                receiver.onTransportSuccess(contents);
            } else {
                receiver.onTransportFailure(new ServerFailure(response.getStatusLine()
                        .getReasonPhrase()));
            }
            return;
        } catch (UnsupportedEncodingException e) {
            ex = e;
        } catch (ClientProtocolException e) {
            ex = e;
        } catch (IOException e) {
            ex = e;
        }
        receiver.onTransportFailure(new ServerFailure(ex.getMessage()));
    }

    /**
     * Reads an entire input stream as a String. Closes the input stream.
     */
    private String readStreamAsString(InputStream in) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream(1024);
            byte[] buffer = new byte[1024];
            int count;
            do {
                count = in.read(buffer);
                if (count &gt; 0) {
                    out.write(buffer, 0, count);
                }
            } while (count &gt;= 0);
            return out.toString("UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("The JVM does not support the compiler's default encoding.",
                    e);
        } catch (IOException e) {
            return null;
        } finally {
            try {
                in.close();
            } catch (IOException ignored) {
            }
        }
    }
}
```
Now let's have a look at the call of this service :

```java
case REQUEST_FACTORY: {
	Thread.currentThread().setContextClassLoader(mContext.getClassLoader());
	MyRequestFactory requestFactory = Util.getRequestFactory(mContext, MyRequestFactory.class);
	final HelloWorldRequest request = requestFactory.helloWorldRequest();
	if (nbParams == -1) {
		request.getMessage().fire(new Receiver() {
			@Override
			public void onFailure(ServerFailure error) {
				Log.e(TAG, "Failure with request factory request : " + error.getMessage());
				message = null;
			}

			@Override
			public void onSuccess(RequestFactoryObjectAProxy result) {
				JavaJsonRpcObjectA objA = new JavaJsonRpcObjectA();
				objA.setName(result.getName());
				if (result.getObjectB() != null) {
					JavaJsonRpcObjectB objB = new JavaJsonRpcObjectB();
					objB.setName(result.getObjectB().getName());
				}
				if ((result.getListObjectB() != null) &amp;&amp; (result.getListObjectB().size() &gt; 0)) {
					JavaJsonRpcObjectB objB = null;
					objA.setListObjectB(new ArrayList());
					for (RequestFactoryObjectBProxy objBProxy : result.getListObjectB()) {
						objB = new JavaJsonRpcObjectB();
						objB.setName(objBProxy.getName());
						objA.getListObjectB().add(objB);
					}

				}

				// message = result;
				message = objA;
			}
		});
	} else {
		RequestFactoryObjectBProxy parameterB = request.create(RequestFactoryObjectBProxy.class);
		parameterB.setName("Name from request factory");
		parameterB.setNum(nbParams);
		request.getMessageWithParameter().using(parameterB).fire(new Receiver() {
			@Override
			public void onFailure(ServerFailure error) {
				Log.e(TAG, "Failure with request factory request : " + error.getMessage());
				message = null;
			}

			@Override
			public void onSuccess(RequestFactoryObjectAProxy result) {
				JavaJsonRpcObjectA objA = new JavaJsonRpcObjectA();
				objA.setName(result.getName());
				if (result.getObjectB() != null) {
					JavaJsonRpcObjectB objB = new JavaJsonRpcObjectB();
					objB.setName(result.getObjectB().getName());
				}
				if ((result.getListObjectB() != null) &amp;&amp; (result.getListObjectB().size() &gt; 0)) {
					JavaJsonRpcObjectB objB = null;
					objA.setListObjectB(new ArrayList());
					for (RequestFactoryObjectBProxy objBProxy : result.getListObjectB()) {
						objB = new JavaJsonRpcObjectB();
						objB.setName(objBProxy.getName());
						objA.getListObjectB().add(objB);
					}

				}

				// message = result;
				message = objA;
			}
		});
	}
	result = message;
	break;
}
```
We have to use Reciever as for RPC mecanism in order to know when the server gives it’s response. The call of service is done by getting a proxy of service and by invocking the fire() method on it.<span style="color: #ff0000;"><strong> Warning : </strong></span>The call of a fire method is not asynchrone.

You have to notice that normaly Request Factory is very usefull for CRUD and is oriented to be a JPA framework for server. This could explain why there are so many configuration classes.
<h2>Restlet</h2>
<h3>Required libraries and configurations</h3>
For Rest we need to download <a href="http://www.restlet.org/downloads/2.1/restlet-gae-2.1rc3.zip" target="_blank">restlet-appEngine</a> and <a href="http://www.restlet.org/downloads/2.1/restlet-android-2.1rc3.zip" target="_blank">restlet-android</a>.

For the android side, we need the libraries available in previous zip file :
<ul>
	<li>org.restlet.jar</li>
	<li>org.restlet.ext.jackson.jar</li>
	<li>org.restlet.ext.httpclient.jar</li>
	<li>org.apache.commons.codec_1.5</li>
	<li>org.apache.httpclient_4.1</li>
	<li>org.apache.httpcore_4.1</li>
	<li>org.apache.httpmime_4.1</li>
	<li>org.apache.commons.logging_1.1</li>
	<li>org.apache.james.mime4j_0.6</li>
	<li>org.codehaus.jackson.core_1.9</li>
	<li>org.codehaus.jackson.mapper_1.9</li>
</ul>
For the appEngine , we need the libraries available in previous zip file :
<ul>
	<li>org.restlet.jar</li>
	<li>org.restlet.ext.jackson</li>
	<li>org.codehaus.jackson.core_1.9</li>
	<li>org.codehaus.jackson.mapper_1.9</li>
	<li>org.restlet.ext.json</li>
	<li>org.json_2.0</li>
	<li>org.restlet.ext.servlet</li>
</ul>
&nbsp;

We need all those libraries on android side due to a bug with the http client, so we have to add the httpclient extension.
<h3>Server Side</h3>
On the server side we need to configure the Restlet resources and beans.

The resources will be interfaces in order to be shared by client side. The beans will be simple serializable POJO. Those classes are on the shared folder
```java
package com.binomed.client.rest;

public interface IRestletService {

	@Get
	RestletObjectA getMessage() throws Exception;

}
```
and
```java
package com.binomed.client.rest;

public interface IRestletServiceParam {

	@Post
	RestletObjectA getMessageWithParameter(RestletObjectB parameter) throws Exception;

}
```
And will have 2 beans

&nbsp;
```
package com.binomed.client.rest.dto;

public class RestletObjectA implements IObjectA, Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	public RestletObjectA() {
		super();
	}

	private RestletObjectB objectB;

	private List listObjectB;

	private String name;

	public RestletObjectB getObjectB() {
		return objectB;
	}

	public void setObjectB(RestletObjectB objectB) {
		this.objectB = objectB;
	}

	public List getListObjectB() {
		return listObjectB;
	}

	public void setListObjectB(List listObjectB) {
		this.listObjectB = listObjectB;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
```

```java
package com.binomed.client.rest.dto;

public class RestletObjectB implements IObjectBMap, Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	public RestletObjectB() {
		super();
	}

	private String name;

	private int num;
	private HashMap map;

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public HashMap getMap() {
		return map;
	}

	@Override
	public void setMap(HashMap map) {
		this.map = map;
	}

	@Override
	public int getNum() {
		return num;
	}

	@Override
	public void setNum(int num) {
		this.num = num;

	}

}
```
&nbsp;

{% img /images/2012-03-15/restClientServerShared.jpg %}


&nbsp;

&nbsp;

Now let’s have a look at the implementation. With Restlet we need to declare a<strong> Rest Application</strong>. This application will list all resources in order to expose rest service on server. The application has to extends <strong>org.restlet.Application</strong>

&nbsp;
```java
package com.binomed.server.rest;

public class RestletApplication extends Application {

	/**
	 * Creates a root Restlet that will receive all incoming calls.
	 */
	@Override
	public Restlet createInboundRoot() {
		// Create a router Restlet that routes each call to a
		Router router = new Router(getContext());

		router.attach("/test", RestResource.class);
		router.attach("/testParam", RestResourceParam.class);

		return router;
	}

}
```
&nbsp;

And we have to declare the resources. A resource always herits from <strong>org.restlet.resource.ServerResource</strong>
```java
package com.binomed.server.rest;

public class RestResource extends ServerResource {

	@Get
	public RestletObjectA getMessage() throws Exception {
		RestletObjectB objB = new RestletObjectB();
		objB.setName("ObjectB");
		objB.setMap(new HashMap());
		objB.getMap().put("key", "value");

		RestletObjectA result = new RestletObjectA();
		result.setName("ObjectA");
		result.setListObjectB(new ArrayList());
		result.getListObjectB().add(objB);
		result.setObjectB(objB);

		return result;
	}

}
```
and
```java
package com.binomed.server.rest;

public class RestResourceParam extends ServerResource {

	@Post
	public RestletObjectA getMessageWithParameter(RestletObjectB parameter) throws Exception {
		RestletObjectA result = new RestletObjectA();
		result.setName("WithParameter");
		result.setObjectB(parameter);

		if ((parameter != null) &amp;&amp; (parameter.getNum() &gt; 0)) {
			result.setListObjectB(new ArrayList());
			for (int i = 0; i &lt; parameter.getNum(); i++) {
				result.getListObjectB().add(parameter);
			}
		}

		return result;
	}

}
```
We now have to declare the application in the <strong>web.xml</strong>
```xml
<!-- RESTLET -->
	
	 <servlet>
            <servlet-name>RestletServlet</servlet-name>
            <servlet-class>org.restlet.ext.servlet.ServerServlet</servlet-class>
            <init-param>
                    <param-name>org.restlet.application</param-name>
                    <param-value>com.binomed.server.rest.RestletApplication</param-value>
            </init-param>
    </servlet>

	<servlet-mapping>
		<servlet-name>RestletServlet</servlet-name>
		<url-pattern>/rest/*</url-pattern>
	</servlet-mapping>
```
&nbsp;

{% img /images/2012-03-15/restClientServerSrc.jpg %}


&nbsp;

Thats all for the server side.
<h3>Client Side</h3>
The client side is very easy to implement. We only have to instantiate some <strong>org.restlet.resource.ClientResource</strong> and get a proxy generated by the framework corresponding to our service. In order to deport the code complexity, we will create a class for managing all those configurations.

```java
package com.binomed.rpc.rest;

public class RestletAccesClass {

	private static ClientResource resource;
	private static ClientResource resourceWithParam;
	private static IRestletService service;
	private static IRestletServiceParam serviceWithParam;

	private static synchronized void init() {
		if (resource == null) {
			Engine.getInstance().getRegisteredConverters().add(new JacksonConverter());
			Engine.getInstance().getRegisteredClients().clear();
			Engine.getInstance().getRegisteredClients().add(new HttpClientHelper(null));
			resource = new ClientResource(AndroidRpcProjectActivity.LOCALHOST + "/rest/test");
			resourceWithParam = new ClientResource(AndroidRpcProjectActivity.LOCALHOST + "/rest/testParam");
			resourceWithParam.setRequestEntityBuffering(true);
			service = resource.wrap(IRestletService.class);
			serviceWithParam = resourceWithParam.wrap(IRestletServiceParam.class);
		}
	}

	public static RestletObjectA callService() throws Exception {

		init();

		RestletObjectA result = service.getMessage();

		return result;
	}

	public static RestletObjectA callServiceWithParam(int nbParams) throws Exception {
		init();

		RestletObjectB objB = new RestletObjectB();
		objB.setName("Name with Rest");
		objB.setNum(nbParams);
		objB.setMap(new HashMap());
		objB.getMap().put("key", "value");

		RestletObjectA result = serviceWithParam.getMessageWithParameter(objB);

		return result;
	}

}
```
&nbsp;

those lines :
```java
Engine.getInstance().getRegisteredConverters().add(new JacksonConverter());
Engine.getInstance().getRegisteredClients().clear();
Engine.getInstance().getRegisteredClients().add(new HttpClientHelper(null));
```
Are <span style="color: #ff0000;"><strong>mandatory</strong></span> dues to a bug in rest android client library. We have to force those parameters. As you can see the call of a restlet service is done by calling the method of interface on the generated proxy.

Finally, the integration code in our main Activity :

```java
case REST: {
	if (nbParams == -1) {
		result = RestletAccesClass.callService();
	} else {
		result = RestletAccesClass.callServiceWithParam(nbParams);

	}
	break;
}
```
&nbsp;
<h1>Tests and results</h1>
&nbsp;

All the results shown after were done with this configuration :
<ul>
	<li>Windows XP SP3</li>
	<li>Intel Core Duo 2.2Ghz</li>
	<li>2Go ram</li>
	<li>Eclipse Indigo with appEngine in local</li>
	<li>Android Emulator under Froyo</li>
</ul>
<h2>Apk Size</h2>
Now let’s look at the impact of each solution on the final size of the APK
<table class="binomed_table">
<tbody>
<tr>
<td></td>
<td><strong>Without Any Framework</strong></td>
<td><strong>Json</strong></td>
<td><strong>Request Factory</strong></td>
<td><strong>Rest</strong></td>
</tr>
<tr>
<td><em>Size</em></td>
<td>36 Ko</td>
<td>1.82 Mo</td>
<td>420 Ko</td>
<td>3.38 Mo</td>
</tr>
</tbody>
</table>
&nbsp;
<h2>Performant</h2>
Here is a comparative table for the average with different number of expected results.
<table class="binomed_table">
<tbody>
<tr>
<td><strong>Number of expected Results</strong></td>
<td><strong>Json</strong></td>
<td><strong>Request Factory</strong></td>
<td><strong>Rest</strong></td>
</tr>
<tr>
<td>1</td>
<td>177 ms</td>
<td>822 ms</td>
<td>632</td>
</tr>
<tr>
<td>10</td>
<td>169 ms and 17 ms / Obj</td>
<td>1167 ms and 117 ms / Obj</td>
<td>678 ms and 68 ms / Obj</td>
</tr>
<tr>
<td>100</td>
<td>377 ms and 3 ms / Obj</td>
<td>3300 ms and 33 ms / Obj</td>
<td>750 ms and 7 ms / Obj</td>
</tr>
<tr>
<td>1000</td>
<td>2644 ms and 3 ms / Obj</td>
<td>24831 ms and 24 ms / Obj</td> 
<td>1266 ms and 1 ms / Obj</td>
</tr>
<tr>
<td>10000</td>
<td>Out of memory Exception</td>
<td>Out of memory Exception</td>
<td>1167 ms and 117 ms / Obj</td>
</tr>
</tbody>
</table>
&nbsp;

&nbsp;
<h1>Conclusion</h1>
&nbsp;
<table class="binomed_table">
<tbody>
<tr>
<td>1:Bad -> 5:Perfect</td>
<td><strong>Json RPC</strong></td>
<td><strong>Request Factory</strong></td>
<td><strong>Rest</strong></td>
</tr>
<tr>
<td><em>Simplicity</em></td>
<td>5</td>
<td>3</td>
<td>5</td>
</tr>
<tr>
<td><em>Use complex objects</em></td>
<td>4</td>
<td>3</td>
<td>4</td>
</tr>
<tr>
<td><em>Effective</em></td>
<td>3</td>
<td>1</td>
<td>5</td>
</tr>
<tr>
<td><em>Impact on APK size</em></td>
<td>3</td>
<td>4</td>
<td>1</td>
</tr>
<tr>
<td><strong>Total</strong></td>
<td><strong>3.75</strong></td>
<td><strong>2.73</strong></td>
<td><strong>3.75</strong></td>
</tr>
</tbody>
</table>


To conclude, you have to study the best way with your own use cases, because all those solutions could be chosen.
&nbsp;
The <b>request factory</b> could be very useful if you want a solution with crud operations.
&nbsp;
The <b>rest</b> solution could be useful if you already have a rest server and if you want to manipulate a hudge quantity of objects. As you can notice, the response time is very low for a high number of POJOs. The Restlet team also says that they are working on an android solution with weightless integration.
&nbsp;
The <b>Java Json Rpc</b> be use for others cases.
&nbsp;
All code of this tutorial is available on my <a href="https://github.com/binomed/android_sandbox/tree/master/RpcTests" target="_blank">github</a>

Thank you to Benjamin who helps me for the redaction.