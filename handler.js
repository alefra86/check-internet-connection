"use strict";

const AWS = require('aws-sdk');
const axios = require("axios");

// in my case I've used my router web page
const urlToCheck = $URL_TO_CHECK;
const token = $YOUR_TELEGRAM_BOT_TOKEN;
const chat_id = $YOUR_CHAT_ID;
// change with your preferred region
const region = 'eu-west-1';
const onlineMessage = "Connection Up";
const offlineMessage = "Connection Down";

const docClient = new AWS.DynamoDB.DocumentClient({region: region})

const homeApi = axios.create({
  baseURL: urlToCheck,
});

const telegramApi = axios.create({
  baseURL: "https://api.telegram.org",
});

const telegramUrl = `/bot${token}/sendMessage`;

const dynamoDbKeyValue = 'last';

module.exports.check = async (event) => {
  console.log("Checking Connection Status");
  let status = await checkConnection();
  
  const lastStatus = await readLastStatusSeen();
  let message = 'Status not changed';
  if(lastStatus.Item === undefined || lastStatus.Item.http_result !== status) {
    message = 'Status changed';
    await sendNotificationAndSaveNewStatus(status);
  }
  console.log(message);
  return {statusCode: 200, body: JSON.stringify({message: message})}; 
};

async function checkConnection() {
  let status;
  try {
    const result = await homeApi.get("", { timeout: 3000 });
    console.log(onlineMessage);
    status = result.status;
  } catch (error) {
    console.log(offlineMessage);
    status = 500;
  }
  return status;
}

async function sendNotificationAndSaveNewStatus(status) {
  if (status === 200) {
    await sendTelegramMessage(onlineMessage);
  } else {
    await sendTelegramMessage(offlineMessage);
  }
  await saveLastStatus(status);
}

async function sendTelegramMessage(message) {
  await telegramApi.get(telegramUrl, {
    params: {
      chat_id: chat_id,
      text: message,
    },
  });
}

async function saveLastStatus(status) {
  await docClient.put({
    TableName: 'internet_status',
    Item: {
      status: dynamoDbKeyValue,
      http_result: status
    }
  }).promise();
}

async function readLastStatusSeen() {
  return await docClient.get({
    TableName: 'internet_status',
    Key: {
      "status": dynamoDbKeyValue
    }
  }).promise();
}
