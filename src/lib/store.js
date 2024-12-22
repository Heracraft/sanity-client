import { createClient } from "@sanity/client";

export const initializeClient = (projectId, dataset, perspective = "raw") => {
	return createClient({
		projectId,
		dataset,
		useCdn: false,
		perspective: perspective === "raw" ? "raw" : "published",
		apiVersion: "2023-05-03",
	});
};
