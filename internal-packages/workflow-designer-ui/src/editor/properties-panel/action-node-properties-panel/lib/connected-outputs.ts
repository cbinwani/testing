import type {
	ConnectionId,
	Input,
	NodeLike,
	Output,
} from "@nexxonn-ai/protocol";

export type InputWithConnectedOutput = Input & {
	connectedOutput?: Output & { node: NodeLike } & {
		connectionId: ConnectionId;
	};
};
