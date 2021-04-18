class indexed_db {
    constructor() {
        let db = '';
        this.db = db;
    }

    openDB = () => {
        this.db = new Dexie("upaya_db");
        this.db.version(1).stores({
            upaya_users: 'id, first_name, last_name, email, phone, account_created, create_date_obj, *account_type, *acc_type'
        });
        this.db.open();
        return this.db;
    }

    testDbTransaction = async (user_obj) => {
        await this.openDB();
        console.time('Db Transaction Time ');
        await this.db.transaction('rw', this.db.upaya_users, () => {
            user_obj.forEach(user => {
                let act = [];
                if (Object.keys(user.account_type).length > 0) {
                    for (const [key, value] of Object.entries(user.account_type)) {
                        act.push(value);
                    }
                }
                this.db.upaya_users.put({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    email: user.email,
                    account_created: user.account_created,
                    create_date_obj: user.create_date_obj,
                    account_type: user.account_type,
                    acc_type: act
                }).catch((error) => {
                    console.error("Ooops: " + error);
                });
            });
        }).catch((error) => {
            console.error("Ooops: " + error);
            return false;
        });
        console.timeEnd('Db Transaction Time ');

        this.createTable();
    }

    getResultArr = async (search_text) => {
        console.time('Search Query Time ');
        const users = await this.db.upaya_users
                .where('acc_type').startsWithIgnoreCase(search_text)
                .or("first_name").startsWithIgnoreCase(search_text)
                .or('last_name').startsWithIgnoreCase(search_text)
                .or('phone').startsWithIgnoreCase(search_text)
                .or('account_created').startsWithIgnoreCase(search_text)
                .or('email').startsWithIgnoreCase(search_text)
                .toArray()
        console.timeEnd('Search Query Time ');
        return users;
    }
}

export { indexed_db };