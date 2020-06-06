## Usage
- Install dependencies
- Minify pixel file per user preferences (or use included .babelrc config):
```
$ BABEL_ENV=production npm run build
```
- Call minified src in head of any given HTML file.

Running with Docker:
```
docker run -p 80:8080 --env-file ./.env tracking-pixel:latest
```

