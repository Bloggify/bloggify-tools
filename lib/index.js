// Dependencies
var Repo = require("gry")
  , OArgv = require("oargv")
  , Ul = require("ul")
  , Exec = require("child_process").exec
  , EventEmitter = require("events").EventEmitter
  , FsExtra = require("fs-extra")
  ;

// Constants
const BLOGGIFY_SSH_URL = "git@github.com:IonicaBizau/Bloggify.git"
    , STARTER_CONTENT = "git@github.com:Bloggify/Starter.git"
    ;

/**
 * BloggifyTools
 * Creates a new instance of `BloggifyTools`.
 *
 * @name BloggifyTools
 * @function
 * @return {undefined}
 */
function BloggifyTools () {
    this.ssh_url = BLOGGIFY_SSH_URL;
    this.path = process.cwd();
    try {
        require(this.path + "/lib/config")
        this.bconf = Bloggify.getConfig();
    } catch (e) {}
}

/**
 * init
 * Inits the Bloggify framework in the destination path.
 *
 * @name init
 * @function
 * @param {Options} options A string representing the destination path or an object:
 *
 *  - `dest` (String): The destination path.
 *  - `name` (String): The folder name.
 *
 * @param {Function} callback The callback function.
 * @return {EventEmitter} An event emitter which can be used for logging progress things.
 */
BloggifyTools.prototype.init = function (options, callback) {

    var ev = new EventEmitter();
    if (typeof options === "string") {
        options = {
            dest: options
        };
    }

    Ul.merge(options, { name: "Bloggify" });

    this.options = options;
    this.path = options.dest + "/" + options.name;

    // Clone Bloggify
    var r = new Repo(options.dest);
    setTimeout(function() {
        ev.emit("progress", { type: "info", content: "Clonning Bloggify into " + this.path });
    }.bind(this), 0);

    r.exec(OArgv({
        _: [ this.ssh_url, options.name ]
    }, "clone"), function (err) {

        if (err && /already exists and is not an empty directory/.test(err.message)) {
            ev.emit("progress", { type: "warn", content: "Bloggify is already downloaded here: " + this.path });
            err = null;
        }

        if (err) { return callback(err); }

        // Install dependencies
        ev.emit("progress", { type: "info", content: "Instaling dependencies." });
        this.npmInstall(function (err) {
            if (err) { return callback(err); }

            // Add the bconf
            require(this.path + "/lib/config")
            this.bconf = Bloggify.getConfig();

            // Init config
            ev.emit("progress", { type: "info", content: "Initializing the configuration file." });
            this.initConfig(function (err) {
                if (err) { return callback(err); }

                // Install using the configuration file
                ev.emit("progress", { type: "info", content: "Installing Bloggify." });
                this.install(function (err) {
                    if (err) { return callback(err); }
                    callback();
                });
            }.bind(this));
        }.bind(this));
    }.bind(this));

    return ev;
};

/**
 * npmInstall
 * Installs the dependencies.
 *
 * @name npmInstall
 * @function
 * @param {Function} callback The callback function.
 * @return {undefined}
 */
BloggifyTools.prototype.npmInstall = function (callback) {
    Exec("npm install --production", { cwd: this.path }, callback);
};

/**
 * initConfig
 * Inits the configuration file.
 *
 * @name initConfig
 * @function
 * @param {Function} callback The callback function.
 * @return {undefined}
 */
BloggifyTools.prototype.initConfig = function (callback) {
    callback();
};

/**
 * install
 * This function will:
 *  - download or init the content directory
 *  - download or init the theme directory
 *
 * @name install
 * @function
 * @param {Function} callback The callback function.
 * @return {undefined}
 */
BloggifyTools.prototype.install = function (callback) {
    var ev = new EventEmitter();
    var repo = new Repo(this.path);
    var conf = this.bconf;

    setTimeout(function() {
        ev.emit("progress", { type: "info", content: "Downloading the content repository." });
    }, 0);

    // Download the site content
    if (conf.site.git) {
        repo.exec(OArgv({
            recursive: true
          , _: [conf.site.git, this.path + conf.content]
        }, "clone"), callback);
    } else {
        this.initContentDir(callback);
    }

    return ev;
};

/**
 * initContentDir
 * Inits the content directory.
 *
 * @name initContentDir
 * @function
 * @param {Function} callback The callback function.
 * @return {undefined}
 */
BloggifyTools.prototype.initContentDir = function (callback) {
    var repo = new Repo(this.path);
    // Download the starter repository
    repo.exec(OArgv({
        recursive: true
      , _: [STARTER_CONTENT, this.path + this.bconf.content]
    }, "clone"), function (err) {
        if (err && /already exists and is not an empty directory/.test(err.message)) {
            err = null;
        }
        if (err) { return callback(err); }
    });
};

module.exports = new BloggifyTools();
