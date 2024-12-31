"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

import { nanoid } from "nanoid";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import "react18-json-view/src/dark.css";

import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { runQuery } from "@/lib/actions";

import { Loader, Save, Trash2, EllipsisVertical, X, Plus, Bolt, Github } from "lucide-react";

function ConfigBar({ setProjectId, setDataset, setPerspective, projectId, dataset, perspective, setApiVersion, apiVersion, setCustomApiVersion, customApiVersion, setToken, token }) {
	const searchParams = useSearchParams();

	// sync search params with state
	useEffect(() => {
		console.log("param -> state  sync");

		if (searchParams.get("projectId")) {
			setProjectId(searchParams.get("projectId"));
		}
		if (searchParams.get("dataset")) {
			setDataset(searchParams.get("dataset"));
		}
		if (searchParams.get("perspective")) {
			setPerspective(searchParams.get("perspective"));
		}
		if (searchParams.get("apiVersion")) {
			setApiVersion(searchParams.get("apiVersion"));
		}
		if (searchParams.get("customApiVersion")) {
			setCustomApiVersion(searchParams.get("customApiVersion"));
		}
		if (searchParams.get("token")) {
			setToken(searchParams.get("token"));
		}
	}, []);
	return (
		<CollapsibleContent className="border border-r-0 text-foreground flex flex-col h-full CollapsibleContent">
			<div className="flex pl-3 border-b">
				<h5 className="border-b. py-2 font-bold">Env</h5>
			</div>
			<div className="flex-1 flex flex-col bg-background /*justify-between*/ p-3 rounded-l gap-5">
				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="projectID" className="font-normal mb-2">
						Project Id
					</Label>
					<Input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} id="projectId" placeholder="sanity projectId" />
				</div>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="dataset" className="font-normal mb-2">
						Dataset
					</Label>
					<Input type="text" value={dataset} onChange={(e) => setDataset(e.target.value)} id="dataset" placeholder="dataset" />
				</div>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="perspective" className="font-normal mb-2">
						Perspective
					</Label>
					<Select id="perspective" value={perspective} onValueChange={(value) => setPerspective(value)} defaultValue="raw" className="w-full max-w-sm">
						<SelectTrigger>
							<SelectValue placeholder="Perspective" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Perspective</SelectLabel>
								<SelectItem value="raw">Raw</SelectItem>
								<SelectItem value="previewDrafts">Preview Drafts</SelectItem>
								<SelectItem value="published">Published</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="apiVersion" className="font-normal mb-2">
						Api version
					</Label>
					<Select
						id="apiVersion"
						value={apiVersion}
						onValueChange={(value) => {
							if (value != "custom") {
								setCustomApiVersion("");
							}
							setApiVersion(value);
						}}
						defaultValue="2023-05-03"
						className="w-full max-w-sm"
					>
						<SelectTrigger>
							<SelectValue placeholder="Perspective" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Api version</SelectLabel>
								<SelectItem value="1">v1</SelectItem>
								<SelectItem value="x">vx</SelectItem>
								<SelectItem value="2021-03-25">v2021-03-25</SelectItem>
								<SelectItem value="2021-10-21">v2021-10-21</SelectItem>
								<SelectItem value="2022-03-07">v2022-03-07</SelectItem>
								<SelectItem value="2023-05-03">v2023-05-03</SelectItem>
								<SelectItem value="custom">Other</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				{apiVersion === "custom" && (
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="customApiVersion" className="font-normal mb-2">
							Custom api version
						</Label>
						<Input type="text" value={customApiVersion} onChange={(e) => setCustomApiVersion(e.target.value)} id="customApiVersion" placeholder="customApiVersion" />
					</div>
				)}
				<div className="grid w-full max-w-xl items-center gap-1.5">
					<Label htmlFor="token" className="font-normal mb-2">
						Token
					</Label>
					<Input type="text" value={token} onChange={(e) => setToken(e.target.value)} id="token" placeholder="token" />
				</div>
			</div>
			<div className="flex justify-end bg-background">
				<a href="https://github.com/Heracraft/sanity-client" target="_blank" className="text-white p-3">
					<svg className="fill-white size-6 " role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<title>GitHub</title>
						<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
					</svg>
				</a>
			</div>
		</CollapsibleContent>
	);
}

