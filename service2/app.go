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

func main() {
	//fmt.Printf("%v", getLocalIPAddresses())
	getRunningProcesses()
	fmt.Printf("%v", getRunningProcesses())
}
