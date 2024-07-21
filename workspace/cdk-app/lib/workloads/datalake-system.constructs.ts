// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

import glueAlpha from '@aws-cdk/aws-glue-alpha';
import { Aws, aws_iam as iam, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export type DataLakeSystemProps = {};

export class DataLakeSystem extends Construct {
  readonly rawDataBucket: s3.Bucket;
  readonly convertedDataBucket: s3.Bucket;

  constructor(
    scope: Construct,
    id: string,
    // props?: DataLakeSystemProps
  ) {
    super(scope, id);

    this.rawDataBucket = new s3.Bucket(this, 'Raw Data Bucket', {
      bucketName: `raw-data-bucket-${Aws.ACCOUNT_ID}-${Aws.REGION}`,
    });

    this.convertedDataBucket = new s3.Bucket(this, 'Converted Data Bucket', {
      bucketName: `converted-data-bucket-${Aws.ACCOUNT_ID}-${Aws.REGION}`,
    });

    const roleForDataConversionGlueJob = new iam.Role(
      this,
      'Role for Glue Job',
      {
        roleName: 'Role-DataConversion-GlueJob',
        assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      },
    );
    roleForDataConversionGlueJob.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSGlueServiceRole',
      ),
    );
    this.rawDataBucket.grantRead(roleForDataConversionGlueJob);
    this.convertedDataBucket.grantWrite(roleForDataConversionGlueJob);

    const db = new glueAlpha.Database(this, 'Database', {
      databaseName: 'sample-db',
    });

    new glueAlpha.S3Table(this, 'Sample Table', {
      bucket: this.convertedDataBucket,
      database: db,
      dataFormat: glueAlpha.DataFormat.PARQUET,
      partitionKeys: [
        {
          name: 'year',
          type: glueAlpha.Schema.STRING,
        },
        {
          name: 'month',
          type: glueAlpha.Schema.STRING,
        },
        {
          name: 'day',
          type: glueAlpha.Schema.STRING,
        },
      ],
      columns: [
        {
          name: 'id',
          type: glueAlpha.Schema.STRING,
        },
        {
          name: 'datetime',
          type: glueAlpha.Schema.TIMESTAMP,
        },
        {
          name: 'value',
          type: glueAlpha.Schema.INTEGER,
        },
        {
          name: 'message',
          type: glueAlpha.Schema.STRING,
        },
      ],
    });
  }
}
