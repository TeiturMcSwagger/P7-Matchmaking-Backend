import * as dotenv from 'dotenv';

const result = dotenv.config()
 
if (result.error) {
    throw Error ("No .env file available. Create a .env file based on .env-template");
}
// console.log(result.parsed)
