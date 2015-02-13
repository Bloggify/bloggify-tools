// Dependencies
var Repo = require("gry")
  , OArgv = require("oargv")
  , Ul = require("ul")
  , Exec = require("child_process").exec
  , EventEmitter = require("events").EventEmitter
  ;

// Constants
const BLOGGIFY_SSH_URL = "git@github.com:IonicaBizau/Bloggify.git";

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
    ev.emit("progress", { type: "log", content: "Clonning Bloggify into " + this.path });
    r.exec(OArgv({
        _: [ this.ssh_url, options.name ]
    }, "clone"), function (err) {
        if (err) { return callback(err); }

        // Install dependencies
        ev.emit("progress", { type: "log", content: "Instaling dependencies." });
        this.npmInstall(function (err) {
            if (err) { return callback(err); }

            // Init config
            ev.emit("progress", { type: "log", content: "Initializing the configuration file." });
            this.initConfig(function (err) {
                if (err) { return callback(err); }

                // Install using the configuration file
                ev.emit("progress", { type: "log", content: "Installing Bloggify." });
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

module.exports = new BloggifyTools();
