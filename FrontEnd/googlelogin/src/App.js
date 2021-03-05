import React,{ Component } from 'react';
import GoogleLogin from 'react-google-login';

class App extends Component {

  responseGoogle = (response) => {
    console.log(response);
  }
  render( ) {
    return (
      <div>
      <GoogleLogin
      clientId="858168514681-s19l2g4j8bah3bavlv3iu2jquddfjvme.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={this.responseGoogle}
      onFailure={this.responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
      </div>
    );
  }
  
}

export default App;
