# SpriteAI120B

A lightweight Node.js web application that lets you upload `.zip` archives of sprite assets through a simple browser UI or a REST API.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later

## Getting started

```bash
# Install dependencies
npm install

# Start the server (default port 3000)
npm start
```

Open **http://localhost:3000** in your browser to access the upload page.

## API

### `POST /upload`

Upload a `.zip` file.

| Field | Type | Description |
|-------|------|-------------|
| `zipfile` | `file` | The `.zip` archive to upload |

**Success response (200)**

```json
{
  "message": "File uploaded successfully.",
  "filename": "1712345678901-123456789-sprites.zip",
  "originalname": "sprites.zip",
  "size": 204800
}
```

**Error response (400)**

```json
{ "error": "Only .zip files are allowed" }
```

### Example with `curl`

```bash
curl -X POST http://localhost:3000/upload \
  -F "zipfile=@/path/to/sprites.zip"
```

## Configuration

| Environment variable | Default | Description |
|----------------------|---------|-------------|
| `PORT` | `3000` | Port the server listens on |

Uploaded files are saved to the `uploads/` directory (created automatically, excluded from version control).
