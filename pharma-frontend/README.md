# WooCentral Frontend

## Setup (Please Follow the setup guidelines)

- Clone the repo
- Run `nvm use`
- Run `yarn setup`.
- Run `yarn dev` to run the dev server locally.
- Open the project at `http://localhost:3000`

## Env

- Create a file called `.env` and set theese values:

```env
VITE_API_URL=https://api-dev.most.win/v1
VITE_NODE_ENV=development
```

## Commit Guidelines

- Don't push your code directly into `master` branch. Even if you have to change a single line of code, create a new branch and create a PR to get it merged into master.

- DO NOT commit your code if it contains errors or warnings.

- If `pre-commit` hook is failing and not letting you commit your code, there's a reason for that. DO NOT skip the `pre-commit` hook.

## Variable Names

Variables should have long descriptive names. The names should convey the type and the purpose of the varialbe.

- Always start the function names with small letters except if they are React Components e.g. `authenticate` instead of `Authenticate`.
- Function names should be verbs and not nouns.
- Booleans should always start with is, has, should etc. for example `isAuthenticated`, `shouldUserHaveAccess`.
- Variables should be nouns e.g `config`, `apiCredentials` etc.

## Testing

- Each PR needs to have at least a unit test for it to be merged. Write your unit tests using React Testing Library.
- Unit tests should be kept right alongside the Components files.
- To run unit tests use this command `npm t`.
- A complete feature should have a Cypress Test.
- For running Cypress Tests run `npm run cypress:open`

## Libararies

- Material UI for Components
- React Query for Data Fetching ( No Redux, and please _**DO NOT**_ add it ).
