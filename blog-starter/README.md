# CPSC113 Blog Starter

Teams in CPSC113 will turn in their weekly updates by keeping a blog. This is
a starter blog for you. It accomplishes a few things:

* All data is kept in flat files so you can keep them under version control
  and so that we can comment easily on your progress via your repository
  hosted at [http://git.yale.edu](git.yale.edu).
* The application can be deployed to Heroku.
* The application allows only your team and the instructors to view it and
  relies on Yale CAS authentication to do that.

## Editing your blog

To start, you'll need to clone (or "fork") this repository on GitHub or
git.yale.edu. Then you should clone it to your development machine.

To run the application, you'll need [Node](https://nodejs.org/en/) installed.
We recommend version v4.2.4LTS. Once you have node installed, cd into the
`blog-starter` directory and install the node dependencies:

  npm install

Then, you can install the client-side dependencies with

  ./node_modules/.bin/bower install

Then, you can run the application with the following command:

  node index.js

If you're going to do a lot of editing, you might prefer to run it with
nodemon, which will restart the server every time your source files change.

  PORT=4000 ./node_modules/.bin/nodemon -e 'js,html,yaml,css' index.js

To update the blog, you'll be editing and adding `.yaml` files in the
`data/updates` directory. Before you get into that, you'll likely want
to customize `data/team.yaml` to correspond to your team, rather than
the demo data with which we've populated it.

## Deploying your blog

Go to herokuapp.com and log in or register an account if you have not already done so.
Go to the following link https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction for a helpful tutorial on how to deploy your blog to Heroku.

* Make sure you have the Heroku Toolbelt installed; after installing, you will be able to use Heroku's suite of commands in your terminal.
* Start by logging in:

`heroku login`

* Then create an app on Heroku: `heroku create`, and it'll generate a random name for your app for you unless you add params like `heroku create blah`, and it'll create blah.herokuapp.com for you.
* Then deploy the code: `git push heroku master`
* You can now access your site by opening the link (eg blah.herokuapp.com) in your browser or by typing `heroku open` on your command line.
