# oidc-auth-js

Libreria para autenticación sobre OpenID Connect

## Instalación

npm install oidc-auth

## Funciones

### setGeneral(token_url):
Es el método que recibe como parámetro un objeto el cual es usado por lo demás metodos de la libreria, el objeto debe tener la siguiente estructura:

       var token_url = {
    	    AUTORIZATION_URL: //url de autorización del servidor con OIDC ,
    	    CLIENTE_ID:  //client_id de la aplicación,
    	    REDIRECT_URL:  //url de la aplicación a la que se desea redireccionar despues del login,
    	    RESPONSE_TYPE:  "id_token token", //tipo de respuesta para el flujo implicito
    	    SCOPE:  "openid", //datos a los que requiere acceder el sp (service provider)
    	    BUTTON_CLASS:  "btn btn-warning btn-sm",
    	    SIGN_OUT_URL:  //url para logout,
    	    SIGN_OUT_REDIRECT_URL:  //url para redirección despues del logut,
    	    SIGN_OUT_APPEND_TOKEN:  "true",
    	        	    }
### live(flag): 
Es el método que verifica que el token se encuentra vigente (retorna true), y en caso de que flag sea false redirige a la url para realizar el inicio de la sesión.

### getPayload():
Es el método que permite obtener el objeto del token decodificado.

### liveToken():
Es el metodo que setea las cabeceras del bearer

### getAuthorizationUrl():
Es el metodo que arma y redirige a la url para el inicio de sesion.

### logout():
Es el método que realiza el logout o cierre de sesión del usuario.