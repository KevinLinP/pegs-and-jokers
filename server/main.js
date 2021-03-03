import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

'games.initializeState' () {
  if (!this.userId) { return 'not logged in' }
}
