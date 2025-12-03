import { addBreadcrumb } from "@sentry/nextjs";

export function createNestedKeys(obj: any, keys: string[], value: any, path = "@"): void {
	if (keys.length === 0) return;
	if (keys.length === 1) {
		if (obj[keys[0]] !== undefined) return;

		const debugData = {
			key: keys[0],
			path,
			value,
			object: obj,
		};

		console.debug(`Creating key '${keys[0]}' in object`, debugData);
		addBreadcrumb({
			message: `Creating key '${keys[0]}'`,
			data: debugData,
		});

		obj[keys[0]] = value;
		return;
	}

	const currentKey = keys[0];
	if (!obj[currentKey] || typeof obj[currentKey] !== "object") {
		obj[currentKey] = {};
	}

	createNestedKeys(obj[currentKey], keys.slice(1), value, `${path}.${currentKey}`);
}

export function cloneNestedKeys(source: any, target: any, path = "@"): void {
	if (!target || typeof target !== 'object' || Array.isArray(target)) {
		return;
	}

	if (!source || typeof source !== 'object' || Array.isArray(source)) {
		return;
	}

	for (const key in target) {
		if (target.hasOwnProperty(key)) {
			const currentPath = path === "@" ? key : `${path}.${key}`;

			if (!source.hasOwnProperty(key)) {
				source[key] = JSON.parse(JSON.stringify(target[key]));

				const debugData = {
					key,
					value: target[key],
					path: currentPath,
					sourceObject: source,
					targetObject: target,
				};

				console.debug(`Cloning key '${key}' from target to source at path '${currentPath}'`, debugData);
				addBreadcrumb({
					message: `Cloning key '${key}' from target to source`,
					data: debugData,
				});
			} else {
				if (typeof source[key] === 'object' && !Array.isArray(source[key]) &&
					typeof target[key] === 'object' && !Array.isArray(target[key])) {
					cloneNestedKeys(source[key], target[key], currentPath);
				}
			}
		}
	}
}
