export const parseBucketNameFromId = (compound: string): { bucketName: string; id: string } => {
  const [bucketName, id] = compound.split('.', 2)
  return { bucketName, id }
}
