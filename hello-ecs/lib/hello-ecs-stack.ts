import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class HelloEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new cdk.aws_ec2.Vpc(this, "WorkRamp-Challenge-VPC", {
      maxAzs: 2, // Default is all AZs in region
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr('10.0.0.0/16'),
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
        }
      ],
      restrictDefaultSecurityGroup: true
    });

    const cluster = new cdk.aws_ecs.Cluster(this, "WorkRamp-Challenge-ECS", {
      vpc: vpc
    });

    // Create a load-balanced Fargate service and make it public
    const fargateService = new cdk.aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, "WorkRamp-Challenge-Fargate-Service", {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 1, // Default is 1
      taskImageOptions: { 
        image: cdk.aws_ecs.ContainerImage.fromRegistry("nginx:latest"),
        containerPort: 80
      },
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true // Default is true
    });

    // Setup AutoScaling policy
    const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: 2 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });
  
  }
}
