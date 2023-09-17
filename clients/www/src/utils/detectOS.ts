import platform from 'platform';

// Access the OS information
const clientOS = platform.os?.family;
console.log('Client OS:', clientOS);

export default platform.os?.family