import axios from 'axios';

let testResults = [];

function addTestResult(name, status) {
    // Ensure status is either "success" or "fail"
    if (status !== "success" && status !== "fail") {
        console.error("Invalid status. Please use 'success' or 'fail'.");
        return;
    }

    const result = {
        name: name,
        status: status
    };

    testResults.push(result);
}

// Display results in a human-readable format
function displayResults() {
    if (testResults.length === 0) {
        console.log("No test results available.");
        return;
     }

    console.log("Test Results:");
    testResults.forEach(result => {
        console.log(`Test: ${result.name}, Status: ${result.status}`);
    });
}

function checkTestResults() {

    let failedTests = 0;

    for (let result of testResults) {
        if (result.status === "fail") {
            failedTests++;
        }
    }

    if (failedTests == 0) {
        // Exit with code 0 if all tests pass
        console.log("All tests passed.");
        process.exit(0);  
    }
    // Exit with code 1 if any test has failed
    console.log(failedTests.toString() + " Test case(s) failed.");
    process.exit(1);  
    
}

// **********
// Test Block
// **********

async function test(){

    const tests = [
        // Test if the application state is available via HTTP API
        axios.get('http://localhost:8197/state')

            .then(function (response) {

                if (response.headers['content-type'] == "text/plain; charset=utf-8"){
                    addTestResult("GET State Content type is text/plain", "success");
                }
                else {
                    addTestResult("GET State Content type is text/plain", "fail");
                }

                if (response.data == "INIT"){
                    addTestResult("GET State initial value is INIT", "success");
                }
                else {
                    addTestResult("GET State initial value is INIT", "fail");
                }

            })
            .catch(function (error) {
                // Handle error (no response from API)
                addTestResult("GET State Content type is text/plain", "fail");
                addTestResult("GET State initial value is INIT", "fail");
        }),

        // Try to set the state to PAUSED (should not be allowed)
        axios.put('http://localhost:8197/state', "{\"status\":\"INIT\"}")

            .then(function (response) {

                if (response.status == "403"){
                    addTestResult("Trying to change state from INIT responds 403", "success");
                }
                else {
                    addTestResult("Trying to change state from INIT responds 403", "fail");
                }

            })
            .catch(function (error) {
                // Handle error (no response from API)
                addTestResult("Trying to change state from INIT responds 403", "fail");
        }),

        // Test if the application can send system status via HTTP API
        axios.get('http://localhost:8197/request')

            .then(function (response) {

                if (response.headers['content-type'] == "text/plain; charset=utf-8"){
                    addTestResult("GET Request Content type is text/plain", "success");
                }
                else {
                    addTestResult("GET Request Content type is text/plain", "fail");
                }

                if (response.status == "200"){
                    addTestResult("GET Request status is 200", "success");
                }
                else {
                    addTestResult("GET Request status is 200", "fail");
                }

            })
            .catch(function (error) {
                // Handle error (no response from API)
                addTestResult("GET Request Content type is text/plain", "fail");
                addTestResult("GET Request status is 200", "fail");
        }),

        // Test if state changes have been logged
        // NOTE: conflics with the requirement to return 403 on state change,
        // this should be changed when auth is implemeneted
        axios.get('http://localhost:8197/run-log')
            
            .then(function (response) {

                if (response.headers['content-type'] == "text/plain; charset=utf-8"){
                    addTestResult("GET run-log Content type is text/plain", "success");
                }
                else {
                    addTestResult("GET run-log Content type is text/plain", "fail");
                }

                if (response.data.toString().includes("INIT->PAUSED")){
                    addTestResult("GET run-log logged state change", "success");
                }
                else {
                    addTestResult("GET run-log logged state change", "fail");
                }

            })
            .catch(function (error) {
                // Handle error (no response from API)
                addTestResult("GET run-log Content type is text/plain", "fail");
                addTestResult("GET run-log logged state change", "fail");
        })
    ];

    const done = await Promise.all(tests);
    displayResults();
    checkTestResults();
}

test();