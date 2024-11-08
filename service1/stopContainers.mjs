import { promisify } from 'node:util';
import child_process from 'node:child_process';

const exec = promisify(child_process.exec);

export async function stopContainers() {

    const { stdout, stderr } = await exec(
        'curl -s -G -X GET --unix-socket \
        /var/run/docker.sock http:/v1.24/containers/json \
        --data \'all=true\' \
        --data-urlencode \'filters={\"label\":[\"com.akusuvanto\"]}\'');

    let containerArray= JSON.parse(stdout);
    containerArray.forEach(function (arrayItem) {
        stopById(arrayItem.Id)
    });
}

async function stopById(id) {

    const { stdout, stderr } = await exec(
        "curl -X POST --unix-socket \
        /var/run/docker.sock http:/v1.24/containers/" + id + "/stop"
    );
}
  