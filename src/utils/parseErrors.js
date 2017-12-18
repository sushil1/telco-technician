export default function(errors) {
	const result = {};
	Object.keys(errors).forEach(key => {
		result[key] = errors[key].message;
	});

	return result;
}
