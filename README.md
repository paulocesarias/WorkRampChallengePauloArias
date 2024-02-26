# WorkRamp Challenge Project (Option #4)

The following are the steps to implement an AWS CDK project that creates an ECS cluster, a sample Fargate service, and an associated ALB (Application Load Balancer) with proper networking, security, and scalability.

This were the L2 Constructs used to deploy the solution:
- aws_ec2
- aws_ecs
- aws_ecs_patterns

Resources to be created:
- 2 AZs defined
- VPC with the specified CIDR
- Deploys 3 subnets, 1 per AZ, as follows:
  - Public Subnet (Ingress)
  - Private Subnet with NAT Egress (Application)
  - Private Isolated Subnet (RDS)
- ECS Cluster
- Fargate Service with a sample app inside the application subnet
  - Attached to a SG that allows access to the ELB only
- Autoscaling Configuration wich trrigers a new task after 50% CPU usage
- Public ELB inside the Ingress Subnet, bound to the previous service
  - Attached to a SG with Inbound/Outbound rules on port 80 to the world (0.0.0.0)

The following are the steps to be followed to deploy the application:

* Login to AWS by using aws sso, aws-vault or whatever method you use to connect to AWS CLI, then, run the following commands accordingly:
* cd into directory `hello-ecs`
* `npm install -g aws-cdk`  install AWS CDK
* `npm install`             install dependencies inside the construct(s) / stack(s)
* `npx cdk synth`           emits the synthesized CloudFormation template
* `npx cdk diff`            compare deployed stack with current state
* `npx cdk deploy`          deploy this stack to your default AWS account/region

After the deploy finishes, you should be able to access the Web Application using the ELB's dns name
