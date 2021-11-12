const updateObjectInArray = (array, payload) => {
	return array.map(item => {
		if (item._id !== payload._id) {
			// This isn't the item we care about - keep it as-is
			return item;
		}

		// Otherwise, this is the one we want - return an updated value
		return {
			...item,
			...payload,
		};
	});
};

export default updateObjectInArray;
