/**
 * Measures and prints the execution time of an async function
 * @param {Function} asyncFn - The async function to execute
 * @param {string} [label] - Optional label for the timing output
 * @param {any[]} [args] - Arguments to pass to the async function
 * @returns {Promise<any>} - Returns whatever the async function returns
 */
export async function timeExecution<Result = any>(asyncFn: () => Promise<Result>, label = 'Function') {
    console.log(`Starting execution of: ${label}`);

    const startTime = performance.now();

    try {
        // Execute the function with provided arguments
        const result = await asyncFn();

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        console.log(`✅ ${label} completed in ${executionTime.toFixed(2)}ms`);

        return result;
    } catch (error:any) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        console.error(`❌ ${label} failed after ${executionTime.toFixed(2)}ms`);
        console.error(`Error: ${error.message}`);

        // Re-throw the error to allow proper error handling
        throw error;
    }
}