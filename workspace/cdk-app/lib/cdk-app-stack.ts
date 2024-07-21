import { Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { DataAnalysisSystem } from './workloads/data-analysis.constructs';
import { DataLakeSystem } from './workloads/datalake-system.constructs';

export class CdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new DataLakeSystem(this, 'DataLakeSystem');
    new DataAnalysisSystem(this, 'DataAnalysisSystem');
  }
}
