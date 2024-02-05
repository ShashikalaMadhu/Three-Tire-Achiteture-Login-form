const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const EmployeeModel = require("./Employee")
const CustomerModel = require("./Customer")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/employee");

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    EmployeeModel.findOne({ email: email })
        .then(employee => {
            if (employee) {
                if (employee.password === password) {
                    res.json({ role: "employee", message: "Success" });
                } else {
                    res.json({ role: "employee", message: "The password is incorrect" });
                }
            } else {
                // Check if the user is a customer
                CustomerModel.findOne({ email: email })
                    .then(customer => {
                        if (customer) {
                            if (customer.password === password) {
                                res.json({ role: "customer", message: "Success" });
                            } else {
                                res.json({ role: "customer", message: "The password is incorrect" });
                            }
                        } else {
                            res.json("No record existed");
                        }
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
});

app.post("/register", (req, res) => {
    CustomerModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})


app.listen(3001, () => {
    console.log("server is running")
})