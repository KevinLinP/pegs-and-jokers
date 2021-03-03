import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { initCollection } from './common.js'
import _ from 'lodash'

export const GameCards = initCollection('gameCards')

if (Meteor.isServer) {
  Meteor.publish('gameCards', () => GameCards.find())
}
