import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { initCollection } from './common.js'
import _ from 'lodash'

export const Players = initCollection('players')

if (Meteor.isServer) {
  Meteor.publish('players', () => Players.find())
}
