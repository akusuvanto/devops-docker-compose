package main

import (
	"fmt"
	"log"
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
	seconds string
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

	t := Time{timeArray[0]}
	return t
}

func main() {
	//fmt.Printf("%v", getLocalIPAddresses())
	// getRunningProcesses()
	fmt.Printf("%v", getTimeSinceLastBoot())
}
