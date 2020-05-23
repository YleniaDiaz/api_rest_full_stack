const Employee = require('../models/employee');

const controller = {};

controller.home = (req, res) => {
    res.render(`${req.app.get('PATH_LINKS')}/home`);
}

controller.list = async (req, res) => {
    const FLASH_MESSAGE = req.flash();
    if (FLASH_MESSAGE.success != undefined) {
        //OBJECT MY_MESSAGE FROM PASSPORT
        const MY_MESSAGE = JSON.parse((FLASH_MESSAGE.success));
        res.locals.myAlert = MY_MESSAGE;
    }

    const query = await Employee.findAll();
    const queryString = JSON.stringify(query);
    const LINKS = JSON.parse(queryString);

    LINKS.username = req.session.username;
    res.render(`${req.app.get('PATH_LINKS')}/list`, { LINKS });
}

controller.getAdd = (req, res) => {
    const LINKS = { username: req.session.username };
    res.render(`${req.app.get('PATH_LINKS')}/add`, { LINKS });
}

controller.postAdd = (req, res) => {
    const { name, salary } = req.body;

    if (name != undefined && salary != undefined && !isNaN(salary)) {
        Employee.create({
            name: name,
            salary: salary
        }).then(insertedEmployee => console.log(`POST ADD OK (ID -> ${insertedEmployee.id})`));
    } else {
        alert('Parámetros erróneos');
    }

    res.redirect('list');
}

controller.getEdit = async (req, res) => {
    const { id } = req.params;

    console.log({id});

    const query = await Employee.findAll({ where: { id: id } })
        .catch(err => console.log(`ERROR GET EDIT -> ${err}`));

    const employeeString = JSON.stringify(query);
    const LINKS = JSON.parse(employeeString);

    LINKS[0].username = req.session.username;

    if (LINKS.length > 0) {
        console.log(LINKS[0].dataValues);
    } else {
        console.log('No existe el usuario');
    }

    res.render(`${req.app.get('PATH_LINKS')}/edit`, { LINKS: LINKS[0]});
}

controller.postEdit = (req, res) => {
    const { id } = req.params;
    const { name, salary } = req.body;

    console.log(salary);

    Employee.update({
        name: name,
        salary: salary
    }, {
        where: {
            id: id
        }
    }
    ).then(employees => console.log('UPDATE OK'));;

    res.redirect('/list');
}

controller.delete = (req, res) => {
    const { id } = req.params;

    Employee.destroy({
        where: {
            id: 32
        }
    }).then(() => console.log('DELETE OK'))
        .catch(err => console.log(`ERROR DELETE: ${err.message}`));

    res.redirect('/list');
}

module.exports = controller;