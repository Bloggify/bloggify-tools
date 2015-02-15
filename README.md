# Bloggify Tools
A set of tools for Bloggify administration.

## Installation
```sh
$ npm install -g bloggify-tools
```

## Usage

```sh
$ ./bin/bloggify --help
bloggify --help
usage: bloggify [command]
A set of tools for Bloggify administration.

command:
  init                    Inits a Bloggify website.
  install                 Installs Bloggify, inside of the
  -h --help               prints this output.

Documentation can be found at https://github.com/Bloggify/bloggify-tools
```

## Documentation
### `BloggifyTools()`
Creates a new instance of `BloggifyTools`.

### `init(options, callback)`
Inits the Bloggify framework in the destination path.

#### Params
- **Options** `options`: A string representing the destination path or an object:
 - `dest` (String): The destination path.
 - `name` (String): The folder name.
 - `conf` (Object): The configuration object.

- **Function** `callback`: The callback function.

#### Return
- **EventEmitter** An event emitter which can be used for logging progress things.

### `npmInstall(callback)`
Installs the dependencies.

#### Params
- **Function** `callback`: The callback function.

### `initConfig(options, callback)`
Inits the configuration file.

#### Params
- **Options** `options`: The options object.
- **Function** `callback`: The callback function.

### `install(callback)`
This function will:
 - download or init the content directory
 - download or init the theme directory

#### Params
- **Function** `callback`: The callback function.

### `initContentDir(callback)`
Inits the content directory.

#### Params
- **Function** `callback`: The callback function.


## How to contribute
1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## License
See the [LICENSE](./LICENSE) file.
