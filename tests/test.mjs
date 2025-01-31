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
                
                console.log(response.headers['content-type'])

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
        })
    ];

    const done = await Promise.all(tests);
    displayResults();
    checkTestResults();
}

test();