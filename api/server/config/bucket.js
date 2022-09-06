import { Storage } from '@google-cloud/storage'; // Se importa para poder usar el servicio de Cloud Storage

const gcs = new Storage();

const bucketName = process.env.BUCKETNAME

const bucket = gcs.bucket(bucketName);

// general purpose public URL (static content)
const getPublicUrl = filename => {
	return `https://storage.googleapis.com/${bucketName}/general/${filename}`;
};

// public URL for avatars (in full resolution)
const getPublicUrlAvatar = filename => {
	return `https://cdn.hablaqui.cl/profile-pictures/${filename}`;
};

// public URL for thumnail avatars (in thumbnail resolution)
const getPublicUrlAvatarThumb = filename => {
	return `https://cdn.hablaqui.cl/profile-pictures/thumbnails/${filename}_128x128`;
};

export { bucket, getPublicUrl, getPublicUrlAvatar, getPublicUrlAvatarThumb };
