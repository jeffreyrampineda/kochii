# Kochii

[![Build Status](https://travis-ci.com/jeffreyrampineda/kochii.svg?branch=master)](https://travis-ci.com/jeffreyrampineda/kochii)

Assists and encourages individuals for a manageable meal preparation lifestyle

<p align="center">
    <a href="https://www.kochii.app">
        <img width="600" height="400" src="https://i.ibb.co/tBGVzKG/kochii-mockup.jpg" alt="Kochii preview">
    </a>
</p>

## Installation

```bash
# Installs server and client dependencies then builds the client
# for production to the `client/dist` folder
$ npm install
```

## APIs Required

You need the follow API keys:

* Sendgrid - https://sendgrid.com/
* FoodData Central (FDC) - https://fdc.nal.usda.gov/api-guide.html/

## Development

Create .env file with the following:

* MONGODB_URI=your_uri_string

* SECRET_KEY=your_secret_key

* SENDGRID_API_KEY=your_api_key

* FDC_API_KEY=your_api_key

* HOST_URL=http://localhost:3001

```bash
# starts client development server
# starts and monitor for any changes in the backend server
$ npm run dev
```

```bash
# Populates your database with basic data.
$ npm run util:populatedb <uri_string>
```

```bash
# Drops your entire database.
$ npm run util:dropdb <uri_string>
```

## Production

Set the following environment variables:

* MONGODB_URI=your_uri_string

* SECRET_KEY=your_secret_key

* SENDGRID_API_KEY=your_api_key

* FDC_API_KEY=your_api_key

* HOST_URL=your_host_url

```bash
# Installs server and client dependencies then builds the client
# for production to the `client/dist` folder
$ npm install

# Starts the server to serve both api and html
$ npm start
```
