const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/api/course", (req, res) => {
  res.send(courses);
});

// /api/coures/1
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  console.log(course);
  if (!course) res.status(404).send("THe course ID was not found");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  console.log(course);
  //if not existing ., return 404
  if (!course) res.status(404).send("THe course ID was not found");
  //validate
  //if invalid , retuen 400- Bad request
  const result = validateCourse(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  //upate course
  course.name = req.body.name;
  //retuen the updated course
  res.send(course);
});

//Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
// app.post();

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const result = schema.validate(course);
  return result;
}

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  console.log(course);
  //if not existing ., return 404
  if (!course) res.status(404).send("THe course ID was not found");
  //validate
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});
