# Skedify PBA Integration Quickstart App

An example app that illustrates how to integrate with the Skedify PBA. Written in Node.js.

## Table of contents

* [What the app does](#what-the-app-does)
* [Prerequisites](#prerequisites)
* [Usage](#usage)

## What the app does

1. **Create a booking context**

   A booking session can be initiated starting from an external CRM or dialer system. This system can create a context, containing information about the customer (e.g. data originating from the CRM) as well as information about the booker and any other contextual information. For example, the context might contain the name, phone number and email address of the customer.
   
   A context can contain any information that is relevant for the booking session and is not restricted to specific data fields or data types. The Partner Booking Application instance can be configured to interpret the context and also provide parts of it when performing customer qualification.
   
   A context is created by making a HTTP POST request to the `/context` endpoint on the PBA API containing a JSON object with a structure of your choice.

   From this context, the booking category can be derived if the context has the category field containing the category key that matches one of the configured booking categories in the Partner Booking application instance. Furthermore, the context contents can also be mapped to interpretable attributes by configuring fields in the Partner Booking Application instance with corresponding keys.
   
   Any data, provided in the context, that cannot be matched with an interpretable attribute will still be stored as metadata.

   After the context is created, the API will respond with URLs that can be used to initiate a booking session using the created context. The app will show links to those URLs, allowing the start of a booking flow with the initiated context.

1. **Customer qualification**

   To determine the desired booking possibilities and restrictions for a specific customer, it is possible to perform a qualification step which integrates with a configurable qualification engine on the client side. This qualification engine can be called with (parts of) the contextual information of the booking session. This way, it is possible to gather all required information necessary for the customer qualification and provide them to the qualification engine.

   The dummy qualification engine contained in this app (on the `/qualification` endpoint) logs the input data and responds to a customer qualification request with a fixed qualification score. It is also possible to return specific filters that should be used to restrict the booking possibilities.

   > Note: the countryCode must be a valid ISO 3166-1 alpha-2 code.
   
   Additional data can be provided in the qualification response and will just be stored as metadata on the context.
   
## Prerequisites

Before running the quickstart app, make sure you have:

1. The tools required to run using the method of your choice:
   - Option 1: Running locally using Node.js: [Node.js (>=20)](https://nodejs.org)
   - Option 2: Running in a Docker container: [Docker (>=24.0.6)](https://docs.docker.com/install/)
2. A client ID and secret for interacting with the Skedify PBA API

## Usage

1. **Create environment variables file**
   ```sh
   cp .env.example .env
   ```
2. **Assign the correct values for all variables**

3. **Build and run the app**

   When running locally using Node.js:
   ```sh
   # install dependencies
   npm install

   # start application
   npm run start
   ```
   
   When running in a Docker container:

   ```sh
   # build Docker image
   docker build -t skedify/pba-integration-quickstart .

   # run Docker image
   docker run -p 4000:4000 -e PBA_API_BASE_URL=$PBA_API_BASE_URL -e PBA_CLIENT_ID=$PBA_CLIENT_ID -e PBA_CLIENT_SECRET=$PBA_CLIENT_SECRET -e CLIENT_ID=$CLIENT_ID -e CLIENT_SECRET=$CLIENT_SECRET skedify/pba-integration-quickstart
   ```

4. **Browse to** `http://127.0.0.1:4000`
