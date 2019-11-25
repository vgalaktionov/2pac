# 2pac

2pac is a node.js CLI tool to simplify maintaining a changelog and bumping package.json version numbers.

## Installation

Install globally with `npm install -g 2pac`, or just use it with `npx 2pac`.

## Usage

```
➜ 2pac
Usage: 2pac [options][command]

Options:
    -V, --version   output the version number
    -h, --help      output usage information

Commands:
    add             Add a new changelog entry.
    generate        Generate the CHANGELOG.md and update the version number in the package.json.
    init            Initialize the .2pacrc.json and create changelog entries folder.
    import          Import an existing CHANGELOG.md file.
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
