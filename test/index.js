require('should');

var windowsNet = require('../index.js')

describe('windows-net', function () {

  it('should add a new group', function (done){
    windowsNet.groupAdd('else', {}, function (err, code) {
      code.should.eql(0);
      (!err).should.eql(true);
      done();
    })
  })

  it('should fail to add a new group', function (done){
    windowsNet.groupAdd('else', {}, function (err, code) {
      code.should.eql(2);
      (!err).should.eql(false);
      done();
    })
  })

  it('should list groups', function (done){
    windowsNet.groups(function (err, code, groups) {
      code.should.eql(0);
      groups.length.should.not.eql(0);
      groups.indexOf('Administrators').should.not.eql(-1);
      groups.indexOf('else').should.not.eql(-1);
      (!err).should.eql(true);
      done();
    })
  })

  it('should delete a group', function (done){
    windowsNet.groupRemove('else', {}, function (err, code) {
      code.should.eql(0);
      (!err).should.eql(true);
      done();
    })
  })

  it('should fail to delete a group', function (done){
    windowsNet.groupRemove('else', {}, function (err, code) {
      code.should.eql(2);
      (!err).should.eql(false);
      done();
    })
  })

  it('should get group details', function (done){
    windowsNet.groupDetails('Administrators', function (err, code, details) {
      code.should.eql(0);
      details.should.eql({
        'Alias name': 'Administrators',
        'Comment': 'Administrators have complete and unrestricted access to the computer/domain',
        'users': [
          'Administrator',
          'vagrant',
        ]
      });
      (!err).should.eql(true);
      done();
    })
  })

  it('should fail to get group details', function (done){
    windowsNet.groupDetails('Administrator', function (err, code, details) {
      code.should.eql(2);
      (!err).should.eql(false);
      done();
    })
  })

  it('should add a new user', function (done){
    windowsNet.userAdd('some', {}, function (err, code) {
      code.should.eql(0);
      (!err).should.eql(true);
      done();
    })
  })

  it('should fail to add a new user', function (done){
    windowsNet.userAdd('some', {password: 'a'}, function (err, code) {
      code.should.eql(2);
      (!err).should.eql(false);
      done();
    })
  })

  it('should list users', function (done){
    windowsNet.users(function (err, code, users) {
      code.should.eql(0);
      users.length.should.not.eql(0);
      users.indexOf('vagrant').should.not.eql(-1);
      users.indexOf('some').should.not.eql(-1);
      (!err).should.eql(true);
      done();
    })
  })

  it('should delete an user', function (done){
    windowsNet.userRemove('some', {}, function (err, code) {
      code.should.eql(0);
      (!err).should.eql(true);
      done();
    })
  })

  it('should fail to delete an user', function (done){
    windowsNet.userRemove('some', {}, function (err, code) {
      code.should.eql(2);
      (!err).should.eql(false);
      done();
    })
  })

  it('should get user details', function (done){
    windowsNet.userDetails('vagrant', function (err, code, details) {
      code.should.eql(0);
      details.should.eql({
        'Account active': 'Yes',
        'Account expires': 'Never',
        'Comment': 'Vagrant User',
        'Country/region code': '001 (United States)',
        'Full Name': 'Vagrant',
        'Home directory': '',
        'Last logon': '5/23/2016 10:48:02 PM',
        'Logon hours allowed': 'All',
        'Logon script': '',
        'Password changeable': '1/13/2015 10:26:40 AM',
        'Password expires': 'Never',
        'Password last set': '1/13/2015 10:26:40 AM',
        'Password required': 'Yes',
        'User may change password': 'Yes',
        'User name': 'vagrant',
        'User profile': '',
        'User\'s comment': '',
        'Workstations allowed': 'All',
        'Global Group Memberships': [ '' ],
        'Local Group Memberships': [ 'Administrators', 'Users' ],
      });
      (!err).should.eql(true);
      done();
    })
  })

  it('should fail to get user details', function (done){
    windowsNet.userDetails('nopnop', function (err, code, details) {
      code.should.eql(2);
      (!err).should.eql(false);
      done();
    })
  })

  it('should tells an user exists', function (done){
    windowsNet.userExists('vagrant', function (err, exists) {
      exists.should.eql(true);
      (!err).should.eql(true);
      done();
    })
  })

  it('should tell an user does not exist', function (done){
    windowsNet.userExists('nopnop', function (err, exists) {
      exists.should.eql(false);
      (!err).should.eql(false);
      done();
    })
  })

  it('should tell a group exists', function (done){
    windowsNet.groupExists('Administrators', function (err, exists) {
      exists.should.eql(true);
      (!err).should.eql(true);
      done();
    })
  })

  it('should tell a group does not exist', function (done){
    windowsNet.groupExists('nopnop', function (err, exists) {
      exists.should.eql(false);
      (!err).should.eql(false);
      done();
    })
  })

  it('should fails to add a non-existent user to a group', function (done){
    windowsNet.groupAddUser('Administrators', 'nopnop', {}, function (err, code) {
      (!err).should.eql(false);
      code.should.not.eql(0);
      done();
    })
  })

  it('should fails to add an user to a non-existent group', function (done){
    windowsNet.groupAddUser('nopnop', 'vagrant', {}, function (err, code) {
      (!err).should.eql(false);
      code.should.not.eql(0);
      done();
    })
  })

  it('should fails to remove a non-existent user to a group', function (done){
    windowsNet.groupRemUser('Administrators', 'nopnop', {}, function (err, code) {
      (!err).should.eql(false);
      code.should.not.eql(0);
      done();
    })
  })

  it('should fails to remove an user to a non-existent group', function (done){
    windowsNet.groupRemUser('nopnop', 'vagrant', {}, function (err, code) {
      (!err).should.eql(false);
      code.should.not.eql(0);
      done();
    })
  })

  it('should add a user to a group', function (done){
    windowsNet.groupAdd('jambon', {}, function () {
      windowsNet.userAdd('beurre', {}, function () {
        windowsNet.groupAddUser('jambon', 'beurre', {}, function (err, code) {
          (!err).should.eql(true);
          code.should.eql(0);
          done();
        })
      })
    })
  })

  it('should remove an user from a group', function (done){
    windowsNet.groupRemUser('jambon', 'beurre', {}, function (err, code) {
      (!err).should.eql(true);
      code.should.eql(0);
      windowsNet.userRemove('beurre', {}, function () {
        windowsNet.groupRemove('jambon', {}, function () {
          done();
        })
      })
    })
  })



})
