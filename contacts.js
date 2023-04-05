const fs = require("fs");
// import chalk from 'chalk';
const chalk = require("chalk");
const validator = require("validator");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const filePath = "./data/contacts.json";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

const tulisPertanyaan = (pertanyaan) => {
  return new Promise((resolve, reject) => {
    rl.question(pertanyaan, (value) => {
      resolve(value);
    });
  });
};

const loadContact = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

const simpanContact = (nama, email, noHP) => {
  const contact = { nama, email, noHP };
  // const file = fs.readFileSync('data/contacts.json', 'utf-8');
  // const contacts = JSON.parse(file);
  const contacts = loadContact();

  //cek duplikat
  const duplicate = contacts.find((contact) => contact.nama == nama);
  if (duplicate) {
    console.log(
      chalk.red.inverse.bold("Contact sudah terdaftar, gunakan nama lain!")
    );
    return false;
  }

  //cek email
  if (!validator.isEmail(email)) {
    console.log(chalk.red.inverse.bold("Email tidak valid!"));
    return false;
  }

  //cek nomor hp
  if (!validator.isMobilePhone(noHP, "id-ID")) {
    console.log(chalk.red.inverse.bold("Nomor Handphone tidak valid!"));
    return false;
  }

  contacts.push(contact);

  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));

  console.log(chalk.green.inverse.bold("Data telah ditambahkan."));
  // rl.close();
};

const listContact = () => {
  const contacts = loadContact();
  console.log(chalk.cyan.inverse.bold("Daftar Kontak : "));
  contacts.forEach((contact, i) => {
    console.log(`${i + 1}. ${contact.nama} - ${contact.noHP}`);
  });
};

const detailContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );

  if (!contact) {
    console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan!`));
    return false;
  }

  // console.log(chalk.cyan.inverse.bold(contact.nama));
  // console.log(contact.email);
  // console.log(contact.noHP);

  return contact;
};

const deleteContact = (email, nama) => {
  const contacts = loadContact();
  const newContacts = contacts.filter(
    (contact) => contact.email.toLowerCase() !== email.toLowerCase()
  );

  if (contacts.length === newContacts.length) {
    console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan!`));
    return false;
  }

  fs.writeFileSync("data/contacts.json", JSON.stringify(newContacts));

  console.log(
    chalk.green.inverse.bold(`data contact ${nama} berhasil dihapus!`)
  );
};

module.exports = {
  // tulisPertanyaan,
  loadContact,
  simpanContact,
  listContact,
  detailContact,
  deleteContact,
};
