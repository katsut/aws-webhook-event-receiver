import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as kinesis from 'aws-cdk-lib/aws-kinesis'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export class Stack extends cdk.NestedStack {
  public readonly commonLayer: lambda.LayerVersion

  constructor(scope: Construct, constructId: string, props?: cdk.NestedStackProps) {
    super(scope, constructId, props)

    const envName = scope.node.tryGetContext('env_name')

    // webhook endpoint
    const api = new apigateway.RestApi(this, 'Api', {
      deployOptions: {
        stageName: 'v1'
      }
    })

    // kinesis streams
    const stream = new kinesis.Stream(this, 'Stream', {
      shardCount: 1
    })

    // integration
    const webhook = api.root.addResource('webhook')

    // Add integration to the API
    const role = new iam.Role(this, 'ApiGatewayToKinesisRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com')
    })
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['kinesis:PutRecord'],
        effect: iam.Effect.ALLOW,
        resources: [stream.streamArn]
      })
    )
    webhook.addMethod(
      'POST',
      new apigateway.AwsIntegration({
        service: 'kinesis',
        action: 'PutRecord',
        options: {
          credentialsRole: role,
          passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
          requestTemplates: {
            'application/json': `{
              "StreamName": "${stream.streamName}",
              "Data": "$util.base64Encode($input.json('$'))",
              "PartitionKey": $input.json('$.created')
            }`
          },
          //   // 統合レスポンスの設定
          integrationResponses: [
            {
              statusCode: '200',
              responseTemplates: {
                'application/json': `{"result":"ok"}`
              }
            }
          ]
        }
      }),
      //メソッドレスポンスの設定
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    )
  }
}
