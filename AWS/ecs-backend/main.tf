provider "aws" {
  region = local.region
}

data "aws_availability_zones" "available" {}

locals {
  name   = "food-select"
  region = "us-east-2"

  vpc_cidr = "10.0.0.0/16"

  azs = slice(data.aws_availability_zones.available.names, 0, 2)

  container_name = "node-server"
  container_port = 3000
}


# module "vpc" {
#   source = "terraform-aws-modules/vpc/aws"

#   name = "my-vpc-ecs"
#   cidr = local.vpc_cidr

#   azs            = local.azs
#   public_subnets = ["10.0.101.0/24", "10.0.102.0/24"]
# }

resource "aws_vpc" "main" {
  cidr_block       = local.vpc_cidr
  instance_tenancy = "default"

  tags = {
    Name = "my-vpc-ecs"
  }
}

resource "aws_subnet" "public-subnet-1" {
  vpc_id = aws_vpc.main.id

  cidr_block        = "10.0.10.0/24"
  availability_zone = local.azs[0]

  tags = {
    Name = "public-subnet-1"
  }
}

resource "aws_subnet" "public-subnet-2" {
  vpc_id = aws_vpc.main.id

  cidr_block        = "10.0.11.0/24"
  availability_zone = local.azs[1]

  tags = {
    Name = "public-subnet-2"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "igw-public"
  }
}

resource "aws_route_table" "rt-public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public-rt"
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.public-subnet-1.id
  route_table_id = aws_route_table.rt-public.id
}

resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.public-subnet-2.id
  route_table_id = aws_route_table.rt-public.id
}

resource "aws_security_group" "allowAppTraffic" {
  name        = "allow-app-traffic"
  description = "3000 port traffic in"
  vpc_id      = aws_vpc.main.id
}

resource "aws_vpc_security_group_ingress_rule" "example" {
  security_group_id = aws_security_group.allowAppTraffic.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 3000
  ip_protocol = "tcp"
  to_port     = 3000
}

resource "aws_vpc_security_group_egress_rule" "example" {
  security_group_id = aws_security_group.allowAppTraffic.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"
}


resource "aws_ecs_cluster" "foodcluster" {
  name = "terrafood-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "example" {
  cluster_name = aws_ecs_cluster.foodcluster.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 1
    capacity_provider = "FARGATE"
  }

  default_capacity_provider_strategy {
    weight            = 1
    capacity_provider = "FARGATE_SPOT"
  }
}

resource "aws_ecs_task_definition" "foodiebackie" {
  family                   = "foodiebackie"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  task_role_arn            = "arn:aws:iam::462797340305:role/ecsTaskRole"
  execution_role_arn       = "arn:aws:iam::462797340305:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([
    {
      name      = "serverjs"
      image     = "462797340305.dkr.ecr.us-east-2.amazonaws.com/food-versions:latest"
      essential = true
      portMappings = [
        {
          name          = local.container_name
          containerPort = local.container_port
          hostPort      = local.container_port
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]
      environment = [
        {
          name  = "account"
          value = var.account
        },
        {
          name  = "password"
          value = var.password
        }
      ]
    }
  ])

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}

resource "aws_ecs_service" "nodeserver" {
  name                = "backserver"
  cluster             = aws_ecs_cluster.foodcluster.id
  task_definition     = aws_ecs_task_definition.foodiebackie.arn
  desired_count       = 1
  scheduling_strategy = "REPLICA"

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = [aws_subnet.public-subnet-1.id, aws_subnet.public-subnet-2.id]
    security_groups  = [aws_security_group.allowAppTraffic.id]
    assign_public_ip = true
  }
}
