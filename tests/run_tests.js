#!/usr/bin/env node

/**
 * Script to run multiple JavaScript files and catch any errors, exceptions,
 * or failed assertions that might occur during execution.
 * 
 * Usage: node run-js-files.js file1.js file2.js ...
 */

const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');

// Get file paths from command line arguments
const filesToRun = process.argv.slice(2);

if (filesToRun.length === 0) {
  console.error('Error: No files specified');
  console.error('Usage: node run-js-files.js file1.js file2.js ...');
  process.exit(1);
}

// Validate that all files exist and are JavaScript files
for (const file of filesToRun) {
  if (!fs.existsSync(file)) {
    console.error(`Error: File not found: ${file}`);
    process.exit(1);
  }
  
  if (!file.endsWith('.js')) {
    console.error(`Warning: File does not have .js extension: ${file}`);
  }
}

console.log(`Running ${filesToRun.length} JavaScript file(s)...\n`);

// Function to run a JavaScript file and handle its execution
function runFile(filePath) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);
    console.log(`Running: ${filePath}`);
    
    // Use fork to run the file in a separate Node.js process
    const child = fork(absolutePath, [], { 
      silent: true,
      // This allows uncaught exceptions to be properly captured
      execArgv: ['--unhandled-rejections=strict']
    });
    
    let stdout = '';
    let stderr = '';
    
    // Capture standard output
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    // Capture error output
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Handle process exit
    child.on('close', (code) => {
      if (code === 0) {
        if (stdout.trim()) {
          console.log('Output:');
          console.log(stdout);
        }
        console.log(`✓ ${filePath} completed successfully\n`);
        resolve();
      } else {
        console.error(`✗ ${filePath} failed with exit code ${code}`);
        if (stderr.trim()) {
          console.error('Error output:');
          console.error(stderr);
        }
        if (stdout.trim()) {
          console.error('Standard output:');
          console.error(stdout);
        }
        console.error(''); // Add newline
        reject(new Error(`Execution failed: ${filePath}`));
      }
    });
    
    // Handle other errors (like spawn errors)
    child.on('error', (err) => {
      console.error(`✗ Error running ${filePath}: ${err.message}`);
      reject(err);
    });
  });
}

// Run files in sequence
async function runFiles() {
  let hasError = false;
  let failedFiles = [];
  
  for (const file of filesToRun) {
    try {
      await runFile(file);
    } catch (error) {
      hasError = true;
      failedFiles.push(file);
    }
  }
  
  // Print summary
  console.log('--- Execution Summary ---');
  console.log(`Total files: ${filesToRun.length}`);
  console.log(`Successful: ${filesToRun.length - failedFiles.length}`);
  console.log(`Failed: ${failedFiles.length}`);
  
  if (failedFiles.length > 0) {
    console.log('\nFailed files:');
    failedFiles.forEach(file => console.log(`- ${file}`));
    process.exit(1);
  }
}

// Start the execution
runFiles().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});