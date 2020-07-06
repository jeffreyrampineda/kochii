# Kochii

Assists and encourages individuals for a manageable meal preparation lifestyle.
Project link: https://kochii.herokuapp.com/

![Kochii overview](https://raw.githubusercontent.com/jeffreyrampineda/kochii/master/client/src/assets/overview-preview.png?token=ACLJVFDL5N4ORXSINYR4KC27AJ55I)

## Installation

```bash
# Installs server and client dependencies then builds the client
# for production to the `client/dist` folder
$ npm install
```

## Development

Create .env file with the following:

* MONGODB_URI_development=your_uri_string

* SECRET_KEY=your_secret_key

* SENDGRID_API_KEY=your_api_key

* HOST_URL=http://localhost:3001

```bash
# starts client development server
# starts and monitor for any changes in the backend server
$ npm run dev
```

## Production

Set the following environment variables:

* MONGODB_URI_development=your_uri_string

* SECRET_KEY=your_secret_key

* SENDGRID_API_KEY=your_api_key

* HOST_URL=your_host_url

```bash
# Installs server and client dependencies then builds the client
# for production to the `client/dist` folder
$ npm install

# Starts the server to serve both api and html
$ npm start
```
