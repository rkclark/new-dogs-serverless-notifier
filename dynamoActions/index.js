/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = {
  putItem: (item) => {
    const params = {
      TableName: 'dogs',
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    };

    return dynamoDB
      .put(params)
      .promise()
      .then((res) => res);
  },
};
