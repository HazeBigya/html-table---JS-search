import { indexed_db } from './indexedDB_class.js';
class data_app extends indexed_db {
    constructor(app_data) {
        super();
        this.users = app_data.users;
        this.records = app_data.records;
        this.table = app_data.tables.table;
        this.thead = app_data.tables.thead;
        this.col = app_data.tables.col;
        this.seacrhField = app_data.seacrhField;
        this.searchText = app_data.searchText;
        this.generateData();
    }

    generateData = () => {
        this.users.length = 0;

        for (let id = 1; id <= this.records; id++) {
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();
            let email = faker.internet.email();
            let random_date = faker.date.past(10, new Date());
            let acc_date = random_date.toISOString().slice(0, 10);
            let rand_num = faker.datatype.number({min: 10000000, max: 99999999});
            let phone = '98' + rand_num;

            this.users.push({
                "id": id,
                "first_name": firstName,
                "last_name": lastName,
                "phone": phone,
                "email": email,
                "account_created": acc_date,
                "create_date_obj": random_date,
                "account_type": {
                    "0": faker.finance.accountName(),
                    "1": faker.finance.accountName()
                }
            });
        }
        this.testDbTransaction(this.users);
    }

    clearTable = () => {
        const $table = this.table;
        $table.innerHTML = "";
        $table.innerHTML += this.thead;
    }

    tableErrorMessage = () => {
        let $table = this.table;
        let message = `<tbody><tr><th colspan="${this.col}" style="text-align: center;">No Data Found.</th></tr></tbody>`;
        $table.innerHTML += message;
    }

    createTable = async () => {
        await this.clearTable();
        let $table = this.table;
        const users = [...this.users];
        let tData = "";
        let tarray = [];
        console.time('Create Table Time ');
        if (await Object.keys(users).length > 0) {
            users.forEach(user => {
                let account_type = "";
                if (Object.keys(user.account_type).length <= 0) {
                    account_type = "-";
                }
                for (const [key, value] of Object.entries(user.account_type)) {
                    account_type += `<li>${value}</li>`;
                }

                tData = `<tbody>
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.first_name}</td>
                                    <td>${user.last_name}</td>
                                    <td>${user.phone}</td>
                                    <td>${user.email}</td>
                                    <td>${user.account_created}</td>
                                    <td><ul>${account_type}</ul></td>
                                </tr>
                            </tbody>`;
                tarray.push(tData);
            });

            let table_data = tarray.join('');
            $table.innerHTML += table_data;
        } else {
            this.tableErrorMessage();
        }
        console.timeEnd('Create Table Time ');
    }

    checkSearchVal = async () => {
        let input = document.querySelector("#search");
        if (input.value.trim() === "") {
            alert('Enter a value to search!');
            return false;
        }
        let search_text = input.value;

        let result = await this.getResultArr(search_text);
        this.users.length = 0;
        this.users = [...result];
        this.createTable();
    }

    keyUpSeachVal = async () => {
        let input = document.querySelector("#search_keyup");
        let search_text = input.value;
        let result = await this.getResultArr(search_text);
        this.users.length = 0;
        this.users = [...result];
        this.createTable();
    }

    setNewRecordNo = () => {
        let input = document.querySelector("#gen_num");
        let gen_amt = input.value;
        this.records = gen_amt;
        this.generateData();
    }

}

const testTable = document.getElementById('test_table');
const app_data = {
    users: [],
    records: 100,
    tables: {
        table: testTable,
        thead: `<thead>
                    <th>ID</th>
                    <th>Fisrt Name</th>
                    <th>Last Name</th>
                    <th>Phone No.</th>
                    <th>Email</th>
                    <th>Account Created</th>
                    <th>Account Type</th>
                </thead>`,
        col: 7
    },
    seacrhField: document.querySelector("#search"),
    searchText: ""
}
const dApp = new data_app(app_data);

let search_form = document.querySelector("#searchForm");
let search_keyup_form = document.querySelector("#searchKeyUpForm");
let genForm = document.querySelector("#genForm");
let keyup_search = document.querySelector("#search_keyup");
let reset_search = document.querySelector("#reset_search");

search_form.onsubmit = (e) => {
    e.preventDefault();
    dApp.checkSearchVal();
}

search_keyup_form.onsubmit = (e) => {
    e.preventDefault();
    if (keyup_search.value.length === 0) {
        dApp.generateData();
    }
}

let search_index = _.debounce(function (e) {
    let len = keyup_search.value.length;
    if (len > 2) {
        dApp.keyUpSeachVal();
    }
}, 500);

keyup_search.addEventListener("keyup", search_index, false);

reset_search.onclick = (e) => {
    e.preventDefault()
    dApp.generateData();
}

genForm.onsubmit = (e) => {
    e.preventDefault();
    dApp.setNewRecordNo();
}
