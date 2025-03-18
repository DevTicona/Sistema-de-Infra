export const schema = gql`
  type SystemStats {
    sistemas: Int!
    servidores: Int!
    usuarios: Int!
    componentes: Int!
  }

  type ServerStatus {
    name: String!
    cpu: Float!
  }

  type DeploymentData {
    system: String!
    deployments: Int!
  }

  type RecentDeployment {
    id: Int!
    system: String!
    version: String!
    status: String!
  }

  type ActiveAlert {
    id: Int!
    server: String!
    description: String!
  }

  type Query {
    systemStats: SystemStats! @skipAuth
    serverStatusData: [ServerStatus!]! @skipAuth
    deploymentData: [DeploymentData!]! @skipAuth
    recentDeployments: [RecentDeployment!]! @skipAuth
    activeAlerts: [ActiveAlert!]! @skipAuth
  }
`
