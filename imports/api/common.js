export const initCollection = function (mongoCollectionName) {
  const collection = new Mongo.Collection(mongoCollectionName, {idGeneration: 'MONGO'})

  const requireUser = function (userId) { return !!userId }
  collection.allow({
    insert: requireUser,
    update: requireUser,
    remove: requireUser,
  })

  return collection
}
