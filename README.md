# Unsplash Slash Command for Mixmax


This is an open source Mixmax Slash Command.
See <http://sdk.mixmax.com/docs/tutorial-giphy-slash-command> for more information about
how to use this example code in Mixmax. Credit to the Mixmax team for my modifying their base README.


## Running locally
### Before doing any of this, you must register a developer account and an app at [unsplash.com/developers](https://unsplash.com/developers)

1. Install using `npm install`
2. Create a .env file in your root directory with the following format:
  ```
  PORT=5000
  UNSPLASH_APP_ID=<your_unsplash_app_id>
  UNSPLASH_APP_SECRET=<your_unsplash_app_secret>
  UNSPLASH_APP_CALLBACKURL=<your_unsplash_callback_url>
  ```
3. Run using `npm start`
4. Add a Mixmax Slash Command in your Mixmax dashboard. (Call it unsplashsearch, or whatever you'd like) Using:<br>
   Typeahead API URL: https://localhost:5000/typeahead<br>
   Resolver API URL: https://localhost:5000/resolver
5. Quit Chrome and restart it using the following command on OS X: `open -a Google\ Chrome --args --ignore-certificate-errors`. See [here](http://developer.mixmax.com/docs/integration-api-appendix#local-development-error-neterr_insecure_response) for why.
6. Compose an email in Gmail using Mixmax and type /unsplashsearch [Search]
(or whatever you called it above)