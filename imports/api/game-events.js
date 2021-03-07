import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { initCollection } from './common.js'
import _ from 'lodash'

export const GameEvents = initCollection('gameEvents')

if (Meteor.isServer) {
  // Meteor.publish('gameEvents', (userId) => GameEvents.find())
}

