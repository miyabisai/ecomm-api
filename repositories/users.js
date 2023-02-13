const fs = require('fs');
const crypto = require('crypto');
const { REPL_MODE_SLOPPY } = require('repl');
const { threadId } = require('worker_threads');
//Use promise
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

const Repository = require('./repository');

class UserRepository extends Repository{
    async create(attrs){
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        //call back version
        // crypto.scrypt(attrs.password,salt,64,(err,buf)=>{
        //     const hashed = buf.toString('hex');
        // });
        //promise version
        const buf = await scrypt(attrs.password,salt,64);
        const hashed = buf.toString('hex');

        const records = await this.getAll();
        //records.push(attrs);
        records.push({
            ...attrs,
            password:`${hashed}.${salt}`
        });
        //await fs.promises.writeFile(this.filename,JSON.stringify(records));
        this.writeAll(records);
        return attrs;
    }

    async comparePasswords(saved,supplied){
        //const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1];
        const [hashed,salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied,salt,64);

        return hashed === hashedSuppliedBuf.toString('hex');
    }


}

module.exports = new UserRepository('user.json');