function TabHeader({ tabId, currentTab, setCurrentTab, queryTabs, setQueryTabs, tabRenameState, setTabRenameState }) {
	// tailwind classes for the parent div
	let className = "";
	if (tabId === currentTab) {
		className = "flex bg-background border-t border-t-white border-r py-2 pl-2 h-full";
	} else {
		className = "flex items-center border-t border-r w-full max-w-60 py-2 pl-2 hover:bg-accent h-full";
	}

	const closeCurrentTab = (tabId) => {
		console.log("close");
		if (Object.keys(queryTabs).length == 1) return; // if this is the last tab, dont close

		let temp = { ...queryTabs };
		delete temp[tabId];
		setQueryTabs(temp);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger className="w-full max-w-60 flex-shrink-0">
				<div
					onClick={function (e) {
						if (e.detail == 1 && tabId != currentTab) {
							// if the tab is not the current tab, set it as the current tab
							setCurrentTab(tabId);
						}
						if (e.detail == 2) {
							setTabRenameState({ isRenaming: true, tabId, value: queryTabs[tabId].name });
						}
					}}
					className={className}
				>
					{tabRenameState.isRenaming && tabRenameState.tabId === tabId && (
						<input
							autoFocus
							value={tabRenameState.value}
							onChange={(e) => {
								setTabRenameState({ ...tabRenameState, value: e.target.value });
							}}
							onKeyDown={(e) => {
								console.log(e.key);
								if (e.key == "Enter") {
									let temp = queryTabs;
									temp[tabId].name = e.target.value;
									setQueryTabs(temp);
									setTabRenameState({ isRenaming: false, tabId: "", value: "" });
								}
								if (e.key == "Escape") {
									setTabRenameState({ isRenaming: false, tabId: "", value: "" });
								}
							}}
							onBlur={(e) => {
								setTabRenameState({ isRenaming: false, tabId: "", value: "" });
							}}
							className="min-w-0 bg-inherit outline-none border-b pl-2"
						/>
					)}
					{(!tabRenameState.isRenaming || tabRenameState.tabId != tabId) && <p className="w-full pl-2">{queryTabs[tabId].name}</p>}
					<button onClick={() => closeCurrentTab(tabId)}>
						<X size={18} className="mx-4 text-muted-foreground" />
					</button>
				</div>
			</ContextMenuTrigger>

			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => {
						setTabRenameState({ isRenaming: true, tabId, value: queryTabs[tabId].name });
					}}
				>
					Rename
				</ContextMenuItem>
				<ContextMenuItem onClick={() => closeCurrentTab(tabId)}>Close</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default function Page() {
	const router = useRouter();
	const pathname = usePathname();

	const [projectId, setProjectId] = useState("");
	const [dataset, setDataset] = useState("");
	const [perspective, setPerspective] = useState("raw");
	const [apiVersion, setApiVersion] = useState("2023-05-03");
	const [customApiVersion, setCustomApiVersion] = useState("");
	const [token, setToken] = useState("");
	const [queryHistory, setQueryHistory] = useState([]);
	const [savedQueries, setSavedQueries] = useState([]);

	const [fetchStatus, setFetchStatus] = useState("idle");

	const [queryTabs, setQueryTabs] = useState({});
	const [currentTab, setCurrentTab] = useState("");
	const [tabRenameState, setTabRenameState] = useState({
		isRenaming: false,
		tabId: "",
		value: " ",
	});

	let params = [
		{
			name: "projectId",
			value: projectId,
		},
		{
			name: "dataset",
			value: dataset,
		},
		{
			name: "perspective",
			value: perspective,
		},
		{
			name: "apiVersion",
			value: apiVersion,
		},
		{
			name: "customApiVersion",
			value: customApiVersion,
		},
		{
			name: "token",
			value: token,
		},
	];

	// sync state with search params on state change
	useEffect(() => {
		const navigate = setTimeout(() => {
			console.log("navigate");

			let queryParameterPairs = [];
			params.forEach((param) => {
				if (param.value) {
					queryParameterPairs.push([param.name, param.value]);
				}
			});
			const queryParameters = new URLSearchParams(queryParameterPairs).toString();
			router.push(`${pathname}?${queryParameters}`);
		}, 500);
		return () => clearTimeout(navigate);
	}, [projectId, dataset, perspective, apiVersion, customApiVersion, token]);

	// sync stored query history with state

	useEffect(() => {
		let startingTabs = {};
		startingTabs[nanoid(3)] = { name: "New Tab", query: "", data: [] };
		setQueryTabs(startingTabs);
		setCurrentTab(Object.keys(startingTabs)[0]);

		setQueryHistory(JSON.parse(localStorage.getItem("queryHistory")) || []);
		setSavedQueries(JSON.parse(localStorage.getItem("savedQueries")) || []);
	}, []);

	return (
		<div>
			{/* this is getting long */}

			<Collapsible className="h-[100dvh] flex-1 w-full flex p-10 bg-black">
				<Suspense fallback={<Loader className="animate-spin" />}>
					<ConfigBar setProjectId={setProjectId} setDataset={setDataset} projectId={projectId} dataset={dataset} setPerspective={setPerspective} perspective={perspective} apiVersion={apiVersion} setApiVersion={setApiVersion} setCustomApiVersion={setCustomApiVersion} customApiVersion={customApiVersion} setToken={setToken} token={token} />
				</Suspense>
				<div className="flex flex-col flex-1">
					<div className="flex items-center text-foreground">
						<CollapsibleTrigger className="px-4 py-1.5 border-t border-l h-full flex items-center bg-background">
							<div className="p-1 rounded hover:bg-accent">
								<Bolt size={20} />
							</div>
						</CollapsibleTrigger>
						<div className="flex items-center flex-1 first:[&>]:border-l h-full overflow-auto w-auto.">
							{Object.keys(queryTabs).map((tabId, index) => (
								<TabHeader key={tabId} tabId={tabId} currentTab={currentTab} setCurrentTab={setCurrentTab} queryTabs={queryTabs} setQueryTabs={setQueryTabs} tabRenameState={tabRenameState} setTabRenameState={setTabRenameState} />
							))}
							<button
								onClick={() => {
									let newTabId = nanoid(3);
									setQueryTabs({ ...queryTabs, newTabId: { name: "New Tab" } });
									setCurrentTab(newTabId);
								}}
								className="grid place-content-center px-4 h-full hover:bg-accent"
							>
								<Plus size={18} />
							</button>
						</div>
					</div>
					<ResizablePanelGroup direction="horizontal" className="flex-1 border bg-background text-foreground">
						<ResizablePanel defaultSize={25}>
							<div className="flex h-full flex-col">
								<ResizablePanelGroup direction="vertical" className="text-foreground">
									<ResizablePanel defaultSize={75} className="flex h-full flex-col">
										<span className="px-3 pt-3 text-muted-foreground">Query</span>
										<textarea
											value={queryTabs[currentTab]?.query || ""}
											onChange={(e) => {
												let temp = { ...queryTabs };
												temp[currentTab].query = e.target.value;
												setQueryTabs(temp);
											}}
											className="bg-background h-full !outline-none resize-none px-3"
										></textarea>
									</ResizablePanel>
									<ResizableHandle withHandle />
									<ResizablePanel defaultSize={25} className="border-b p-3">
										{/* <span className="px-3 pt-3 text-muted-foreground">History</span> */}
										<Tabs defaultValue="history" className="max-h-full flex flex-col">
											<TabsList className="flex-shrink-0 w-fit">
												<TabsTrigger value="history">History</TabsTrigger>
												<TabsTrigger value="saved">Saved</TabsTrigger>
											</TabsList>
											<TabsContent value="history" className="gap-3 !mt-0 first:[&>*]:mt-3 flex flex-col overflow-y-auto thin-scrollbar">
												{/* <div className="flex flex-col  !flex-shrink-0 thin-scrollbar"> */}
												{queryHistory.length === 0 && <span className="text-muted-foreground">No history</span>}
												{queryHistory.map((query, index) => (
													<div
														key={index}
														className="flex items-center gap-2 w-full group"
														onClick={() => {
															let temp = { ...queryTabs };
															temp[currentTab].query = query;
															setQueryTabs(temp);
														}}
													>
														<p className="flex-1 text-start">{query}</p>
														<DropdownMenu>
															<DropdownMenuTrigger className="">
																<EllipsisVertical size={16} className="group-hover:block hidden" />
															</DropdownMenuTrigger>
															<DropdownMenuContent>
																<DropdownMenuItem
																	onClick={(e) => {
																		// e.stopPropagation();
																		setSavedQueries([...savedQueries, query]);
																		localStorage.setItem("savedQueries", JSON.stringify([...savedQueries, query]));
																	}}
																>
																	<Save />
																	Save
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={(e) => {
																		// e.stopPropagation();
																		let temp = queryHistory;
																		temp.splice(index, 1);
																		console.log(temp);
																		setQueryHistory(temp);
																		localStorage.setItem("queryHistory", JSON.stringify(temp));
																	}}
																>
																	<Trash2 />
																	Delete
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												))}
												{/* </div> */}
											</TabsContent>
											<TabsContent value="saved" className="gap-3 !mt-0 first:[&>*]:mt-3 flex flex-col overflow-y-auto thin-scrollbar">
												{savedQueries.length === 0 && <span className="text-muted-foreground">No saved queries</span>}
												{savedQueries.map((query, index) => (
													<div
														key={index}
														className="flex items-center gap-2 w-full group"
														onClick={() => {
															let temp = { ...queryTabs };
															temp[currentTab].query = query;
															setQueryTabs(temp);
														}}
													>
														<p className="flex-1 text-start">{query}</p>
														<button
															onClick={(e) => {
																e.stopPropagation();
																let temp = savedQueries;
																temp.splice(index, 1);
																setQueryHistory(temp);
																localStorage.setItem("savedQueries", JSON.stringify(temp));
															}}
															className="group-hover:flex gap-2 hidden"
														>
															<Trash2 size={16} />
														</button>
													</div>
												))}
											</TabsContent>
										</Tabs>
									</ResizablePanel>
									<div className="flex p-3">
										{fetchStatus === "idle" && (
											<Button
												className="w-full"
												onClick={async () => {
													try {
														let newQueryHistory = [...queryHistory, queryTabs[currentTab].query];
														setQueryHistory(newQueryHistory);
														localStorage.setItem("queryHistory", JSON.stringify(newQueryHistory));

														setFetchStatus("loading");
														const result = await runQuery(queryTabs[currentTab].query, { projectId, dataset, perspective, apiVersion, customApiVersion, token });

														let temp = queryTabs;
														temp[currentTab].data = result;
														setQueryTabs(temp);

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
								</ResizablePanelGroup>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={75} className="">
							<div className="p-3 overflow-y-scroll max-h-full thin-scrollbar">
								{/* <span className="font-semibold">Content</span> */}
								<span className="text-muted-foreground">Result</span>

								<JsonView src={queryTabs[currentTab]?.data || []} theme="vscode" collapsed={2} />
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</Collapsible>
		</div>
	);
}
