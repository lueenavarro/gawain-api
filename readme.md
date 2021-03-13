### Getting Started

1. Run the development server:

```bash
npm run dev
```

2. Open http://localhost:5000

#### Serverless

If you want, you can run the application using serverless

1. Run `npx netlify dev -p 5000`

2. Open http://localhost:5000/.netlify/functions/index

<hr>

### Testing

To run the jest unit tests:

```
npm run test
```

<hr>

### Environment Variables

The API accepts at mongodb database, collections are synced automatically.

| variable | default                           |
| -------- | --------------------------------- |
| DB_URI   | mongodb://localhost:27017/onestep |

<hr>

### Deployment

Application link: https://onestep-api.netlify.com//.netlify/functions/index

The code will automatically be deployed for every changes pushed to the main branch.
