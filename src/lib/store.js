import { createClient } from "@sanity/client";

export const initializeClient = (projectId, dataset="production", perspective = "raw", apiVersion = "2023-05-03", customApiVersion, token) => {
	let config = {
		projectId,
		dataset: dataset || "production",
		useCdn: false,
		perspective,
		apiVersion: customApiVersion || apiVersion,
	};
	if (token) {
		config.token = token;
	}
	return createClient(config);
};
