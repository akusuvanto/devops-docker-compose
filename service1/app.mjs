import { promisify } from 'node:util';
import child_process from 'node:child_process';
import http from 'http';
import { stopContainers } from './stopContainers.mjs';

const exec = promisify(child_process.exec);

async function getLocalIPAddresses() {
  const { stdout, stderr } = await exec('hostname -I');
  const addressArray = stdout.trim().split(" ");

  return addressArray;
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

  return processArray;
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
  
  return fsArray;
}

async function getTimeSinceLastBoot() {

  const { stdout, stderr } = await exec('cat /proc/uptime');
  
  const timeArray = stdout.trim().split(" ");

  // First value of /proc/uptime is time since last boot in seconds
  return {"Seconds": timeArray[0]}
}

async function getService2Status(url) {

  return fetch(url)
  .then((service2Response)=>service2Response.json())
  .then((responseText)=>{return responseText});

}

// Tracks if allowed to respond to requests
let sleepUntil = new Date().getTime();

const server = http.createServer(async function (req, res) {

  if (req.url == "/api/stop") {
    stopContainers();
  }

  // Prevent responding to requests if they have been recently responded to.
  // Node does not have a blocking sleep function and almost everything is async
  // so this is probably the least horrible way the requirement can be met.
  // The other option is to implement blocking sleep, but that has to be busy 
  // waiting so it's very far from ideal.
  if (new Date().getTime() < sleepUntil){
    return;
  }

  res.writeHead(200, {'Content-Type': 'application/json'});

  const ip = await getLocalIPAddresses();
  const processes = await getRunningProcesses();
  const diskspace = await getAvailableDiskSpace();
  const time = await getTimeSinceLastBoot();
  
  const service2 = await getService2Status(process.env.SERVICE_2_URL);

  let response = {"Service1": {
                  "IPAddresses": ip,
                  "RunningProcesses": processes,
                  "DiskSpace": diskspace,
                  "TimeSinceLastBoot": time
                },"Service2": service2
              };

	res.end(JSON.stringify(response));
  
  // Stop responding to requests for 2 seconds
  sleepUntil = new Date().getTime() + 2000;

});

server.listen(process.env.PORT, () => {
  console.log('Service1 Ready!');
});

// Handle graceful shutdown
process.on('SIGTERM', (code) => {
  console.log(`Service 1 exiting with code: ${code}`);
  process.exit();
});
process.on('SIGINT', (code) => {
  console.log(`Service 1 exiting with code: ${code}`);
  process.exit();
});