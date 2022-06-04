<br />
<div align="center">
  <a href="https://github.com/GnussonNet/cli-webserver">
  <img src="https://github.com/GnussonNet/cli-webserver/blob/master/.github/logo.svg" alt="logo" width="200" height="200">
  </a>

  <h1 align="center">🔥 cli-webserver, simplifies webservers 🔥</h1>

  <p align="center">
		<a href="https://github.com/GnussonNet/cli-webserver/graphs/contributors"><img alt="Downloads per month" src="https://img.shields.io/github/contributors/GnussonNet/cli-webserver.svg?style=for-the-badge"/></a>
<a href="https://github.com/GnussonNet/cli-webserver/network/members"><img alt="NPM Version" src="https://img.shields.io/github/forks/GnussonNet/cli-webserver.svg?style=for-the-badge"/></a>
<a href="https://github.com/GnussonNet/cli-webserver/stargazers"><img alt="Dependencies" src="https://img.shields.io/github/stars/GnussonNet/cli-webserver.svg?style=for-the-badge"></a>
<a href="https://github.com/GnussonNet/cli-webserver/issues"><img alt="Contributors" src="https://img.shields.io/github/issues/GnussonNet/cli-webserver.svg?style=for-the-badge"/></a>
<a href="https://github.com/GnussonNet/cli-webserver/blob/master/LICENSE"><img alt="Custom badge" src="https://img.shields.io/github/license/GnussonNet/cli-webserver.svg?style=for-the-badge"/></a>
<a href="https://linkedin.com/in/gnussonnet"><img alt="Maintained" src="https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555"/></a>
	</p>

  <p align="center">
    This CLI simplifies the creation and renewal of a webserver running with SSL certificates. With a modified Nginx Dockerfile and <a href="https://letsencrypt.org/">Let's Encrypts</a> client called <a href="https://github.com/certbot/certbot">Certbot</a>, it takes seconds to be up and running.
    <br />
    <br />
    <a href="https://github.com/GnussonNet/cli-webserver/issues/new?assignees=&labels=&template=bug_report.md">🕵🏽 Report Bug</a>
    -
    <a href="#contact">✍🏼 Contact</a>
    -
    <a href="https://github.com/GnussonNet/cli-webserverissues/new?assignees=&labels=&template=feature_request.md">🙇 Request Feature</a>
  </p>
</div>

<br />

<img title="Product Screenshot" alt="Product screenshot" src="https://github.com/GnussonNet/cli-webserver/blob/master/.github/preview.png">

<br />

## Table of Contents
<ol>
  <li>
    <a href="#cli-webserver-with-ssl">About The Project</a>
    <ul>
      <li><a href="#built-with">Built With</a></li>
    </ul>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#perquisites">Perquisites</a></li>
      <li><a href="#installation">Installation</a></li>
      <li><a href="#uninstall">Uninstall</a></li>
    </ul>
  </li>
  <li>
    <a href="#usage">Usage</a>
    <ul>
      <li><a href="#setup-webserver">Setup Webserver</a></li>
      <li><a href="#webserver-command-line-options">Command-line options</a></li>
    </ul>
  </li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
  <li><a href="#contact">Contact</a></li>
  <li><a href="#acknowledgments">Acknowledgments</a></li>
</ol>

<br />

## Built With
* [Node](https://nodejs.org)
* [Docker](https://www.docker.com/)
* [NGINX](https://nginx.org/)
* [NPM Dependencies](hhttps://www.npmjs.com/package/cli-webserver)

<br />

## Getting Started
### Disclaimer
This project is still under development which means it have not been tested on other machines, USE AT YOUR OWN RISK.

### Perquisites
Your system must have these following packages installed and running:

* [Docker](https://www.docker.com)
* [Node](https://nodejs.org)

### Installation
1. Install via NPM (globally)
   ```sh
   npm install -g cli-webserver
   ```
   
### Uninstall
1. Uninstall via NPM (globally)
   ```sh
   npm uninstall -g cli-webserver
   ```

<br />

## Usage
This script is farley straight forward to use

### Setup Webserver
1. Run the CLI
   ```sh
   webserver <environment> [options]
   ```
    or
   ```sh
   cliWebserver <environment> [options]
   ```
   or
   ```sh
   cli-webserver <environment> [options]
   ```

   Then follow the instructions on the screen

### Webserver command-line options
Option | Arguments  | Description
---|---|---
environment | `development`, `production` | Skips first question regarding dev/prod menu | null
-d | `domain.com` | Your domain is passed to Certbot and NGINX | null
-f | `PATH to frontend directory` | Path to your frontend directory | null
-c | `PATH to nginx config file` | Path to your nginx config file | null
-p | `0-9999` | Port to expose host (only development) | null
-e | `name@domain.com` | Email to register certificate (passed directly to Certbot) | null


<br />

## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br />

## License
Distributed under the MIT License. See `LICENSE` for more information.

<br />

## Contact
Filip "Gnusson" Magnusson - [@GnussonNet](https://twitter.com/GnussonNet) - admin@gnusson.net

Project Link: [Github.com/GnussonNet/cli-webserver(https://github.com/GnussonNet/cli-webserver)

<br />

## Acknowledgments
Special thanks to the below users who gave me a great start when creating this project.

* [Jonas Alfredssons](https://github.com/JonasAlfredsson) repository [docker-nginx-certbot](https://github.com/JonasAlfredsson/docker-nginx-certbot/blob/master/src/Dockerfile-alpine)
* [othneildrews](https://github.com/othneildrew) readme template [Best README Template](https://github.com/othneildrew/Best-README-Template)