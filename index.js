const jsdom = require("jsdom");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const axios = require("axios").default;
const app = express();
//const forbiden = [];

async function main(letters) {
  const res = await axios.get(
    `https://www.palabrasque.com/buscador.php?m=${letters}/`,
    {
      responseType: "text",
    }
  );

  const html = res.data.replaceAll("\n", "");

  const dom = new jsdom.JSDOM(html);
  const words = [
    ...dom.window.document.querySelectorAll("table td > a"),
  ].map((n) => n.innerHTML);

  const getRandomWord = () => {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
  };

  let word = getRandomWord();
  // while (forbiden.includes(word)) {
  //   word = getRandomWord();
  //   forbiden.push(word);
  // }

  return {
    word,
    words,
  };
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    methods: ["GET"],
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  const letters = req.query.l || "";
  console.log({ letters });
  const data = await main(letters);
  console.log({ data });
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server has started on port 3000");
});
