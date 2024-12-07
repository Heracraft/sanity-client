"use server"

import { initializeClient } from "@/lib/store"

export async function runQuery(query, { projectId, dataset }) {
	try {
		const client = initializeClient(projectId, dataset);
		const result = await client.fetch(query);
        console.log(result);
		return result;
        
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}