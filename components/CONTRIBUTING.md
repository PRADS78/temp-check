# Contributing

Generally we develop components with the Storybook, but you can also the run the example app to test your changes.

## Running the library with Storybook

1. Run `npm run storybook`
2. Modify your component and see the changes in the storybook

## Running the library with the example app

1. Run `npm start`
2. Run `npm run example` in a separate terminal
3. Modify/Add your component code inside the src folder
4. Export your component in index.js
5. Import it in the `example/App.js`, example:
   > import {YourComponent} from '@disprz/**components**'
6. Your new component should be visible in the example app

## Running the library with Module Federation

1. Run `npm run start:federation`
2. Modify/Add your component code inside the src folder
3. Export your component in `src/remote.js`
4. If you want to use the **dev** version of components via federation, you can use this URL - `disprzComponents@http://localhost.disprz.com:3002/remoteEntry.js`
5. If you want to use the **prod** version of components via federation, you can use this URL - `disprzComponents@https://disprzmicrofrontend.disprz.com/disprz-components/${version}/remoteEntry.js`

## Linting

1. Install & Configure Eslint, Stylelint on your editor
2. Configure it execute on saving the file

> Example: Linters force you develop using logical CSS

## Tests

### Writing Unit Tests

1. Create {componentName}.test.js file in the current folder you're working on
2. Run `npm run test:watch` to watch your tests
3. Then run `npm run test:coverage` to generate the coverage report, make sure you reached 90% for the tests you wrote (PR cannot be accepted if it's less than 90%)

### Writing Visual Tests

1. Create {componentName}.e2e.test.js file in the current folder you're working on
2. Run `npm run test:e2e` to watch your tests

## Commit your Changes

1. Make sure you all the tests have passed and linting has been followed before committing your changes or you won't be able to commit your changes (They are validated on the Pull Request as well)

## Deploying components

1. Run `npm version` followed by (one of patch, minor, major, prepatch, preminor, premajor, prerelease)
2. Followed by commit message using `-m "message"`
3. Run `npm publish --tag="tag"` with the tag you want to publish

Example to publish a beta version

> npm version prerelease --preid=beta -m "Bug fixes for DatePicker"
> npm publish --tag=beta

Example to publish to latest version

> npm version patch -m "bug fixes for DatePicker"
> npm publish
