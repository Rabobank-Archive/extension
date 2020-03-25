# Development
How to setup your dev environment:
   
  `cd ./azdo-extensions-compliancy-frontend/`

  `npm i`
  
  `npm start`

Your favourite browser should pop-up! You can now view in the browser. 
The index page doesn't contain anything. So go to: `/#releases ` . Some dummy data should pop up.

You may need to configure Chrome to accept a [locally signed certificate](https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000/#build-pipelines](http://localhost:3000/#build-pipelines) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

See the different [routes](src/index.tsx) for available reports.

### `npm run storybook`

Runs the storybook to read stories of the available components. Makes it possible to checkout (and test) a component in isolation.

## Develop in an Azure DevOps context
Create a `.env.development.local` file in the root of the repository, with the following content:
```
REACT_APP_USE_AZDO_SERVICE=false
REACT_APP_USE_AZDO_SDK=true
REACT_APP_USE_COMPLIANCYCHECKER_SERVICE=false
REACT_APP_USE_APP_INSIGHTS=false
HTTPS=true 

```
Be careful not to commit this file! (it's in `.gitignore`)

If you want to use real data (instead of dummy), change `REACT_APP_USE_AZDO_SERVICE=false` to `REACT_APP_USE_AZDO_SERVICE=true`.

Go to https://dev.azure.com/raboweb-test, navigate to one of the projects. You will see a `Dev: ` version of the extension tabs. These will load content from your local running version.

# References
- Azure DevOps Design system: https://azdevinternal.azureedge.net