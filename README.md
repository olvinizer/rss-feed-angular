# RSS FEED Angular
RSS Feed example with Angular. For users storage used Local Storage.


Prerequisites
  * Node.js, npm
	
Launch compiled bundle
  1. Install Angular http server
    	* npm install -g angular-http-server
  2. Start Angular server in /dist folder
		* angular-http-server --path ./dist -p 8882
  3. Open web browser http://localhost:8882
  4. Optionaly /dist folder can be copied under root folder of your own web server (url rewrite must be enabled for correct navigation)

Launch from sources
  1. Install Angular
    	* npm install -g @angular/cli
  2. Initialize Angular project
		* ng new angular
  3. Overwrite folders and files from /src folder
  4. Start web server
		* ng serve
		
Folders structure
  * /dist - compiled bundle
  * /src - Angluar source files
    * /app/components - main user's business logic
      * feed - display feed news and top 10 words in feed
      * login - login page
      * register - registration page with email existance check
      * pagination - pagination helper
		* /app/helpers - additonal services
			* auth-guard - authorization helper, checks if user is logged in and redirects if necessary
			* backend - backend server mockup
			* common50 - common english words from Wiki
		* /app/models - data modela and its logic
			* atom-entry - represents feed entry model
			* atom-feed - represents feed model and contains feed parsing logic
			* top-word - represetns top word
		* /app/services - services to interact with backend
			* authentification - login and logout user
			* local-storage - facade to work with Local Storage
			* users - users data 
		* /assets - contains feed XML for backend mockup
	
