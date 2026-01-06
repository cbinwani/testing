"use client";

import { useNexxonn } from "@nexxonn-ai/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Home() {
	const router = useRouter();
	const nexxonn = useNexxonn();

	const createWorkspace = useCallback(async () => {
		const workspace = await nexxonn.createWorkspace();
		router.push(`/workspaces/${workspace.id}`);
	}, [router.push, nexxonn]);
	const createSampleWorkspace = useCallback(async () => {
		const results = await nexxonn.createSampleWorkspaces();
		// Use the first workspace if multiple are created
		if (Array.isArray(results) && results.length > 0 && results[0]) {
			const { workspace } = results[0];
			router.push(`/workspaces/${workspace.id}`);
		}
	}, [router.push, nexxonn]);
	return (
		<div className="p-[24px] flex gap-[8px]">
			<button
				type="button"
				onClick={createWorkspace}
				className="cursor-pointer"
			>
				Create workspace
			</button>
			<button
				type="button"
				onClick={createSampleWorkspace}
				className="cursor-pointer"
			>
				Create sample workspace
			</button>
			<Link className="cursor-pointer" href="/ui">
				UI
			</Link>
		</div>
	);
}
