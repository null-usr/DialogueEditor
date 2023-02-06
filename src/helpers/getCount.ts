// get the number of occurences

export function getCount(arr: any[], key: string, val: string) {
	const indexes = []
	let i = -1
	for (i = 0; i < arr.length; i++) {
		if (arr[i][key] === val) indexes.push(i)
	}
	return indexes.length
}
