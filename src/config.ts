export default async () => {
  const dbPort = await 3308;

  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    db: {
      host: 'localhost',
      port: dbPort
    }
  }
}
