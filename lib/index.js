"use strict";

const execa = require("execa")
    , Listr = require("listr")
    , writeFile = require("write-file-p")
    , log = require("emoji-logger")
    , JsonFile = require("edit-json-file")
    ;

module.exports = class BloggifyTools {
    /**
     * init
     * Inits a new Bloggify app in the destination path.
     *
     * @name init
     * @function
     * @param {Options} options A string representing the destination path or an object:
     *
     *  - `dest` (String): The destination path.
     *  - `name` (String): The folder name.
     *  - `conf` (Object): The configuration object.
     *
     * @param {Function} callback The callback function.
     * @return {EventEmitter} An event emitter which can be used for logging progress things.
     */
    static init (opts) {
        const dir = opts.dir || opts.name;
        const tasks = new Listr([
            {
                title: `Download the template repository`,
                task: () => execa("git", ["clone", opts.git_url, dir])
            },
            {
                title: "Install dependencies (this may take a while)",
                task: () => execa("npm", ["install"], { cwd: dir })
            },
            {
                title: "Setting up the configuration",
                task: () => execa("npm", ["install", "-S", "bloggify-config"], { cwd: dir })
            },
            opts.theme ? {
                title: "Install the theme",
                task: () => execa("npm", ["install", "-S", opts.theme], { cwd: dir })
            } : null,
            {
                title: "Create configuration file.",
                task () {
                    return new Promise((res, rej) => {
                        let conf = new JsonFile(`${dir}/config.json`);
                        conf.set({
                            title: opts.title
                          , description: opts.description
                          , domain: opts.domain
                          , theme: opts.theme
                        });
                        conf.save()
                        writeFile.sync(`${dir}/bloggify.js`, `"use strict";
module.exports = require("bloggify-config")(require("./config"));`);
                        res();
                    });
                }
            }
        ].filter(Boolean));
	tasks.run().then(() => {
            log.add("tada", "tada", "green", 3);
            log(`Your app was initialized in the '${dir}' directory.`, "tada");
            log(`To start the app, run:`, "tada");
            log(`  cd ${dir} && npm run start:dev`, "tada");
        }).catch(err => {
            log(err.message, "error");
	});
    }
};
