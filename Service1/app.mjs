import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function getLocalIPAddresses() {
  const { stdout, stderr } = await exec('hostname -I');
  const addressArray = stdout.trim().split(" ");
  const addressObject = {"IP Addresses": addressArray};

  return addressObject;
}

console.log(await getLocalIPAddresses());