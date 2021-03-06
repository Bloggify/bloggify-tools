"use strict"

const execa = require("execa")
    , Listr = require("listr")
    , log = require("emoji-logger")
    , JsonFile = require("edit-json-file")
    , dotenv = require("dotenv")
    , fs = require("fs")
    , parseDbUri = require("parse-db-uri")

const APP_MODES = {
    DEVELOPMENT: 1,
    DEBUG: 2,
    PRODUCTION: 3
}

module.exports = class BloggifyTools {

    static getContext () {
        // TODO Resolve to the bloggify app directory
        const appRoot = process.cwd()
        return {
            appRoot,
            env: dotenv.parse(fs.readFileSync(`${appRoot}/.env`))
        }
    }

    static exec (cmd, args, cwd, stdin) {
        const proc = execa(cmd, args, { cwd, stdio: 'inherit'})
        //proc.stdout.pipe(process.stdout)
        //proc.stderr.pipe(process.stderr)
        //if (stdin) {
        //    process.stdin.pipe(proc.stdin)
        //}
        return proc
    }

    static applicationStart (mode) {
        const { appRoot } = BloggifyTools.getContext()
        switch (mode) {
            case APP_MODES.DEVELOPMENT:
                return BloggifyTools.exec("npm", ["run", "start:dev"], appRoot)
            case APP_MODES.DEBUG:
                return BloggifyTools.exec("npm", ["run", "start:debug"], appRoot)
            case APP_MODES.PRODUCTION:
                return BloggifyTools.exec("npm", ["run", "start"], appRoot)
        }
    }

    static databaseConnect () {
        const { appRoot, env } = BloggifyTools.getContext()
            , dbUrl = env.DB_URI

        if (!dbUrl) {
            return log("This application does not have a database url (DB_URI in the .env file).", "error")
        }

        const parsedURL = parseDbUri(dbUrl)
            , protocol = parsedURL.protocol

        switch (protocol) {
            case "mongodb":
                return BloggifyTools.exec("mongo", [dbUrl], appRoot, true)

            case "mysql":
                const args = [
                    `--user=${parsedURL.user}`
                  , `--password=${parsedURL.password}`
                  , `--host=${parsedURL.resource}`
                  , `--port=${parsedURL.port || 3306}`
                  , parsedURL.database
                ]
                return BloggifyTools.exec("mysql", args, appRoot, true)

            default:
                log("Unsupported database protocol/dialect.", "error")
                break;
        }
    }

    static applicationBundle () {
        const { appRoot } = BloggifyTools.getContext()
        return BloggifyTools.exec("npm", ["run", "bundle"], appRoot)
    }

    static runMigrations () {
        const { appRoot, env } = BloggifyTools.getContext()
        if (!env.DB_URI) {
            log(err.message, "error")
            return
        }
        return BloggifyTools.exec("npx", ["sequelize-cli", "db:migrate", "--url", env.DB_URI], appRoot)
    }

    static createMigration (name) {
        const { appRoot, env } = BloggifyTools.getContext()
        if (!env.DB_URI) {
            log(err.message, "error")
            return
        }
        return BloggifyTools.exec("npx", ["sequelize-cli", "migration:create", "--name", name], appRoot)
    }

    /**
     * init
     * Inits a new Bloggify app in the destination path.
     *
     * @name init
     * @function
     * @param {Options} options A string representing the destination path or an object:
     *
     *  - `title` (String): The app title.
     *  - `description` (String): The app description.
     *  - `domain` (String): The app production url.
     *  - `theme` (String): A theme to install from `npm`.
     *  - `dir` (String): The destination path.
     *
     * @param {Function} callback The callback function.
     * @return {EventEmitter} An event emitter which can be used for logging progress things.
     */
    static init (opts) {
        const dir = opts.dir || opts.name
        const tasks = new Listr([
            {
                title: `Download the template repository`,
                task: () => execa("git", ["clone", opts.git_url, dir])
            },
            {
                title: "Setting up the git repository",
                task: () => execa("git", ["remote", "remove", "origin"], { cwd: dir })
            },
            {
                title: "Install dependencies (this may take a while)",
                task: () => execa("npm", ["install"], { cwd: dir })
            },
            opts.theme ? {
                title: "Install the theme",
                task: () => execa("npm", ["install", "-S", opts.theme], { cwd: dir })
            } : null,
            {
                title: "Create configuration file.",
                task () {
                    return new Promise((res, rej) => {
                        let conf = new JsonFile(`${dir}/bloggify.json`)
                        conf.set({
                            title: opts.title
                          , description: opts.description
                          , domain: opts.domain
                        })
                        if (conf.get("adapter") && opts.theme) {
                            conf.set("adapter.1.theme.0", opts.theme.replace(/^bloggify\-/g, ""))
                        }
                        conf.save()
                        res()
                    })
                }
            }
        ].filter(Boolean))
	tasks.run().then(() => {
            log.add("tada", "tada", "green", 3)
            log(`Your app was initialized in the '${dir}' directory.`, "tada")
            log(`To start the app, run:`, "tada")
            log(`  cd ${dir} && npm run start:dev`, "tada")
        }).catch(err => {
            log(err.message, "error")
	})
    }
}

module.exports.APP_MODES = APP_MODES
