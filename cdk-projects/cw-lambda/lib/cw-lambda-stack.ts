import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CwLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CwLambdaQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    // 👇 lambda function definition
    const myFunction = new lambda.Function(this, 'my-function', {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      handler: 'hello.handler',
      code: lambda.Code.fromAsset("lambda"),
    });
    // 👇 manually instantiate a Metric
const IteratorAge = new cloudwatch.Metric({
  namespace: 'AWS/Lambda',
  metricName: 'IteratorAge',
  period: cdk.Duration.minutes(5),
  statistic: 'Maximum',
  dimensionsMap: {
    FunctionName: myFunction.functionName,
  },
});

new cloudwatch.Alarm(this, 'lambda-errors-alarm', {
  metric: IteratorAge,
  threshold: 1,
  comparisonOperator:
    cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
  evaluationPeriods: 1,
  alarmDescription:
    'IteratorAge',
});


  }
}
