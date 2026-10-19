import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tools Hub API - Bijesh Sharma (bijeshsharam.com.np)',
      version: '1.0.0',
      description: `
**Free Online Tools Hub API Documentation**
Comprehensive backend services supporting developer utilities, Nepal localization, document processing, SSRF-safe web inspect tools, and AI mini-assistants.

- Personal Brand: [bijeshsharam.com.np](https://bijeshsharam.com.np)
- Privacy First: Zero retention of user tokens or sensitive files.
- Enterprise-grade SSRF protection on all external inspection endpoints.
      `,
      contact: {
        name: 'Bijesh Sharma',
        url: 'https://bijeshsharam.com.np',
        email: 'contact@bijeshsharam.com.np'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Local Server'
      },
      {
        url: '/api',
        description: 'Relative API Base'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token for authenticated endpoints'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'Custom API Key for Pro / Enterprise Tier'
        }
      }
    },
    tags: [
      { name: 'System', description: 'Health check, system metrics and uptime' },
      { name: 'Nepal Tools', description: 'BS <-> AD Date Conversion, Devanagari, NPR to Words, Provinces & Districts' },
      { name: 'Web & SEO Tools', description: 'SSRF-protected URL inspection, Meta Tags, Headers, DNS analyzer' },
      { name: 'Developer & Security', description: 'Cryptographic hashing, Secret scanning, Password entropy, SQL formatting' },
      { name: 'AI Mini Tools', description: 'Document summarizer, Code explainer, Email & quotation assistant' },
      { name: 'Auth & Pro Tier', description: 'API key generation, usage tracking and subscription tier simulation' }
    ]
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

export const swaggerSpec = swaggerJsdoc(options);
