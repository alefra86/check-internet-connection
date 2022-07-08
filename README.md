# check-internet-connection

AWS Lambda function used to check internet connection status.<br>
It sends a <em>Telegram</em> notifications every time the internet connection status changes.

## Tools

In this project are used the following AWS services (all available in the free tier plan):
- Lambda
- DynamoDB
- API Gateway
- EventBridge

In order to easily deploy all the above services, it has been used [serverless framework](https://www.serverless.com/)

## How it works

The internet connection checks, implemented in the AWS Lambda function, can be triggered in two ways:
- automatically: through the AWS EventBridge, specifying a rate interval (like a cron job)
- manually: invoking a REST Api exposed by AWS API Gateway (this API is public! It should be better protect it with AWS IAM)

## Installation

1. Create a Telegram Bot following the [official docs](https://core.telegram.org/bots#6-botfather)

2. Install [IDBot](https://botostore.com/c/myidbot/) to get your `chat_id`

3. Modify handler.js const with your values
    

4. Deploy all AWS Services running this command

```shell
serverless deploy
```