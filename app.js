const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { get } = require("https");

async function createEmployee() {
    try {
        let employeeObj;
        const employeeInfo = await inquirer.prompt([
            {
                type: "input",
                message: "Employee Name:",
                name: "name"
            },
            {
                type: "input",
                message: "Employee ID:",
                name: "id"
            },
            {
                type: "input",
                message: "Employee Email:",
                name: "email"
            },
            {
                type: "list",
                message: "Role:",
                name: "role",
                choices: ['Manager', 'Engineer', 'Intern']
            }
        ])
        switch (employeeInfo.role) {
            case "Manager":
                const officeNumber = await inquirer.prompt([
                    {
                        type: "input",
                        message: "Office Number:",
                        name: "officeNumber"
                    }])
                //do some error checking
                employeeObj = new Manager(employeeInfo.name, employeeInfo.id, employeeInfo.email, officeNumber.officeNumber);
                return employeeObj;
            case "Engineer":
                const github = await inquirer.prompt([
                    {
                        type: "input",
                        message: "Github:",
                        name: "github"
                    }])
                //do some error checking
                employeeObj = new Engineer(employeeInfo.name, employeeInfo.id, employeeInfo.email, github.github);
                return employeeObj;
            case "Intern":
                const school = await inquirer.prompt([
                    {
                        type: "input",
                        message: "School:",
                        name: "school"
                    }])
                //do some error checking
                employeeObj = new Intern(employeeInfo.name, employeeInfo.id, employeeInfo.email, school.school);
                return employeeObj;
            default:
                console.log("Employee role not found");
                return
        }
    } catch (error) {
        console.log(error);
    }
}
async function getEmployees() {
    const employees = [];
    let loop = true;
    do {
        let newEmployee = await createEmployee();
        employees.push(newEmployee);
        await inquirer.prompt([
            {
                type: "list",
                message: "Add more employees?:",
                name: "continue",
                choices: ['Yes', 'No']
            },
        ]).then(response => {
            response.continue === "Yes" ? loop = true : loop = false;
        }).catch(error => {
            console.log(error);
        })
    } while (loop);
    return employees;
}

async function outputFolderExisits() {
    let folderExists = fs.mkdir(OUTPUT_DIR, function (error) { });
    return folderExists;
}
getEmployees().then(async (employees) => {
    let html = render(employees);
    await outputFolderExisits();
    await fs.writeFile(outputPath, html, function (error) {
        if (error) {
            console.log(error);
        }
    })
});


