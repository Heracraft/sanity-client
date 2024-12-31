// Discarded ui/functional components
import { nanoid } from "nanoid";

export default function ChromeStyleTabs() {
	// Didn't really like this design. It didn't match the border style
	let queryTabs = [
		{
			name: "Document Types",
			id: nanoid(3),
		},
		{
			name: "New Tab",
			id: nanoid(3),
		},
	];

	let currentTab = queryTabs[0].id;
	return (
		<div className="flex items-center text-foreground bg-accent pt-1">
			<div className="pl-2 py-1. rounded-br-xl.">
				<SidebarTrigger />
			</div>
			{queryTabs.map((tab, index) => {
				if (tab.id === currentTab) {
					return (
						<div className="flex w-full max-w-60 h-full">
							<div className="h-full bg-background">
								<div className="bg-accent w-2 !h-full rounded-br-lg"></div>
							</div>
							<div key={tab.id} className="flex items-center w-full bg-background py-1.5 pl-4 h-full rounded-t-lg">
								<p className="flex-1">{tab.name}</p>
								<button>
									<X size={18} className="mx-4 text-muted-foreground" />
								</button>
							</div>
							<div className="h-full bg-background">
								<div className="bg-accent w-2 !h-full rounded-bl-lg"></div>
							</div>
						</div>
					);
				} else {
					return (
						<div key={tab.id} className="flex items-center w-full max-w-48 py-1.5 pl-4 hover:bg-accent bg-blend-hard-light h-full">
							<p className="flex-1">{tab.name}</p>
							<button>
								<X size={18} className="mx-2 text-muted-foreground" />
							</button>
						</div>
					);
				}
			})}
		</div>
	);
}

function TabHeaderContent({tabId, currentTab, queryTabs, setQueryTabs, tabRenameState, setTabRenameState }) {
	// Neat, made the main component cleaner but introduced a new component that needed 5 props

	// tailwind classes for the parent div
	let className=""
	if (tabId === currentTab) {
		className = "flex w-full max-w-60  bg-background border-t border-t-white border-r py-2 pl-2 h-full";
	}
	else {
		className = "flex items-center border-t border-r w-full max-w-60 py-2 pl-2 hover:bg-accent h-full";
	}

	return (
		<div
			onClick={function (e) {
				if (e.detail == 2) {
					setTabRenameState({ isRenaming: true, tabId, value: queryTabs[tabId].name });
				}
			}}
			key={tabId}
			className={className}
		>
			{tabRenameState.isRenaming && tabRenameState.tabId === tabId && (
				<input
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
			<button>
				<X size={18} className="mx-4 text-muted-foreground" />
			</button>
		</div>
	);
}
