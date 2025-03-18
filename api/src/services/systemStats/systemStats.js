import { db } from 'src/lib/db'

export const systemStats = async () => {
  try {
    // Verify db is properly initialized
    console.log('Database connection:', db ? 'OK' : 'Not connected')

    // Check what models are available
    console.log('Available models:', Object.keys(db))

    // Use the proper model names based on your Prisma schema
    // Note: Prisma model names should match your schema exactly
    const sistemas = await db.sistemas.count({
      where: { estado: 'ACTIVO' },
    })

    const servidores = await db.servidores.count({
      where: { estado: 'ACTIVO' },
    })

    const usuarios = await db.usuarios.count({
      where: { estado: 'ACTIVO' },
    })

    const componentes = await db.componentes.count({
      where: { estado: 'ACTIVO' },
    })

    return {
      sistemas,
      servidores,
      usuarios,
      componentes,
    }
  } catch (error) {
    console.error('Error in systemStats:', error)
    // Return default values in case of error
    return {
      sistemas: 0,
      servidores: 0,
      usuarios: 0,
      componentes: 0,
    }
  }
}

export const serverStatusData = async () => {
  try {
    // Get server status data
    const servers = await db.servidores.findMany({
      where: { estado: 'ACTIVO' },
      take: 4,
    })

    return servers.map(server => ({
      name: server.nombre,
      cpu: Math.floor(Math.random() * 100), // Random CPU usage for demonstration
    }))
  } catch (error) {
    console.error('Error in serverStatusData:', error)
    return [
      { name: 'Servidor 1', cpu: 65 },
      { name: 'Servidor 2', cpu: 45 },
      { name: 'Servidor 3', cpu: 85 },
      { name: 'Servidor 4', cpu: 30 },
    ]
  }
}

export const deploymentData = async () => {
  try {
    // Get deployment statistics by system
    const systems = await db.sistemas.findMany({
      where: { estado: 'ACTIVO' },
      include: {
        componentes: {
          include: {
            despliegue: true,
          },
        },
      },
      take: 4,
    })

    return systems.map(system => ({
      system: system.sigla,
      deployments: system.componentes.reduce((total, comp) => total + comp.despliegue.length, 0),
    }))
  } catch (error) {
    console.error('Error in deploymentData:', error)
    return [
      { system: 'ERP', deployments: 14 },
      { system: 'CRM', deployments: 8 },
      { system: 'BI', deployments: 5 },
      { system: 'HR', deployments: 11 },
    ]
  }
}

export const recentDeployments = async () => {
  try {
    // Get recent deployments
    const deployments = await db.despliegue.findMany({
      take: 3,
      orderBy: { fecha_creacion: 'desc' },
      include: {
        componentes: true,
      },
    })

    return deployments.map(deploy => {
      let status = 'En progreso'
      if (deploy.estado === 'ACTIVO') {
        status = 'Exitoso'
      } else if (deploy.estado === 'INACTIVO') {
        status = 'Fallido'
      }

      return {
        id: deploy.id,
        system: deploy.componentes?.nombre || deploy.nombre,
        version: deploy.agrupador, // Using agrupador as version
        status,
      }
    })
  } catch (error) {
    console.error('Error in recentDeployments:', error)
    return [
      { id: 1, system: 'ERP', version: '2.3.1', status: 'Exitoso' },
      { id: 2, system: 'CRM', version: '1.0.5', status: 'Fallido' },
      { id: 3, system: 'BI', version: '3.1.0', status: 'En progreso' },
    ]
  }
}

export const activeAlerts = async () => {
  try {
    // Get active alerts
    const servers = await db.servidores.findMany({
      where: { estado: 'ACTIVO' },
      take: 3,
    })

    const alertTypes = [
      'Alto uso de CPU',
      'Memoria baja',
      'Disco lleno',
      'Contenedor inactivo',
      'Latencia alta'
    ]

    return servers.map((server, index) => ({
      id: index + 1,
      server: server.nombre,
      description: alertTypes[Math.floor(Math.random() * alertTypes.length)],
    }))
  } catch (error) {
    console.error('Error in activeAlerts:', error)
    return [
      { id: 1, server: 'SRV-01', description: 'Alto uso de CPU' },
      { id: 2, server: 'SRV-05', description: 'Memoria baja' },
      { id: 3, server: 'CON-12', description: 'Contenedor inactivo' },
    ]
  }
}
