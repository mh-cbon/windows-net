# windows-net

Execute windows `net` commands and get JSON responses.

# Install

```sh
npm i @mh-cbon/windows-net --save
```

# Usage

```js
var windowsNet = require('@mh-cbon/windows-net');

windowsNet.groups(function (err, code, groups) {
  err && console.error(err);
  err && console.error(code);
  !err && groups && console.log(groups);
})

windowsNet.groupAdd('name', {}, function (err, code) {
  err && console.error(err);
  err && console.error(code);
  !err && console.log('Success!');
})

windowsNet.groupRemove('name', {}, function (err, code) {
  err && console.error(err);
  err && console.error(code);
  !err && console.log('Success!');
})

windowsNet.groupDetails('name', function (err, code, details) {
  err && console.error(err);
  err && console.error(code);
  !err && details && console.log(details);
})

windowsNet.groupExists('name', function (err, exists) {
  err && console.error(err);
  !err && console.log("%j", exists);
})

windowsNet.users(function (err, code, users) {
  err && console.error(err);
  err && console.error(code);
  !err && users && console.log(users);
})

windowsNet.userAdd('name', {}, function (err, code) {
  err && console.error(err);
  err && console.error(code);
  !err && console.log('Success!');
})

windowsNet.userRemove('name', {}, function (err, code) {
  err && console.error(err);
  err && console.error(code);
  !err && console.log('Success!');
})

windowsNet.userDetails('name', function (err, code, details) {
  err && console.error(err);
  err && console.error(code);
  !err && details && console.log(details);
})

windowsNet.userExists('name', function (err, exists) {
  err && console.error(err);
  !err && console.log("%j", exists);
})

windowsNet.groupAddUser('Administrators', 'vagrant', {}, function (err, code) {
  err && console.error(err);
  err && console.error(code);
  !err && console.log('Success!');
})

windowsNet.groupRemUser('Administrators', 'vagrant', {}, function (err, code) {
  err && console.error(err);
  err && console.error(code);
  !err && console.log('Success!');
})

```

# As a binary

```sh
  npm i @mh-cbon/windows-net -g
```

# Usage

```sh
@mh-cbon/windows-net 1.0.0

Usage: jnet [options] [command] [group] [user]

Commands:

 List groups
   jnet groups
 Show group details
   jnet group [name]
 Tell if a group exists
   jnet has_group [name]
 Create a new group
   jnet new_group [options] [name]
 Delete a group
   jnet rem_group [options] [name]
 List users
   jnet users
 Show user details
   jnet user [name]
 Tell if an user exists
   jnet has_user [name]
 Create a new user
   jnet new_user [options] [name]
 Delete an user
   jnet rem_user [options] [name]
 Add an user to a group
   jnet group_add_user [options] [group] [user]
 Remove an user from a group
   jnet group_rem_user [options] [group] [user]

 Options:
   TBD

```

# Tests

To run the tests via vagrant, please ensure to not use launch them via `winrm`.

`winrm` uses PS under the hood, which is subject to some limitation preventing invokation of net commands [see this](https://social.technet.microsoft.com/Forums/windowsserver/en-US/a7853ac3-6c48-4615-896a-e306067ab804/net-use-via-powershell-returning-a-specified-logon-session-does-not-exist-it-may-already-have-been?forum=winserversecurity).

So to summarize,

- setup vagrant from the official website
- install winrm plugin
- start the box with the gui
- launch the tests from the gui session (!!!!)
