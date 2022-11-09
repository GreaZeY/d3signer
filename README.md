
#                                       [Pendant Maker](https://next-pendant-maker.netlify.app/)


### Run in development mode
* Clone the repository
* Node version `14.x.x` and npm version `8.x.x`
* Install pnpm if you havn't already by running `npm i pnpm -g`
* Install the dependencies by `pnpm install`
* Run in development mode by `pnpm run dev`
* Your app will run on http://localhost:3000

### To create your Production Build
*  `pnpm run build`


### Steps to deploy by using dockererized container
##### First you must have docker installed on your machine [click here](https://docs.docker.com/engine/install/) to install docker
* Create a docker build by using this command `docker build -t <your_app_name> .`
* Expose your app's port to host's port `docker run --name CLIENT_CONTAINER -p 0.0.0.0:5000:3000 <your_app_name>`








