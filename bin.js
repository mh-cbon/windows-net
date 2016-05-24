#!/usr/bin/env node

var pkg = require('./package.json');
var debug = require('debug')(pkg.name);
var argv = require('minimist')(process.argv.slice(2))

var winNet = require('./index.js')

debug('argv %j', argv);

var command = argv['_'] && argv['_'][0];

if (argv.h || argv.help) {
  console.error('%s %s', pkg.name, pkg.version)
  console.error('')
  console.error('Usage: jnet [options] [command] [group] [user]')
  console.error('')
  console.error('Commands:')
  console.error('')
  console.error(' List groups')
  console.error('   jnet groups')
  console.error(' Show group details')
  console.error('   jnet group [name]')
  console.error(' Tell if a group exists')
  console.error('   jnet has_group [name]')
  console.error(' Create a new group')
  console.error('   jnet new_group [options] [name]')
  console.error(' Delete a group')
  console.error('   jnet rem_group [options] [name]')
  console.error(' List users')
  console.error('   jnet users')
  console.error(' Show user details')
  console.error('   jnet user [name]')
  console.error(' Tell if an user exists')
  console.error('   jnet has_user [name]')
  console.error(' Create a new user')
  console.error('   jnet new_user [options] [name]')
  console.error(' Delete an user')
  console.error('   jnet rem_user [options] [name]')
  console.error(' Add an user to a group')
  console.error('   jnet group_add_user [options] [group] [user]')
  console.error(' Remove an user from a group')
  console.error('   jnet group_rem_user [options] [group] [user]')
  console.error('')
  console.error(' Options:')
  console.error('   TBD')
  process.exit(1)
}

if (command==='groups') {
  winNet.groups(function (err, groups) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(groups, null, 2))
  })

} else if (command==='group') {
  var name = argv['_'] && argv['_'][1];
  winNet.groupDetails(name, function (err, details) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(details, null, 2))
  })

} else if (command==='has_group') {
  var name = argv['_'] && argv['_'][1];
  winNet.groupExists(name, function (err, exists) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(exists, null, 2))
  })

} else if (command==='new_group') {
  var name = argv['_'] && argv['_'][1];
  winNet.groupAdd(name, {}, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(true, null, 2))
  })

} else if (command==='rem_group') {
  var name = argv['_'] && argv['_'][1];
  winNet.groupRemove(name, {}, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(true, null, 2))
  })

} else if (command==='users') {
  winNet.users(function (err, users) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(users, null, 2))
  })
} else if (command==='user') {
  var name = argv['_'] && argv['_'][1];
  winNet.userDetails(name, function (err, details) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(details, null, 2))
  })

} else if (command==='new_user') {
  var name = argv['_'] && argv['_'][1];
  winNet.userAdd(name, {}, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(true, null, 2))
  })

} else if (command==='rem_user') {
  var name = argv['_'] && argv['_'][1];
  winNet.userRemove(name, {}, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(true, null, 2))
  })

} else if (command==='has_user') {
  var name = argv['_'] && argv['_'][1];
  winNet.userExists(name, function (err, exists) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(exists, null, 2))
  })

} else if (command==='group_add_user') {
  var group = argv['_'] && argv['_'][1];
  var user = argv['_'] && argv['_'][2];
  winNet.groupAddUser(group, user, {}, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(true, null, 2))
  })

} else if (command==='group_rem_user') {
  var group = argv['_'] && argv['_'][1];
  var user = argv['_'] && argv['_'][2];
  winNet.groupRemUser(group, user, {}, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(true, null, 2))
  })

}
