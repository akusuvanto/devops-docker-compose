import { promisify } from 'node:util';
import child_process from 'node:child_process';
import http from 'http';

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

const server = http.createServer(async function (req, res) {

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