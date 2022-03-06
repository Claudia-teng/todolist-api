const http = require('http');
const { v4: uuid } = require('uuid');

const todos = [];

const requestLisener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  }

  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === "/todos" && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "sucess",
      "data": todos
    }));
    res.end();
  } else if (req.url === "/todos" && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuid()
          }
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "sucess",
            "data": todos
          }));
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(JSON.stringify({
            "status": "failed",
            "message": "wrong data type, or todo id not found!"
          }));
          res.end();
        }
      } catch(err) {
        console.log('err', err);
        res.writeHead(400, headers);
        res.write(JSON.stringify({
          "status": "failed",
          "message": "wrong data type, or todo id not found!"
        }));
        res.end();
      }
    })
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      "status": "failed",
      "message": "no route"
    }));
    res.end();
  }
  
}

const server = http.createServer(requestLisener)
server.listen(3005)
