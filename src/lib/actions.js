"use server"

import { initializeClient } from "@/lib/store"

export async function runQuery(query, { projectId, dataset, perspective }) {
	try {
		const client = initializeClient(projectId, dataset, perspective);
		const result = await client.fetch(query);
        // console.log(result);
		return result;
        
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}