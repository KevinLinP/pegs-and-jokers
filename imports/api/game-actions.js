import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { initCollection } from './common.js'
import _ from 'lodash'

export const GameActions = initCollection('game-actions')

if (Meteor.isServer) {
  Meteor.publish('game-actions', () => GameActions.find())
}
