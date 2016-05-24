var spawn   = require('@mh-cbon/c-aghfabsowecwn').spawn;
var miss    = require('mississippi')
var split   = require('split')
var pkg     = require('./package.json');
var debug   = require('debug')(pkg.name);
var dStream = require('debug-stream')(debug);

var exec = function (bin, args, done) {
  debug('%s %s', bin, args.join(' '))
  var child = spawn(bin, args, {stdio: 'pipe'});

  var err;
  var code;
  child.stdout.pipe(dStream('stdout %s'))
  child.stderr.pipe(dStream('stderr %s'))

  child.on('error', function (e) {
    err = e;
    done(err);
    done = null;
  })

  child.on('exit', function (c) {
    code = c;
  })
  var stderr = '';
  child.stderr.on('data', function (d) {
    stderr += d.toString();
  })
  child.on('close', function () {
    done && debug('err %j code %s', err, code);
    done && done(err || stderr && new Error(stderr), code);
    done = null;
  })
  return child;
}

var groups = function (done) {
  var child = exec('net', ['localgroup'], function (err, code) {
    done && done(err, code);
    done = null;
  });

  var groups = []
  var started = false;
  child.stdout.pipe(
    miss.pipeline.obj(
      split(),
      miss.through.obj(function transform(chunk, enc, cb) {
        chunk = chunk.toString();
        if (chunk.match(/^[\-]+$/)) {
          started = true;
        }
        if (started && chunk.match(/^\*.+/)) {
          groups.push(chunk.match(/^\*(.+)/)[1])
        }
        cb();
      }, function flush(cb) {
        started && this.push(groups)
        cb();
      })
    )
  ).on('data', function (d) {
      debug('err %j code %s d %j', null, 0, d)
      done && done(null, 0, d);
      done = null;
  })
}

var groupDetails = function (name, done) {
  var child = exec('net', ['localgroup', name], function (err, code) {
    done && done(err, code);
    done = null;
  });

  var details = {
    users: []
  }
  var started = false;
  child.stdout.pipe(
    miss.pipeline.obj(
      split(),
      miss.through.obj(function transform(chunk, enc, cb) {
        chunk = chunk.toString();
        if (chunk.match(/^[\-]+$/)) {
          started = true;
        }else if (started) details.users.push(chunk);
        else if (chunk.match(/\s{2,}/)){
          var p = chunk.match(/^(.+)\s{2,}/)[1].replace(/\s+$/, '')
          var v = chunk.match(/\s{2,}(.+)$/)[1]
          details[p] = v;
        }
        cb();
      }, function flush(cb) {
        if (started) {
          details.users.pop();
          details.users.pop();
          details.users.pop();
          this.push(details)
        }
        cb();
      })
    )
  ).on('data', function () {
      debug('err %j code %s d %j', null, 0, details)
      done && done(null, 0, details);
      done = null;
  })
}

var groupExists = function (name, done) {
  groupDetails(name, function (err, code, data) {
    done(err, !!data);
  })
}

var groupAdd = function (name, opts, done) {
  var args = ['localgroup', '/add', name];
  exec('net', args, done);
}

var groupRemove = function (name, opts, done) {
  var args = ['localgroup', '/delete', name];
  exec('net', args, done);
}

var users = function (done) {
  var child = exec('net', ['user'], function (err, code) {
    done && done(err, code);
    done = null;
  });

  var users = []
  var started = false;
  child.stdout.pipe(
    miss.pipeline.obj(
      split(),
      miss.through.obj(function transform(chunk, enc, cb) {
        chunk = chunk.toString();
        if (chunk.match(/^[\-]+$/)) {
          started = true;
        }
        if (started && chunk.match(/\s{2,}/)) {
          users = users.concat(
            chunk.split(/\s{2,}/)
          )
        }
        cb();
      }, function flush(cb) {
        users.pop();
        started && this.push(users)
        cb();
      })
    )
  ).on('data', function (d) {
      debug('err %j code %s d %j', null, 0, d)
      done && done(null, 0, d);
      done = null;
  })
}

var userDetails = function (name, done) {
  var child = exec('net', ['user', name], function (err, code) {
    done && done(err, code);
    done = null;
  });

  var details = {
  }
  var started = false;
  child.stdout.pipe(
    miss.pipeline.obj(
      split(),
      miss.through.obj(function transform(chunk, enc, cb) {
        chunk = chunk.toString();
        if (chunk.match(/\s{2,}/)){
          var p = chunk.match(/^(.+)\s{2,}/)[1].replace(/\s+$/, '')
          var v = chunk.match(/\s{2,}(.+)$/)[1]
          if (chunk.match(/^Local Group/)) {
            p = 'Local Group Memberships'
            v = chunk.substr(p.length).replace(/^\s+/, '').replace(/\s+$/, '')
          } else if (chunk.match(/^Global Group/)) {
            p = 'Global Group Memberships'
            v = chunk.substr(p.length).replace(/^\s+/, '').replace(/\s+$/, '')
          }
          details[p] = v.trim();
          started = true;
        }
        cb();
      }, function flush(cb) {
        if (started) {
          if (details['Local Group Memberships']==='*None') {
            details['Local Group Memberships'] = '';
          }
          if (details['Global Group Memberships']==='*None') {
            details['Global Group Memberships'] = '';
          }
          details['Local Group Memberships'] = details['Local Group Memberships']
          .split(/\s{2,}/g).map(function (g) {
            return g.replace(/^\*/, '')
          });
          details['Global Group Memberships'] = details['Global Group Memberships']
          .split(/\s{2,}/g).map(function (g) {
            return g.replace(/^\*/, '')
          });
          this.push(details)
        }
        cb();
      })
    )
  ).on('data', function () {
      debug('err %j code %s d %j', null, 0, details)
      done && done(null, 0, details);
      done = null;
  })
}

var userExists = function (name, done) {
  userDetails(name, function (err, code, data) {
    done(err, !!data);
  })
}

var userAdd = function (name, opts, done) {
  if (opts.password==='*') return done(new Error('Password must not be *'))
  var args = ['user', '/add', name];
  if (opts.password) args.push(opts.password);
  exec('net', args, done);
}

var userRemove = function (name, opts, done) {
  var args = ['user', '/delete', name];
  exec('net', args, done);
}

var groupAddUser = function (group_name, user_name, opts, done) {
  var args = ['localgroup', group_name, user_name, '/add'];
  exec('net', args, done);
}

var groupRemUser = function (group_name, user_name, opts, done) {
    var args = ['localgroup', group_name, user_name, '/delete'];
  exec('net', args, done);
}

module.exports = {
  groups:         groups,
  groupDetails:   groupDetails,
  groupExists:    groupExists,
  groupAdd:       groupAdd,
  groupRemove:    groupRemove,
  groupAddUser:   groupAddUser,
  groupRemUser:   groupRemUser,
  users:          users,
  userDetails:    userDetails,
  userExists:     userExists,
  userAdd:        userAdd,
  userRemove:     userRemove,
}
