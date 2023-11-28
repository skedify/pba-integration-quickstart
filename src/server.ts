import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { CreateContextRequest } from './context/create-context.request';
import { CreateContextResponse } from './context/create-context.response';
import { QualificationRequest } from './qualification/qualification.request';
import { QualificationResponse } from './qualification/qualification.response';

if (!process.env.PBA_API_BASE_URL || !process.env.PBA_CLIENT_ID || !process.env.PBA_CLIENT_SECRET) {
  throw new Error('Missing PBA_API_BASE_URL PBA_CLIENT_ID or PBA_CLIENT_SECRET environment variable.')
}

const PBA_API_BASE_URL = process.env.PBA_API_BASE_URL;
const PBA_CLIENT_ID = process.env.PBA_CLIENT_ID;
const PBA_CLIENT_SECRET = process.env.PBA_CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT || 4000;

async function startServer(): Promise<void> {
  const app = express();

  app.use(express.json());

  //===========================================================================//

  //==================================================//
  //   Using client credentials to call the PBA API   //
  //==================================================//

  async function createBookingContext() {
    console.log('');
    console.log('=== Creating a booking context ===');

    // This is where you would insert the data that you want to pass into the context
    const createContextRequest = {
      category: 'Djairho',
      customer: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@acme.com',
        reference: 'd9d08d81-a5e9-e205-abc5-c85171bf167a',
        location: {
          street: 'Main Street',
          house_number: '1',
          city: 'London',
          postal_code: '1111',
          country: 'United Kingdom'
        }
      },
      filters: [
        {
          listings: [
            '123'
          ]
        }
      ]
    } as CreateContextRequest;

    const axiosOptions = {
      headers: {
        'X-PBA-Client-Id': PBA_CLIENT_ID,
        'X-PBA-Client-Secret': PBA_CLIENT_SECRET
      }
    };
    return axios.post(PBA_API_BASE_URL + '/context', createContextRequest, axiosOptions)
      .then((response) => {
        return response.data as CreateContextResponse;
      }).catch((e) => {
        console.debug(e);
        console.error('  > Unable to create a context');
        return null;
      });
  }

  //============================//
  //   Creating a PBA context   //
  //============================//

  app.get('/start', async (req, res) => {
    const createContextResponse = await createBookingContext();
    if (createContextResponse) {
      const urls = [];
      if (createContextResponse.applicationInstanceUrl) {
        urls.push(`application_instance_url=${encodeURIComponent(createContextResponse.applicationInstanceUrl)}`);
      }
      if (createContextResponse.selfServicingUrl) {
        urls.push(`self_servicing_url=${encodeURIComponent(createContextResponse.selfServicingUrl)}`);
      }
      res.redirect(`/?${urls.join('&')}`);
    } else {
      res.redirect('/error');
    }
  });

  //===============================================//
  //   Handling a customer qualification request   //
  //===============================================//

  app.post('/qualification', async (req, res) => {
    if (!!CLIENT_ID && !!CLIENT_SECRET && (req.headers['x-ibm-client-id'] !== CLIENT_ID || req.headers['x-ibm-client-secret'] !== CLIENT_SECRET)) {
      res.status(401);
    } else {
      const qualificationResponse = await qualifyCustomer(req.body);
      if (qualificationResponse) {
        res.setHeader('Content-Type', 'application/json');
        res.json(qualificationResponse);
      } else {
        res.setHeader('Content-Type', 'application/json+problem');
        res.status(500);
        res.json({
          message: 'An unexpected error occurred'
        });
      }
    }
    res.end();
  });

  async function qualifyCustomer(req: QualificationRequest) {
    console.log('');
    console.log('=== Handling a customer qualification request ===');
    console.log('Input data:');
    console.log(req);

    // This is where you would execute custom business logic to determine the qualification response
    const purchaseValue = req.qualificationFields
      .filter(field => field.key === 'purchaseValue')
      .shift()?.value;
    return {
      qualificationScore: !!purchaseValue && +purchaseValue > 200000 ? 'A+' : 'B+'
    } as QualificationResponse;
  }

  //======================================//
  //   Displaying start and error pages   //
  //======================================//

  app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write(`<h1>Skedify PBA Integration Quickstart App</h1>`);
    if (req.query.application_instance_url || req.query.self_servicing_url) {
      if (req.query.application_instance_url) {
        res.write(`<a href="${req.query.application_instance_url}"><h3>Start the PBA with the initiated context</h3></a>`);
      }
      if (req.query.self_servicing_url) {
        res.write(`<a href="${req.query.self_servicing_url}"><h3>Start the PBA with the initiated context in self-service mode</h3></a>`);
      }
    } else {
      res.write(`<a href="/start"><h3>Initiate a PBA context</h3></a>`);
    }
    res.end();
  });

  app.get('/error', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(500);
    res.write(`<h4>An unexpected error occurred</h4>`);
    res.end();
  });

  app.listen(PORT, () => console.log(`=== 🔥 Running the app on http://127.0.0.1:${PORT} ===`));
};

startServer();
