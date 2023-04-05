const {
  loadContact,
  simpanContact,
  listContact,
  detailContact,
  deleteContact,
} = require("./contacts");

const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    fs.readFile("./pages/index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });

      const tableData = loadContact();

      //   console.log(tableData);

      let no = 1;
      const tableRows = tableData
        .map((contact) => {
          return `<tr>
              <td style="padding: 5px">${no++}</td>
              <td style="padding: 5px">${contact.nama}</td>
              <td style="padding: 5px">${contact.email}</td>
              <td style="padding: 5px">${contact.noHP}</td>
              <td style="padding: 5px">
                <form method="POST" action="/delete">
                    <input type="hidden" id="email" name="email" value="${
                      contact.email
                    }">
                    <input type="hidden" id="nama" name="nama" value="${
                      contact.nama
                    }">
                    <button type="submit"">Hapus Data</button>
                </form>
              </td>
              <td style="padding: 5px">
                <form method="POST" action="/detail">
                    <input type="hidden" id="nama" name="nama" value="${
                      contact.nama
                    }">
                    <button type="submit">Detail Data</button>
                </form>
              </td>
          </tr>`;
        })
        .join("");

      //   const tableBody = tableRows.join("");

      //   console.log(tableRows);

      const result = data.toString().replace("{{tableBody}}", tableRows);

      res.write(result);
      res.end();
    });
  }

  if (req.url == "/tambah") {
    fs.readFile("./pages/tambah.html", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.write(`<h1>Server Error</h1>`);
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  }

  if (req.url == "/detail" && req.method == "POST") {
    fs.readFile("./pages/detail.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const { nama } = parseFormData(body);

        const tableData = detailContact(nama);
        console.log(tableData);
        const tableRows = `
                            <tr>
                                <td>Nama</td>
                                <td>:</td>
                                <td>${tableData.nama}</td> 
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>:</td>
                                <td>${tableData.email}</td> 
                            </tr>
                            <tr>
                                <td>No HP</td>
                                <td>:</td>
                                <td>${tableData.noHP}</td> 
                            </tr>
                            <tr>
                                <td><a href="/">Back To List</a></td>
                            </tr>`;

        const result = data.toString().replace("{{tableBody}}", tableRows);

        res.write(result);
        res.end();
      });
    });
  }

  if (req.url == "/save" && req.method == "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { nama, email, noHP } = parseFormData(body);
      simpanContact(nama, email, noHP);
      res.writeHead(302, { location: "/" });
      //   res.write(`<html>
      //   <head>
      //     <title>Alert</title>
      //     <script>
      //       alert('Thanks for submitting the form, ${nama}!');
      //       window.location.href = "/";
      //     </script>
      //   </head>
      //   <body>
      //   </body>
      // </html>`);
      res.end();
    });
  }

  if (req.url == "/delete" && req.method == "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { email, nama } = parseFormData(body);
      deleteContact(email, nama);
      res.writeHead(302, { Location: "/" });
      //   res.write(`<html>
      //   <head>
      //     <title>Alert</title>
      //     <script>
      //       alert('Contact <b>${nama}</b> Successfully deleted!');
      //       window.location.href = "/";
      //     </script>
      //   </head>
      //   <body>
      //   </body>
      // </html>`);
      res.end();
    });
  }
});

const parseFormData = (formData) => {
  const result = {};
  const pairs = formData.split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    result[key] = decodeURIComponent(value.replace(/\+/g, " "));
  }
  return result;
};

server.listen(3000, () => {
  console.log("Listening to port 3000...");
});
