"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import "react18-json-view/src/dark.css";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { runQuery } from "@/lib/actions";

import { Loader } from "lucide-react";

function ConfigBar({ setProjectId, setDataset, setPerspective, projectId, dataset, perspective }) {
	const searchParams = useSearchParams();

	// sync search params with state
	useEffect(() => {
		if (searchParams.get("projectId")) {
			setProjectId(searchParams.get("projectId"));
		}
		if (searchParams.get("dataset")) {
			setDataset(searchParams.get("dataset"));
		}
		if (searchParams.get("perspective")) {
			setPerspective(searchParams.get("perspective"));
		}
	}, []);
	return (
		<div className="flex justify-between bg-background border p-2 rounded">
			<div className="flex text-foreground gap-3">
				<div className="grid w-full max-w-sm items-center gap-1.5">
					{/* <Label htmlFor="projectID">project Id</Label> */}
					<Input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} id="projectId" placeholder="sanity projectId" />
				</div>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					{/* <Label htmlFor="dataset">dataset</Label> */}
					<Input type="text" value={dataset} onChange={(e) => setDataset(e.target.value)} id="dataset" placeholder="dataset" />
				</div>
				<Select onValueChange={(value)=>setPerspective(value)} defaultValue="raw" className="w-full max-w-sm">
					<SelectTrigger>
						<SelectValue placeholder="Perspective" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Perspective</SelectLabel>
							<SelectItem value="raw">Raw</SelectItem>
							<SelectItem value="published">Published</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

export default function Page() {
	const router = useRouter();
	const pathname = usePathname();

	const [data, setData] = useState([]);
	const [projectId, setProjectId] = useState("");
	const [dataset, setDataset] = useState("");
	const [query, setQuery] = useState("");
	const [perspective, setPerspective] = useState("raw");

	const [fetchStatus, setFetchStatus] = useState("idle");

	// sync state with search params on state change
	useEffect(() => {
		const navigate = setTimeout(() => {
			const queryParameters = new URLSearchParams([
				["projectId", projectId],
				["dataset", dataset],
				["perspective", perspective],
			]).toString();
			router.push(`${pathname}?${queryParameters}`);
		}, 500);
		return () => clearTimeout(navigate);
	}, [projectId, dataset,perspective]);

	return (
		<div className="h-[100dvh] flex-1 w-full flex flex-col p-10 bg-black dark gap-3">
			<Suspense fallback={<Loader className="animate-spin" />}>
				<ConfigBar setProjectId={setProjectId} setDataset={setDataset} projectId={projectId} dataset={dataset} setPerspective={setPerspective} perspective={perspective}/>
			</Suspense>
			<ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border bg-background text-foreground">
				<ResizablePanel defaultSize={25}>
					<div className="flex h-full flex-col">
						<span className="px-3 pt-3 text-muted-foreground">Query</span>
						<textarea value={query} onChange={(e) => setQuery(e.target.value)} className="bg-background h-full !outline-none resize-none px-3 border-b border-muted"></textarea>
						<div className="flex p-3">
							{fetchStatus === "idle" && (
								<Button
									className="w-full"
									onClick={async () => {
										try {
											setFetchStatus("loading");
											const result = await runQuery(query, { projectId, dataset, perspective });
											setData(result);
											setFetchStatus("idle");
										} catch (error) {
											console.error(error);
											setFetchStatus("error");
											setTimeout(() => setFetchStatus("idle"), 5000);
										}
									}}
								>
									Fetch
								</Button>
							)}
							{fetchStatus === "loading" && (
								<Button className="w-full flex gap-2" disabled>
									<Loader className="animate-spin" />
									Loading...
								</Button>
							)}
							{fetchStatus === "error" && (
								<Button className="w-full" variant="destructive" onClick={() => setFetchStatus("idle")}>
									An Error occurred
								</Button>
							)}
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={75} className="">
					<div className="p-3 overflow-y-scroll max-h-full thin-scrollbar">
						{/* <span className="font-semibold">Content</span> */}
						<span className="text-muted-foreground">Result</span>

						<JsonView src={data} theme="vscode" collapsed={2} />
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
