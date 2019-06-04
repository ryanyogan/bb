const mongoose = require('mongoose');
const _ = require('lodash');
const logger = require('../logs');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const EmailTemplate = mongoose.model('EmailTemplate', mongoSchema);

const insertTemplates = () => {
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to builderbook.org',
      message: `<%= userName %>,
        <p>
          Thanks for signing up for Builder Book!
        </p>
        <p>
          In our books, we teach how to build uh... books
        </p>

        Ryan Yogan, Team Whatever
      `,
    },
  ];

  templates.forEach(async (template) => {
    if ((await EmailTemplate.find({ name: template.name }).count()) > 0) {
      return null;
    }

    return EmailTemplate.create(template).catch((error) => {
      logger.error('EmailTemplate insertion error: ', error);
    });
  });
};

insertTemplates();

const getEmailTemplate = async (name, params) => {
  const source = await EmailTemplate.findOne({ name });
  if (!source) {
    throw new Error('No EmailTemplate found.  Please check that at least one exists.');
  }

  return {
    message: _.template(source.message)(params),
    subject: _.template(source.subject)(params),
  };
};

exports.insertTemplates = insertTemplates;
exports.getEmailTemplate = getEmailTemplate;
