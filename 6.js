process.nextTick(() => {
    console.log('Executed in next iteration');
})
console.log('Executed in current iteration');