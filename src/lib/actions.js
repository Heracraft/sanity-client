"use server";

import { initializeClient } from "@/lib/store";

export async function runQuery(query, { projectId, dataset, perspective, apiVersion, customApiVersion, token }) {
	try {
		const client = initializeClient(projectId, dataset, perspective, apiVersion, customApiVersion, token);
		const result = await client.fetch(query);
		return result;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}
