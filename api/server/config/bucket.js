import { Storage } from '@google-cloud/storage';

const gcs = new Storage();

const bucketName = process.env.BUCKETNAME;

const bucket = gcs.bucket(bucketName);

const getPublicUrl = filename => {
	return `https://storage.googleapis.com/${bucketName}/${filename}`;
};

export { bucket, getPublicUrl };
