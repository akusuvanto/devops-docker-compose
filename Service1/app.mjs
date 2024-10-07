import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function getLocalIPAddresses() {
  const { stdout, stderr } = await exec('hostname -I');
  const addressArray = stdout.trim().split(" ");
  const addressObject = {"IP Addresses": addressArray};

  return addressObject;
}

async function getRunningProcesses() {

  // Format ps -ax to return only PID and COMMAND
  const { stdout, stderr } = await exec('ps --no-headers -ax -o pid,command');
  
  const processes = stdout.trim().split("\n");
  var processArray = [];

  for (process of processes){
    process = process.trim()

    // Split into array at first space
    processArray.push(
      {"PID":     process.substring(0, process.indexOf(' '))
      ,"COMMAND": process.substring(process.indexOf(' ')+1)
    });};

  const processObject = {"Running Processes": processArray}

  return processObject;
}

console.log(await getRunningProcesses());