

    var mqtt;
    var reconnectTimeout = 5000;

    function MQTTconnect() {
	if (typeof path == "undefined") {
		path = '/mqtt';
	}
	mqtt = new Paho.MQTT.Client(
			host,
			port,
			path,
			"web_" + parseInt(Math.random() * 100, 10)
	);
        var options = {
            timeout: 3,
            useSSL: useTLS,
            cleanSession: cleansession,
            onSuccess: onConnect,
            onFailure: function (message) {
                $('#status').val("Connection failed: " + message.errorMessage + "Retrying");
                setTimeout(MQTTconnect, reconnectTimeout);
            }
        };

        mqtt.onConnectionLost = onConnectionLost;

        if (username != null) {
            options.userName = username;
            options.password = password;
        }
        console.log("Host="+ host + ", port=" + port + ", path=" + path +
		 " TLS = " + useTLS + " username=" + username + 
		" password=" + password + " clientID=" + clientID);
        mqtt.connect(options);
    }

    function onConnect() {
        console.log('Connected');
	// connected - publish birth certificate
 	var message = new Paho.MQTT.Message("online");
  	message.destinationName = status_topic;
 	mqtt.send(message);

    }

    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);
        $('#status').val("connection lost: " + response.errorMessage + ". Reconnecting");

    };



    function loaded() {
	// change the publish topics according to the application instance we're in (speechly or watson)
	status_topic = status_topic.replace('\?',application)
	event_topic = event_topic.replace('\?',application)
        console.log('connecting to MQTT');
        MQTTconnect();
    
    };


	function sendMessage(event) {
 		var message = new Paho.MQTT.Message(JSON.stringify(event));
  		message.destinationName = event_topic;
 		mqtt.send(message);
	}




// end
