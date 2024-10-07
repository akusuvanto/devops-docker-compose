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
  let processArray = [];

  for (let process of processes){
    process = process.trim()

    // Split into array at first space
    processArray.push(
      {"PID":     process.substring(0, process.indexOf(' '))
      ,"COMMAND": process.substring(process.indexOf(' ')+1)
    });};

  const processObject = {"Running Processes": processArray}
  return processObject;
}

async function getAvailableDiskSpace() {

  // Format output to remove unnescessary info
  const { stdout, stderr } = await exec('df -h --output=source,size,avail,pcent');
  
  let filesystems = stdout.trim().split("\n");

  // Remove headers by removing first element
  filesystems.shift();

  var fsArray = [];

  for (let filesystem of filesystems){
    filesystem = filesystem.trim()

    // Split output and filter out empty spaces, empty strings are falsy
    let lineData = filesystem.split(" ").filter(Boolean);

    fsArray.push(
      {"Filesystem":    lineData[0]
      ,"Size":          lineData[1]
      ,"Available":     lineData[2]
      ,"Used":          lineData[3]
    });
  };
  
  const fsObject = {"Available Disk Space": fsArray}
  return fsObject;
}

async function getTimeSinceLastBoot() {

  const { stdout, stderr } = await exec('cat /proc/uptime');
  
  const timeArray = stdout.trim().split(" ");

  // First value of /proc/uptime is time since last boot in seconds
  const timeObject = {"Time since Last Boot": {seconds:timeArray[0]}};
  return timeObject;
}

console.log(await getTimeSinceLastBoot());