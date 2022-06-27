
# WCarbon

*A simple and fast CLI tool for checking* <br>
*websites against the **[WebsiteCarbon API]**.*

<br>

## Installation

1.  Install [Deno].

2.  Install the command with:

    ```shell
    deno install \
        --allow-net
        --name wcarbon
        https://raw.githubusercontent.com/timharek/wcarbon/main/main.ts
    ```

<br>
<br>

## Usage

#### Help

*Check the help page for available flags / commands.*

```shell
wcarbon -h
```

#### URL

```shell
wcarbon -u https://timharek.no
```

#### URL + Short

```shell
wcarbon -su https://timharek.no
```

<br>


<!----------------------------------------------------------------------------->

[WebsiteCarbon API]: https://api.websitecarbon.com/
[Deno]: https://deno.land