WorldCubeAssociation = {};

// Request World Cube Association credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
WorldCubeAssociation.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'worldcubeassociation'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();
  //<<<var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  //<<<var display = mobile ? 'touch' : 'popup';

  var scope = "email";
  if (options && options.requestPermissions)
    scope = options.requestPermissions.join(',');

  config.loginStyle = "popup";//<<< force OAuth._redirectUri() to not append ?close >>>

  var loginStyle = OAuth._loginStyle('worldcubeassociation', config, options);

  var loginUrl =
        'https://www.worldcubeassociation.org/oauth/authorize?client_id=' + config.appId +
        '&redirect_uri=' + OAuth._redirectUri('worldcubeassociation', config) +
        //<<<'&display=' + display + '&scope=' + scope +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken) +
        '&response_type=code';

  OAuth.launchLogin({
    loginService: "worldcubeassociation",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};
