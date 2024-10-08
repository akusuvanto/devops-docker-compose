package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"strings"
)

type Process struct {
	PID     string
	COMMAND string
}

type Filesystem struct {
	Filesystem string
	Size       string
	Available  string
	Used       string
}

type Time struct {
	Seconds string
}

type ServiceStatus struct {
	IPAddresses       []string
	RunningProcesses  []Process
	DiskSpace         []Filesystem
	TimeSinceLastBoot Time
}

func getLocalIPAddresses() []string {
	outBytes, err := exec.Command("bash", "-c", "hostname -I").Output()
	if err != nil {
		log.Fatal(err)
	}

	out := string(outBytes)
	addresses := strings.TrimSuffix(out, "\n")
	addressesTrimmed := strings.Trim(addresses, " ")
	addressArray := strings.Split(addressesTrimmed, " ")

	return addressArray
}

func getRunningProcesses() []Process {
	outBytes, err := exec.Command("bash", "-c", "ps --no-headers -ax -o pid,command").Output()
	if err != nil {
		log.Fatal(err)
	}

	out := string(outBytes)
	outTrimmed := strings.TrimSuffix(out, "\n")
	processes := strings.Split(outTrimmed, "\n")
	var processArray []Process

	for _, line := range processes {
		process := strings.TrimSuffix(line, "\n")
		processTrimmed := strings.Trim(process, " ")

		var firstSpace = strings.Index(processTrimmed, " ")

		pid := processTrimmed[0:firstSpace]
		command := processTrimmed[firstSpace:]

		p := Process{pid, command}
		processArray = append(processArray, p)
	}
	return processArray
}

func getAvailableDiskSpace() []Filesystem {

	outBytes, err := exec.Command("bash", "-c", "df -h --output=source,size,avail,pcent").Output()
	if err != nil {
		log.Fatal(err)
	}

	out := string(outBytes)
	outTrimmed := strings.TrimSuffix(out, "\n")
	filesystems := strings.Split(outTrimmed, "\n")

	// remove the first element (headers)
	var filesystemsTrimmed = append(filesystems[:0], filesystems[1:]...)

	var fsArray []Filesystem

	for _, line := range filesystemsTrimmed {
		lineTrimmed := strings.TrimSuffix(line, "\n")

		lineData := strings.Split(lineTrimmed, " ")

		var lineDataClean []string
		for _, str := range lineData {
			if str != "" {
				lineDataClean = append(lineDataClean, str)
			}
		}
		f := Filesystem{lineDataClean[0], lineDataClean[1], lineDataClean[2], lineDataClean[3]}
		fsArray = append(fsArray, f)
	}
	return fsArray
}

func getTimeSinceLastBoot() Time {
	outBytes, err := exec.Command("bash", "-c", "cat /proc/uptime").Output()
	if err != nil {
		log.Fatal(err)
	}

	out := string(outBytes)
	outTrimmed := strings.TrimSuffix(out, "\n")
	timeArray := strings.Split(outTrimmed, " ")

	timeSinceBoot := timeArray[0]
	t := Time{timeSinceBoot}

	return t
}

func server(res http.ResponseWriter, req *http.Request) {

	response := ServiceStatus{
		getLocalIPAddresses(),
		getRunningProcesses(),
		getAvailableDiskSpace(),
		getTimeSinceLastBoot()}

	r, _ := json.Marshal(response)
	res.Write(r)
}

func main() {
	http.HandleFunc("/", server)

	fmt.Println("Service2 Ready!")
	http.ListenAndServe(":8198", nil)
}
