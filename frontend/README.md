# DnaStorageSimulator

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.2.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Backend URL configuration

Copy .env.example to .env in this directory and set BACKEND_URL (for example, http://localhost:3000).
Run npm start or npm run build. The npm scripts use Node's built-in loadEnvFile to load .env and generate src/environments/environment.ts. Do not edit that generated file manually.
An existing BACKEND_URL environment variable takes precedence over .env, so CI can supply the value directly without a .env file. Missing or invalid values stop the build.
Restart npm start after changing .env; deployed builds must be rebuilt. Only BACKEND_URL is included in the frontend bundle, where it is public.
Use npm run ng -- <command> instead of invoking ng directly to run the environment loader first.
