const debug = require('debug')('kochii:server-website.controller');
const Post = require('../models/post');
const sendContactEmail =
  require('../util/external_api.service').sendContactEmail;

exports.website_index = async function (req, res, next) {
  try {
    const latest_posts = await Post.find(
      {},
      'title tags createdAt summary banner author',
    )
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName')
      .limit(6);
    res.render('index', { title: 'Personal Inventory | Kochii', latest_posts });
  } catch (error) {
    debug('Error');
    res.locals.render_view = 'index';
    res.locals.render_data = {
      title: 'Personal Inventory | Kochii',
      latest_posts: [],
    };

    next(error);
  }
};

exports.website_about_us = function (req, res) {
  res.render('about-us', { title: 'About Us | Kochii' });
};

exports.website_privacy_policy = function (req, res) {
  res.render('privacy-policy', { title: 'Privacy | Kochii' });
};

exports.website_terms_of_service = function (req, res) {
  res.render('terms-of-service', { title: 'Legal Information | Kochii' });
};

exports.website_sent_get = function (req, res) {
  res.render('message', {
    title: 'Message Sent | Kochii',
    message_title: 'Success',
    message_description: 'Your message was sent successfully',
  });
};

// POST /send request to send email
exports.website_send_post = async function (req, res, next) {
  try {
    const { from_email, from_name, body } = req.body;
    const response = await sendContactEmail(from_email, from_name, body);

    if (response.data.success) {
      res.redirect('/sent');
    } else {
      throw { status: 500, error_messages: ['Something went wrong'] };
    }
  } catch (error) {
    debug('Error');
    res.locals.render_view = 'message';
    res.locals.render_data = {
      title: 'Error | Kochii',
      message_title: '( ._.)',
      message_subtitle: 'Error Sending Email',
      message_description: 'Something went wrong',
    };

    next(error);
  }
};
