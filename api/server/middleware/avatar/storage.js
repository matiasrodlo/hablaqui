import {
	bucket,
	getPublicUrlAvatar,
	getPublicUrlAvatarThumb,
} from '../../config/bucket';

/**
 * middlerware for save in google storage cloud
 * handler single image only
 */
const storage = (req, res, next) => {
	if (!req.file) return next();
	const { name, lastName, _id } = req.body;
	console.log(name, lastName, _id);
	const gcsname = `${_id}-${name.toLowerCase()}-${
		lastName ? lastName.toLowerCase() : ''
	}`;
	const file = bucket.file('profile-pictures/' + gcsname);
	const stream = file.createWriteStream({
		metadata: {
			contentType: req.file.mimetype,
		},
	});
	stream.on('error', err => {
		req.file.cloudStorageError = err;
		next(err);
	});
	stream.on('finish', () => {
		req.file.cloudStorageObject = req.file.originalname;
		req.file.avatar = getPublicUrlAvatar(gcsname);
		req.file.avatarThumbnail = getPublicUrlAvatarThumb(gcsname);
		next();
	});
	stream.end(req.file.buffer);
};

export default storage;
