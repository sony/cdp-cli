# cdp-cli

## About cdp-cli

cdp command line interface


### Repository structure
Folder and file structure of this repository is the following list.

    root/
        dist/                                       // deploy target directory.
            @types/                                 // type definition file here.
        src/                                        // source file directory.
        docs/                                       // specification documents.
            reports/                                // test reports directory.
                coverage/                           // output test coverage reports.
                metrics/                            // output source metrics reports.
            typedoc/                                // typedoc generated documents here.
        tests/                                      // tests scripts directory.
        built/                                      // temporary built scripts here.


### How to install

    $npm install cdp-cli -g

### How to development

* setup

1. Prepare the following directory structure by doing the clone this repository and [cdp-lib](https://github.com/CDP-Tokyo/cdp-lib).

```
    cdp-cli/
    cdp-lib/
```


2. Run the following command.

    $npm install

    $npm run libmodule

* build

    $npm run build

* test

    $npm test

* deplay and update dependencies

    $npm run update


### How to use
Please see the following documentation.

- [English/英語](docs/en)
- [Japanese/日本語](docs/ja)

## Release Notes

[TODO]

## License

Apache-2.0
