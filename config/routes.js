var async = require('async'),
    users = require('../app/controllers/users.js'),
    getUser = require('../app/controllers/api/getUser.js'),
    getRoommate = require('../app/controllers/api/getRoommate.js'),
    getQuestions = require('../app/controllers/api/getQuestions.js'),
    setUserQA = require('../app/controllers/api/setUserQA.js'),
    setUserRoommates = require('../app/controllers/api/setUserRoommates.js'),
    setUserPref = require('../app/controllers/api/setUserPref.js'),
    https = require('https');

var permissions = [ 'email',
                    'user_about_me',
                    // 'user_relationship_details',
                    'user_status',
                    // 'user_website',
                    'user_groups',
                    // 'user_photos',
                    // 'user_relationships',
                    'user_work_history',
                    // 'user_hometown',
                    'user_friends',
                    'user_activities',
                    // 'user_education_history',
                    // 'user_religion_politics',
                    'user_events',
                    'friends_about_me',
                    'friends_activities',
                    'friends_birthday',
                    'friends_interests',
                    'friends_relationships',
                    'friends_work_history',
                    'friends_events',
                    'user_actions.books',
                    'user_actions.video',
                    'user_actions.music',
                    'friends_actions.news',
                    'friends_education_history',
                    // 'friends_religion_politics',
                    // 'friends_subscriptions',
                    'friends_status',
                    // 'friends_hometown',
                    // 'friends_photos',
                    // 'friends_website',
                    // 'user_videos',
                    // 'friends_videos',
                    // 'user_questions',
                    // 'friends_questions',
                    'user_birthday',
                    // 'user_location',
                    // 'friends_location',
                    // 'user_games_activity',
                    // 'friends_online_presence',
                    // 'user_notes',
                    // 'publish_actions',
                    // 'user_subscriptions',
                    'user_likes',
                    'friends_likes'];

module.exports = function(app, passport, auth) {
  app.options('*', function(req, res){
    res.send(200);
  });

  app.get('/signout', users.signout);

  //Setting up the users api
  app.post('/users', users.create);
  
  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Invalid email or password.'
  }), users.session);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  // api interface routes
  app.get('/api/userInfo', getUser.info);
  app.get('/api/getQuestions/unanswered', getQuestions.andAnswers);
  app.post('/api/getQuestions/fromUser', getQuestions.fromUser);
  app.get('/api/getRoommate', getRoommate.info);

  app.post('/api/setUserQA', setUserQA);
  app.post('/api/setUserRoommates', setUserRoommates);
  app.post('/api/setUserPref', setUserPref);
  app.post('/api/userArray', getUser.userArray);

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: permissions,
    failureRedirect: '/'
  }), function(req, res) { res.redirect('/'); });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
  }), users.session); 

  //Finish with setting up the userId param
  app.param('userId', users.user);

  //Question Routes
  var questions = require('../app/controllers/questions');
  app.get('/questions', questions.all);
  app.post('/questions', auth.requiresLogin, questions.create);
  app.get('/questions/:questionId', questions.show);
  app.put('/questions/:questionId', auth.requiresLogin, auth.question.hasAuthorization, questions.update);
  app.del('/questions/:questionId', auth.requiresLogin, auth.question.hasAuthorization, questions.destroy);

  //Finish with setting up the questionId param
  app.param('questionId', questions.question);

  //Home route
  var index = require('../app/controllers/index');
  app.get('/', index.render);

};
