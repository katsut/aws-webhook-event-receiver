import * as cdk from 'aws-cdk-lib'
import { CfnApi } from 'aws-cdk-lib/aws-apigatewayv2'
import { Stream } from 'aws-cdk-lib/aws-kinesis'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export class Stack extends cdk.NestedStack {
  public readonly commonLayer: lambda.LayerVersion

  constructor(scope: Construct, constructId: string, props?: cdk.NestedStackProps) {
    super(scope, constructId, props)

    const envName = scope.node.tryGetContext('env_name')

    // webhook endpoint
    const api = new CfnApi(this, 'HttpApi', { protocolType: 'HTTP', name: 'event-webhook-api' })

    // kinesis streams
    const kinesisStream = new Stream(this, 'Stream', {
      shardCount: 1
    })
  }
}
