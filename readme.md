# Blog API

A small blog backend I built with Node, Express and MongoDB. You can sign up, log in and then create / read / update / delete articles. Passwords are hashed with bcrypt and login gives you a JWT.

## Running it

```
npm install
npm run dev     # nodemon
npm start       # plain node
```

You need a `.env` file in the root. I put an example in `.env.example` so just copy it:

```
cp .env.example .env
```

then fill in your own values:

```
PORT=3000
MONGODB_URI=your mongo connection string
JWT_SECRET=some long random string
```

If you forget one the server won't start, it'll tell you which ones are missing (see `src/config/env.js`). I did this because before it would start fine and then crash later on the first login, which was annoying to debug.

## Folder layout

```
src/
  app.js          express app + routers
  index.js        connects to db and starts the server
  config/         db connection + env check
  controllers/
  middlewares/    logger, error handler, requireAuth
  models/
  routes/
  utils/          bcrypt helpers
  validators/     joi validation
```

## Endpoints

Base url is `http://localhost:PORT`

### Users

| Method | Endpoint | Auth | What it does |
|--------|----------|------|--------------|
| POST | `/api/user/sign-up` | no | create an account |
| POST | `/api/user/login` | no | log in, returns user + token |

Sign up body:
```json
{ "name": "Jonathan", "email": "jon@example.com", "password": "123456" }
```
(name 3-30 chars, valid email, password at least 6 chars)

Login body:
```json
{ "email": "jon@example.com", "password": "123456" }
```

The token lasts 7 days.

### Articles

Every article route needs the token, send it in the header:
`Authorization: Bearer <your token>`

| Method | Endpoint | Auth | What it does |
|--------|----------|------|--------------|
| POST | `/api/articles` | yes | create an article |
| GET | `/api/articles` | yes | get all articles (newest first) |
| GET | `/api/articles/search?q=keyword` | yes | search articles by keyword |
| GET | `/api/articles/:id` | yes | get one article |
| PUT | `/api/articles/:id` | yes | update your own article |
| DELETE | `/api/articles/:id` | yes | delete your own article |

Create body (title at least 5 chars, content at least 20). The author is set from your token automatically:
```json
{ "title": "My first post", "content": "This is the content of my first post." }
```

Update body, send only what you want to change. You can only change title and content, the author can't be changed:
```json
{ "title": "New title" }
```

### Who can edit what

Anyone logged in can read all articles, but only the author can update or delete their own. If you try it on someone else's article you get:

- `403` `You can only edit your own articles` (PUT)
- `403` `You can only delete your own articles` (DELETE)

`404` means the article doesn't exist, `401` means your token is missing, wrong or expired.

Pagination works on the get-all and search endpoints with `?page=1&limit=10`.
# Built by Jonathan Adewale :Roodie77