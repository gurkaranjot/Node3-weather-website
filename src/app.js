const path = require("path");
const express = require("express");

const hbs = require("hbs");
const app = express();
const port = process.env.PORT || 3000;
//getting weather data

const geoCode = require("./utlis/geocode");
const foreCast = require("./utlis/forecast");

//Define path for express config

const publicDir = path.join(__dirname, "../public");

const viewPath = path.join(__dirname, "../templates/views");

const partialPath = path.join(__dirname, "../templates/partials");
//setup handlebar engine and views location
app.set("view engine", "hbs");
app.set("views", viewPath);

hbs.registerPartials(partialPath);

//setup static directory to serve
app.use(express.static(publicDir));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Andrew Mead",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "gurkaran",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text",
    title: "Help",
    name: "Karan",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "you must provide an Address",
    });
  }

  geoCode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      foreCast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({ error: "you must provide a search term" });
  }
  console.log(req.query.search);
  res.send({
    product: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: 404,
    name: "Karan",
    errorMessage: "Help Article not found",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Karan",
    errorMessage: "Page Not Found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
