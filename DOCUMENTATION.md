## Documentation

You can see below the API reference of this module.

### `init(options, callback)`
Inits a new Bloggify app in the destination path.

#### Params

- **Options** `options`: A string representing the destination path or an object:
 - `title` (String): The app title.
 - `description` (String): The app description.
 - `domain` (String): The app production url.
 - `theme` (String): A theme to install from `npm`.
 - `dir` (String): The destination path.
- **Function** `callback`: The callback function.

#### Return
- **EventEmitter** An event emitter which can be used for logging progress things.

