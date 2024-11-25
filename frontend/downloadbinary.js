import { MongoBinary } from 'mongodb-memory-server';

const downloadMongoBinary = async () => {
    try {
        console.log('Downloading MongoDB binaries...');
        const binaryPath = await MongoBinary.getPath({
            version: '5.0.0', // Replace with the desired MongoDB version
        });
        console.log(`MongoDB binaries downloaded to: ${binaryPath}`);
        
    } catch (err) {
        console.error('Failed to download MongoDB binaries:', err);
    }
};

downloadMongoBinary();
