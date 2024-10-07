package main

import (
	"fmt"
	"log"
	"os/exec"
	"strings"
)

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

func main() {
	fmt.Printf("%v", getLocalIPAddresses())
}
