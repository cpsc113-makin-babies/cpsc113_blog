'use strict';
var cas = require('./cas.js');
var session = require('client-sessions');
var nunjucks = require('nunjucks');
var markdown = require('nunjucks-markdown');
var marked = require('marked');
var compression = require('compression');
var loadData = require('./data.js');


// Create a markdown renderer that only renders the
// inline markdown elements, not block elements.
var markdownInlineRenderer = new marked.Renderer();
(function () {
  var returnText = function(text, level){return text};
  var blockLevelElements = [
    'code', 'blockquote', 'html', 'heading', 'hr', 'list', 'listitem',
    'paragraph', 'table', 'tablerow', 'tablecell'
  ];
  blockLevelElements.forEach(function(el){
    markdownInlineRenderer[el] = returnText
  });
}());


module.exports = function(app, host, port, sessionSecret){

  var nunjucksEnv = nunjucks.configure('views', {
      autoescape: true,
      express: app,
      watch: true
  });
  markdown.register(nunjucksEnv, marked);
  nunjucksEnv.addFilter('render', function(content){
    return nunjucksEnv.renderString(content, this.ctx);
  })
  nunjucksEnv.addFilter('inlineMarkdown', function(content){
    return marked(content, {renderer: markdownInlineRenderer}).replace(/^<p>(.*)<\/p>\n*$/, "$1");
  })
  // Load our Yaml files and make the resulting
  // data available whenever we render a template.
  var data = loadData();
  nunjucksEnv.addGlobal('data', data);
  app.locals.data = data;
  app.use(compression());


  // Set up an Express session, which is required for CASAuthentication.
  // 1 week duration, extended by a week each time they log in.
  var duration = 24 * 60 * 60 * 7 * 1000;
  app.use( session({
      cookieName: 'session',
      secret: sessionSecret,
      duration: duration,
      activeDuration: duration
  }));

  var auth = cas(host, port);

  // This route will de-authenticate the client with the Express server and then
  // redirect the client to the CAS logout page.
  app.get( '/logout', auth.logout );

  // All other routes require CAS authorization
  app.use(auth.bounce);

  // Get the homepage
  app.get('/', function (req, res) {
    res.render('index.html', {});
  });

  function getUpdateContext(updateKey){
    var update = app.locals.data.updates[updateKey];
    if (!update) {
      return null;
    }
    return {
      updateKey: updateKey,
      update: update.update,
      canvas: update.canvas,
    };
  }

  function getUpdateDetailController(template){
    return function (req, res) {
      var context = getUpdateContext(req.params.updateKey);
      if(!context){
        res.status(404).end();
      }else{
        res.render(template, context);
      }
    }
  }

  function getConversationContext(conversationSlug) {
    var conversation = app.locals.data.conversations[conversationSlug];
    if (!conversation) {
      return null;
    }
    return {
      conversationSlug: conversationSlug,
      conversation: conversation
    }
  }

  function getConversationDetailController(template) {
    return function (req, res) {
      var context = getConversationContext(req.params.conversationSlug);
      if(!context){
        res.status(404).end();
      } else {
        res.render(template,context);
      }
    }
  }



  // Get a particular update
  app.get('/updates/:updateKey', getUpdateDetailController('update.html'));
  app.get('/updates/:updateKey/canvas', getUpdateDetailController('canvas.html'));

  // Get all conversations
  app.get('/conversations', function (req, res) {
    res.render('conversations.html', {});
  });

  // Get particular conversation
  app.get('/conversations/:conversationSlug', getConversationDetailController('conversation.html'));
}
