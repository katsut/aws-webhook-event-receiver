import * as cdk from 'aws-cdk-lib'
import * as assertions from 'aws-cdk-lib/assertions'
import { describe, test } from 'vitest'
import { Stack } from './Stack'

describe('BatchStack', () => {
  test('Can make new', () => {
    const app = new cdk.App({ context: { env_name: 'test' } })
    const root = new cdk.Stack(app, 'root')
    const s = new Stack(root, 'stack')

    // api gateway

    // kinesis data streams

    const template = assertions.Template.fromStack(s)
    template.resourceCountIs('AWS::ApiGatewayV2::Api', 1)
    app.synth()
  })
})
