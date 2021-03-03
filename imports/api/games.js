import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { initCollection } from './common.js'
import _ from 'lodash'

export const Games = initCollection('games')

if (Meteor.isServer) {
  Meteor.publish('games', () => GameStates.find())
}
