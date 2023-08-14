#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Stack } from '../stacks/Stack'

const app = new cdk.App()

const envName = app.node.tryGetContext('env_name')

const env: cdk.Environment = {
  account: '775046384648',
  region: 'ap-northeast-1'
}
export class RootStack extends cdk.Stack {
  // To customize nested stack logical id
  override getLogicalId(element: cdk.CfnElement): string {
    if (element.node.id.includes('NestedStackResource')) {
      return /([a-zA-Z0-9]+)\.NestedStackResource/.exec(element.node.id)![1] // will be the exact id of the stack
    }
    return super.getLogicalId(element)
  }

  constructor(scope: Construct, constructId: string, props?: cdk.StackProps) {
    super(scope, constructId, props)

    const stackName = `EventStack`
    const stack = new Stack(this, stackName, {})
  }
}

const rootStackName = `EventRootStack${envName}`
const batch = new RootStack(app, rootStackName, { env })
