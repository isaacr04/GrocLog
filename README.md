# GrocLog

A web-based application for tracking grocery purchases and visualizing statistics like total spend per month, most frequented locations or indiviudal items, and price trends for your groceries.

The JavaScript web app is implemented with `node.js` and `express` to deploy and handling routing for an `nginx` server. Database management uses `mongoose` to interface with a MongoDB server.

Package Dependencies:
```
        "bcrypt": "^6.0.0",
        "body-parser": "^1.20.3",
        "cookie-parser": "^1.4.7",
        "cors": "^2.8.5",
        "express": "^4.21.2",
        "flatpickr": "^4.6.13",
        "jsonwebtoken": "^9.0.2",
        "mongoose": "^8.16.0",
        "mongoose-sequence": "^6.0.1",
```

To host the web app, `nginx` must be configured to allow the routes `/api`, `/itemlog`. `/admin`, and `/analytics`.
