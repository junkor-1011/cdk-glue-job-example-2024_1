import { Aws, aws_athena as athena, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DataAnalysisSystem extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const athenaResultBucket = new s3.Bucket(this, 'athena result', {
      bucketName: `athena-result-${Aws.ACCOUNT_ID}-${Aws.REGION}`,
    });

    new athena.CfnWorkGroup(this, 'athena workgroup', {
      name: 'sample-workgroup',
      workGroupConfiguration: {
        resultConfiguration: {
          outputLocation: `s3://${athenaResultBucket.bucketName}`,
        },
      },
    });
  }
}
