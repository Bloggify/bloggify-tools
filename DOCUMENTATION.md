## Documentation

You can see below the API reference of this module.

### `init(options, callback)`
Inits a new Bloggify app in the destination path.

#### Params
- **Options** `options`: A string representing the destination path or an object:
 - `dest` (String): The destination path.
 - `name` (String): The folder name.
 - `conf` (Object): The configuration object.
- **Function** `callback`: The callback function.

#### Return
- **EventEmitter** An event emitter which can be used for logging progress things.

